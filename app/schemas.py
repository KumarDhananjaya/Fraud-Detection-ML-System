from pydantic import BaseModel, Field


class Transaction(BaseModel):
    Time: float = Field(...)

    V1: float = Field(...)
    V2: float = Field(...)
    V3: float = Field(...)
    V4: float = Field(...)
    V5: float = Field(...)
    V6: float = Field(...)
    V7: float = Field(...)
    V8: float = Field(...)
    V9: float = Field(...)
    V10: float = Field(...)
    V11: float = Field(...)
    V12: float = Field(...)
    V13: float = Field(...)
    V14: float = Field(...)
    V15: float = Field(...)
    V16: float = Field(...)
    V17: float = Field(...)
    V18: float = Field(...)
    V19: float = Field(...)
    V20: float = Field(...)
    V21: float = Field(...)
    V22: float = Field(...)
    V23: float = Field(...)
    V24: float = Field(...)
    V25: float = Field(...)
    V26: float = Field(...)
    V27: float = Field(...)
    V28: float = Field(...)

    Amount: float = Field(..., ge=0)


class PredictionResponse(BaseModel):
    prediction: str
    fraud_probability: float
    decision_threshold: float
    risk_level: str


class BatchPredictionRow(BaseModel):
    row_index: int
    amount: float
    prediction: str
    fraud_probability: float
    decision_threshold: float
    risk_level: str


class BatchPredictionResponse(BaseModel):
    total_rows: int
    fraud_count: int
    legitimate_count: int
    results: list[BatchPredictionRow]