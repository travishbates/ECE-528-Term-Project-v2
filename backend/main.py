import firebase_admin
from firebase_admin import auth
from fastapi import FastAPI, UploadFile, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy import Column, UUID, TIMESTAMP, VARCHAR, NUMERIC
from sqlalchemy import create_engine, func
from sqlalchemy import engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from google.cloud import secretmanager
import pandas as pd
import os

import uvicorn
import csv
import codecs
import uuid

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
    print(user['user_id'])
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


@app.post("/reports/request")
def request_report(request: ReportRequest, user = Depends(get_firebase_user)):
    database = Session()
    database_results = database.query(Transaction).filter(
        Transaction.user_id == user["user_id"],
        Transaction.time_transacted >= request.startDate,
        Transaction.time_transacted <= request.endDate
    ).all()
    database.close()

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

                output = output.append({
                    'description': str(amount_to_record) + " " + row["asset_name"],
                    'date_acquired': date_acquired,
                    'date_sold': row['time_transacted'],
                    'proceeds': proceeds,
                    'cost_basis': cost_basis,
                    'gain': gain,
                }, ignore_index=True)

    csv = output.to_csv(index=False)
    return StreamingResponse(iter(csv), media_type="text/csv")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
