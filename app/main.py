from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
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