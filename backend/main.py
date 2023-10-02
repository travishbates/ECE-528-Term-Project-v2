from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, UUID, TIMESTAMP, VARCHAR, NUMERIC
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Engine = create_engine("postgresql://postgres:password@localhost:5432/postgres")
Session = sessionmaker(Engine)
Base = declarative_base()


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
def get_transactions():
    database = Session()
    database_results = database.query(Transaction).all()
    database.close()
    return database_results
