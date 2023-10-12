from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy import Column, UUID, TIMESTAMP, VARCHAR, NUMERIC
from sqlalchemy import create_engine, func
from sqlalchemy import engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
import pandas as pd
import os

import uvicorn
import csv
import codecs
import uuid

Engine = create_engine(
    engine.url.URL.create(
        drivername="postgresql+psycopg2",
        username="postgres",
        password=os.environ["DATABASE_PASSWORD"],
        query={"host": os.environ["DATABASE_HOST"]},
    ))

Session = sessionmaker(Engine)
Base = declarative_base()

class ReportRequest(BaseModel):
    startDate: str
    endDate: str


class Transaction(Base):
    __tablename__ = "transaction"

    id = Column(UUID, primary_key=True, index=True)
    time_transacted = Column(TIMESTAMP)
    asset_purchased_name = Column(VARCHAR)
    asset_purchased_quantity = Column(NUMERIC)
    asset_sold_name = Column(VARCHAR)
    asset_sold_quantity = Column(NUMERIC)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins = [
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/sample-transactions")
def hello_world():
    return [
        {
            "time": "Time1",
            "assetBoughtName": "Asset1",
            "assetBoughtAmount": 123,
            "assetSoldName": "Asset2",
            "assetSoldAmount": 456
        },
        {
            "time": "Time2",
            "assetBoughtName": "Asset2",
            "assetBoughtAmount": 333,
            "assetSoldName": "Asset3",
            "assetSoldAmount": 789
        }
    ]

@app.get("/transactions")
def get_transactions(page: int = 0, pageSize: int = 10):
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
async def post_transactions(file: UploadFile):
    reader = csv.DictReader(codecs.iterdecode(file.file, "utf-8"))
    rows = []

    for row in reader:
        rows.append(Transaction(
            id=uuid.uuid4(),
            time_transacted=row["time_transacted"],
            asset_purchased_name=row["asset_purchased_name"],
            asset_purchased_quantity=row["asset_purchased_quantity"],
            asset_sold_name=row["asset_sold_name"],
            asset_sold_quantity=row["asset_sold_quantity"]
        ))

    database = Session()
    database.add_all(rows)
    database.commit()
    database.close()


@app.get("/transaction/{id}")
def delete_transaction(id):
    database = Session()
    database.query(Transaction).filter_by(id = id).delete()
    database.commit()
    database.close()


@app.post("/reports/request")
def request_report(request: ReportRequest):
    data = [
        {"col1": "val1", "col2": "val2"},
        {"col1": "val3", "col2": "val4"},
    ]

    dataFrame = pd.DataFrame(data)
    csv = dataFrame.to_csv()
    return StreamingResponse(iter(csv), media_type="text/csv")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
