from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="Crop Price Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(_file_))
MODEL_PATH = os.path.join(BASE_DIR, "crop_price_model.pkl")

try:
    model_pipeline = joblib.load(MODEL_PATH)
except FileNotFoundError:
    model_pipeline = joblib.load('crop_price_model.pkl')

class PredictionRequest(BaseModel):
    market: str
    commodity: str
    year: int
    month: int

@app.post("/predict")
def predict_price(payload: PredictionRequest):
    input_df = pd.DataFrame([payload.dict()])
    predicted_price = model_pipeline.predict(input_df)[0]
    return {
        "predicted_price": round(float(predicted_price), 2),
        "currency": "LKR",
        "unit": "KG"
    }