from pathlib import Path
import joblib


BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "results" / "fraud_detection_xgb.pkl"
SCALER_PATH = BASE_DIR / "results" / "scaler.pkl"
THRESHOLD_PATH = BASE_DIR / "results" / "decision_threshold.txt"


model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

with open(THRESHOLD_PATH, "r") as file:
    threshold = float(file.read().strip())