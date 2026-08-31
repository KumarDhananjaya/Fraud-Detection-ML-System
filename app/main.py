from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.model import threshold

from app.schemas import (
    Transaction,
    PredictionResponse,
    BatchPredictionRow,
    BatchPredictionResponse,
)

from app.services.prediction import (
    predict_transaction
)

import io
import pandas as pd


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


REQUIRED_COLUMNS = {
    "Time", "Amount",
    "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10",
    "V11", "V12", "V13", "V14", "V15", "V16", "V17", "V18", "V19", "V20",
    "V21", "V22", "V23", "V24", "V25", "V26", "V27", "V28",
}


@app.post(
    "/api/v1/predict/batch",
    response_model=BatchPredictionResponse
)
async def predict_batch(file: UploadFile = File(...)):
    if not (file.filename.endswith(".csv") or file.filename.endswith(".tsv") or file.filename.endswith(".txt")):
        raise HTTPException(
            status_code=400,
            detail="Only CSV, TSV, or TXT files are accepted."
        )

    contents = await file.read()
    try:
        # Using sep=None allows pandas to automatically sniff the separator (comma, tab, semicolon)
        df = pd.read_csv(io.BytesIO(contents), sep=None, engine="python")
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Could not parse data file: {str(e)}"
        )

    # Convert columns to string and strip whitespace in case of dirty headers
    df.columns = [str(c).strip() for c in df.columns]

    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"Data is missing required columns: {sorted(missing)}"
        )

    has_class = "Class" in df.columns

    results = []
    for idx, row in df.iterrows():
        transaction_dict = {col: float(row[col]) for col in REQUIRED_COLUMNS}
        result = predict_transaction(transaction_dict)
        
        actual_class = None
        if has_class and not pd.isna(row["Class"]):
            actual_class = int(float(row["Class"]))

        results.append(BatchPredictionRow(
            row_index=int(idx),
            amount=float(row["Amount"]),
            prediction=result["prediction"],
            fraud_probability=result["fraud_probability"],
            decision_threshold=result["decision_threshold"],
            risk_level=result["risk_level"],
            actual_class=actual_class
        ))

    fraud_count = sum(1 for r in results if r.prediction.lower() == "fraud")
    return BatchPredictionResponse(
        total_rows=len(results),
        fraud_count=fraud_count,
        legitimate_count=len(results) - fraud_count,
        results=results,
    )