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

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "data", "crop_price_model.pkl")

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

class MarketAnalysisRequest(BaseModel):
    commodity: str
    year: int
    month: int

ALL_MARKETS = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Bandarawela', 'Batticaloa', 
    'Colombo City', 'Dammbagalla', 'Dehiattakandiya', 'Economic Centre - Peliyagoda', 
    'Economic Centre-Dambulla', 'Economic Centre-Maradagahamula', 'Economic Centre-Pettah', 
    'Embilipitiya', 'Fish market-Negombo', 'Fish market-Peliyagoda', 'Galenbindunuwewa', 
    'Galle', 'Gampaha', 'Hambantota', 'Hanguranketha', 'Jaffna', 'Kalutara', 'Kandy', 
    'Kegalle', 'Keppetipola (DEC}', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 
    'Matara', 'Meegoda(DEC)', 'Monaragala', 'Mulaitivu', 'Mullativu', 'National Average', 
    'Nikaweratiya', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Rathnapura', 
    'Thambuttegama', 'Tissamaharama', 'Trincomalee', 'Vavuniya'
]

@app.post("/analyze-markets")
def analyze_best_markets(payload: MarketAnalysisRequest):
    batch_data = []
    
    for market in ALL_MARKETS:
        batch_data.append({
            'market': market, 
            'commodity': payload.commodity,
            'year': payload.year,
            'month': payload.month
        })
        
    input_df = pd.DataFrame(batch_data)
    predictions = model_pipeline.predict(input_df)
    
    results = [
        {"market": ALL_MARKETS[i], "predicted_price": round(float(predictions[i]), 2)} 
        for i in range(len(ALL_MARKETS))
    ]
    
    sorted_results = sorted(results, key=lambda x: x["predicted_price"], reverse=False)
    
    return {
        "commodity_analyzed": payload.commodity,
        "highly_recommended_markets": sorted_results[:3],
    }