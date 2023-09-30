from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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