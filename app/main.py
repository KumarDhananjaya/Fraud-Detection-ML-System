from fastapi import FastAPI

from app.schemas import Transaction
from app.services.prediction import predict_transaction


app = FastAPI(
    title="Fraud Detection API",
    description="Machine learning API for credit card fraud detection",
    version="1.0.0"
)


@app.get("/")
def root():

    return {
        "message": "Fraud Detection API is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.post("/predict")
def predict(transaction: Transaction):

    result = predict_transaction(
        transaction.model_dump()
    )

    return result