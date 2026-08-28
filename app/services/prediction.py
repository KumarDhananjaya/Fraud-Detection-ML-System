import pandas as pd

from app.model import model, scaler, threshold


FEATURES = [
    "Time",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
    "V9",
    "V10",
    "V11",
    "V12",
    "V13",
    "V14",
    "V15",
    "V16",
    "V17",
    "V18",
    "V19",
    "V20",
    "V21",
    "V22",
    "V23",
    "V24",
    "V25",
    "V26",
    "V27",
    "V28",
    "Amount"
]


def get_risk_level(probability: float) -> str:

    if probability >= 0.80:
        return "HIGH"

    if probability >= 0.40:
        return "MEDIUM"

    return "LOW"


def predict_transaction(transaction):

    data = pd.DataFrame(
        [transaction],
        columns=FEATURES
    )

    data[["Time", "Amount"]] = scaler.transform(
        data[["Time", "Amount"]]
    )

    probability = model.predict_proba(
        data
    )[0, 1]

    prediction = (
        "fraud"
        if probability >= threshold
        else "legitimate"
    )

    risk_level = get_risk_level(
        probability
    )

    return {
        "prediction": prediction,
        "fraud_probability": float(probability),
        "decision_threshold": float(threshold),
        "risk_level": risk_level
    }