from fastapi import FastAPI
from app.model import threshold

from app.schemas import (
    Transaction,
    PredictionResponse
)

from app.services.prediction import (
    predict_transaction
)


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


@app.post(
     "/api/v1/predict",
    response_model=PredictionResponse
)
def predict(transaction: Transaction):

    return predict_transaction(
        transaction.model_dump()
    )

@app.get("/api/v1/model")
def model_info():

    return {
        "model": "XGBoost",
        "version": "1.0",
        "task": "Credit Card Fraud Detection",
        "threshold": float(threshold)
    }