import firebase_admin
from firebase_admin import auth
from fastapi import FastAPI, UploadFile, Depends, Request, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy import Column, UUID, TIMESTAMP, VARCHAR, NUMERIC, TEXT, desc
from sqlalchemy import create_engine, func
from sqlalchemy import engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from google.cloud import secretmanager
from datetime import datetime
from google.cloud import storage
import pandas as pd
import os

import uvicorn
import csv
import codecs
import uuid

storage_client = storage.Client()
storage_bucket = storage_client.get_bucket("reports-528")

databasePassword = os.getenv("DATABASE_PASSWORD")

if databasePassword is None:
    secretManagerServiceClient = secretmanager.SecretManagerServiceClient()
    databasePassword = secretManagerServiceClient.access_secret_version(
        request={"name": "projects/f2023-ece528-group7/secrets/DATABASE_PASSWORD/versions/latest"}
    ).payload.data.decode("UTF-8")


Engine = create_engine(
    engine.url.URL.create(
        drivername="postgresql+psycopg2",
        username="postgres",
        password=databasePassword,
        query={"host": os.environ["DATABASE_HOST"]},
    ))

Session = sessionmaker(Engine)
Base = declarative_base()

firebase_admin.initialize_app()


def get_firebase_user(request: Request):
    id_token = request.headers.get('Authorization')
    if not id_token:
        raise HTTPException(status_code=400, detail='Authorization header must be provided.')

    try:
        claims = auth.verify_id_token(id_token)
        return claims
    except Exception as e:
        raise HTTPException(status_code=401, detail='Unauthorized')


class ReportRequest(BaseModel):
    startDate: str
    endDate: str


class Transaction(Base):
    __tablename__ = "transaction"

    id = Column(UUID, primary_key=True, index=True)
    user_id = Column(VARCHAR)
    time_transacted = Column(TIMESTAMP)
    transaction_type = Column(VARCHAR)
    asset_name = Column(VARCHAR)
    asset_quantity = Column(NUMERIC)
    total_asset_amount_usd = Column(NUMERIC)


class Report(Base):
    __tablename__ = "report"

    id = Column(UUID, primary_key=True, index=True)
    user_id = Column(VARCHAR)
    status = Column(VARCHAR)
    requested_date = Column(TIMESTAMP)
    start_date = Column(TIMESTAMP)
    end_date = Column(TIMESTAMP)
    download_url = Column(TEXT)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins = [
        "http://localhost:5173",
        "https://gains-tracker-ui-dot-f2023-ece528-group7.ue.r.appspot.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/transactions")
def get_transactions(page: int = 0, pageSize: int = 10, user = Depends(get_firebase_user)):
    database = Session()
    database_results = database.query(Transaction).offset(page * pageSize).limit(pageSize).all()
    count = database.query(func.count(Transaction.id)).scalar()
    database.close()
    return {
        "count": count,
        "page": page,
        "pageSize": pageSize,
        "results": database_results
    }


@app.get("/reports")
def get_reports(page: int = 0, pageSize: int = 10, user = Depends(get_firebase_user)):
    database = Session()
    database_results = database.query(Report).order_by(desc(Report.requested_date)).offset(page * pageSize).limit(pageSize).all()
    count = database.query(func.count(Report.id)).scalar()
    database.close()
    return {
        "count": count,
        "page": page,
        "pageSize": pageSize,
        "results": database_results
    }

@app.get("/report/{id}")
def get_report(id, user = Depends(get_firebase_user)):
    database = Session()
    database_result = database.query(Report).filter_by(id=id, user_id=user["user_id"]).first()
    database.close()

    if database_result is None:
        return {
            'message': "Not found."
        }

    blob = storage_bucket.blob(str(database_result.id))
    return StreamingResponse(iter(blob.download_as_text()), media_type="text/csv")


@app.post("/transactions")
async def post_transactions(file: UploadFile, user = Depends(get_firebase_user)):
    reader = csv.DictReader(codecs.iterdecode(file.file, "utf-8"))
    rows = []

    for row in reader:
        rows.append(Transaction(
            id=uuid.uuid4(),
            user_id=user["user_id"],
            time_transacted=row["time_transacted"],
            transaction_type=row["transaction_type"],
            asset_name=row["asset_name"],
            asset_quantity=row["asset_quantity"],
            total_asset_amount_usd=row["total_asset_amount_usd"]
        ))

    database = Session()
    database.add_all(rows)
    database.commit()
    database.close()


@app.get("/transaction/{id}")
def delete_transaction(id, user = Depends(get_firebase_user)):
    database = Session()
    database.query(Transaction).filter_by(id = id).delete()
    database.commit()
    database.close()


def process_report(request: ReportRequest, user, file_name):
    database = Session()

    database_results = database.query(Transaction).filter(
        Transaction.user_id == user["user_id"],
        Transaction.time_transacted <= request.endDate
    ).all()

    inventory = {}
    output = pd.DataFrame(columns=['description', 'date_acquired', 'date_sold', 'proceeds', 'cost_basis', 'gain'])

    dataFrame = pd.DataFrame([row.__dict__ for row in database_results])

    for index, row in dataFrame.iterrows():
        if row['transaction_type'] == 'buy':
            if row['asset_name'] not in inventory:
                inventory[row['asset_name']] = []
            inventory[row['asset_name']].append(row)
        elif row['transaction_type'] == 'sell':
            asset_amount_need_to_record = row["asset_quantity"]
            while asset_amount_need_to_record > 0:
                purchase = inventory[row["asset_name"]][0]
                purchase_cost_per_amount = purchase["total_asset_amount_usd"] / purchase["asset_quantity"]
                amount_to_record = min(asset_amount_need_to_record, purchase["asset_quantity"])
                date_acquired = purchase["time_transacted"]

                if amount_to_record == purchase["asset_quantity"]:
                    cost_basis = purchase["total_asset_amount_usd"]
                    inventory[row["asset_name"]].pop(0)
                else:
                    cost_basis = purchase_cost_per_amount * amount_to_record
                    inventory[row["asset_name"]][0]["asset_quantity"] -= amount_to_record
                    inventory[row["asset_name"]][0]["total_asset_amount_usd"] -= amount_to_record * purchase_cost_per_amount

                proceeds = row["total_asset_amount_usd"] / row["asset_quantity"] * amount_to_record
                gain = proceeds - cost_basis

                asset_amount_need_to_record -= amount_to_record

                if row['time_transacted'] > datetime.strptime(request.startDate, "%Y-%m-%dT%H:%M:%S.%fZ"):
                    output = output.append({
                        'description': str(amount_to_record) + " " + row["asset_name"],
                        'date_acquired': date_acquired,
                        'date_sold': row['time_transacted'],
                        'proceeds': proceeds,
                        'cost_basis': cost_basis,
                        'gain': gain,
                    }, ignore_index=True)

    blob = storage_bucket.blob(str(file_name))
    blob.upload_from_string(output.to_csv(index=False))

    database.query(Report).filter_by(id=file_name).update({
        'status': 'complete',
        'download_url': blob.path
    })
    database.commit()
    database.close()


@app.post("/reports/request")
def request_report(request: ReportRequest, background_tasks: BackgroundTasks, user = Depends(get_firebase_user)):
    file_name = uuid.uuid4()
    database = Session()
    database.add(Report(
        id = file_name,
        user_id = user["user_id"],
        status = "in-progress",
        requested_date = datetime.now(),
        start_date = request.startDate,
        end_date = request.endDate
    ))
    database.commit()
    database.close()
    background_tasks.add_task(process_report, request, user, file_name)
    return {
        "message": "Report request submitted."
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
