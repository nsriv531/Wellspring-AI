from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# load pre-trained regression model
model = joblib.load("model.pkl")

class WellFeatures(BaseModel):
    md_m: float
    tvd_m: float
    proppant_tonnes: float
    primary_formation: str
    operator: str
    spud_month: int
    horizontal_flag: bool
    surface_lat: float
    surface_lon: float
    field: str | None = None

@app.post("/predict")
def predict(features: WellFeatures):
    # Convert features to vector (this is simplified — normally you'd apply same preprocessing as in training)
    X = np.array([[features.md_m, features.tvd_m, features.proppant_tonnes, features.spud_month]])
    y_pred = model.predict(X)[0]
    return {"p50": float(y_pred), "p10": float(y_pred * 0.85), "p90": float(y_pred * 1.15)}
