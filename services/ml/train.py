import pandas as pd
import joblib
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# Example: load your Alberta Energy Regulator dataset
df = pd.read_csv("aer_wells.csv")

# Features & target
X = df[["md_m", "tvd_m", "proppant_tonnes", "primary_formation", "operator", "spud_month"]]
y = df["cum_oil_12m"]

# Define preprocessing (categorical vs numeric)
categorical = ["primary_formation", "operator"]
numeric = ["md_m", "tvd_m", "proppant_tonnes", "spud_month"]

preprocess = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
    ("num", "passthrough", numeric)
])

# Model
model = GradientBoostingRegressor(n_estimators=200, max_depth=5)

# Pipeline = preprocessing + model
pipeline = Pipeline(steps=[
    ("preprocess", preprocess),
    ("model", model)
])

# Train
pipeline.fit(X, y)

# Save trained pipeline
joblib.dump(pipeline, "model.pkl")
print("✅ Model saved to model.pkl")
