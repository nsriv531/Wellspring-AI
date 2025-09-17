WellSight: Alberta Well Production Predictor

WellSight is a full-stack data science project that combines public Alberta Energy Regulator (AER) datasets, machine learning, and a Next.js frontend to forecast oil well performance for major Canadian operators (Cenovus, CNRL, Suncor, Imperial, etc.).

🔎 Project Overview

Energy companies and investors rely on accurate well forecasts to plan capital, evaluate projects, and monitor environmental impacts. Traditionally, petroleum engineers use decline-curve analysis or reservoir simulations. This project demonstrates how modern ML techniques can provide similar forecasts using only public data.

Data Engineering – Ingests and cleans AER datasets (ST37 well headers, ST60/ST60A production + flaring/venting).

Feature Engineering – Builds predictors from geology, well design, operator, spud timing, and completions data.

Machine Learning – Trains regression models (baseline Ridge → Gradient Boosted Trees) to estimate 12-month cumulative oil production.

Model Serving – Exposes predictions via FastAPI or ONNX runtime, consumable by web or other clients.

Frontend – Next.js + Tailwind dashboard with maps, KPI cards, well tables, and a “what-if” predictor form that returns P10/P50/P90 ranges.

🎯 Goals

Show that public data can support credible well forecasting.

Demonstrate a full end-to-end pipeline: data → SQL → ML → API → UI.

Provide interactive visuals that make model results accessible to both technical and non-technical users.

📊 Example Use Cases

Estimate how a new Cenovus or CNRL horizontal well may perform in its first year.

Compare flaring/venting intensity across operators and formations.

Explore production trends by formation, operator, or time window.

🚀 Tech Stack

Data: Alberta Energy Regulator datasets (ST37, ST60/ST60A, General Well Data).

Database: PostgreSQL for staging, feature marts, and labels.

ML: Python, pandas, scikit-learn, XGBoost, joblib.

API: FastAPI (with ONNX export option).

Frontend: Next.js (App Router), Tailwind, shadcn/ui, MapLibre/Recharts.

Infra: Docker + docker-compose for reproducibility.

📈 Roadmap

Add quantile regression / conformal prediction for calibrated uncertainty bands.

Integrate AER fracture data for richer completion features.

Expand beyond wells to include pipeline throughput forecasting using CER datasets (Enbridge, TC Energy, etc.).
