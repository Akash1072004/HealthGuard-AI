import os
from datetime import timedelta
from google import genai
from surge_forecasting_model import load_and_prepare_data, LSTMModel, train_model, forecast_admissions

# CONFIG
DATA_PATH = os.path.join("Agent", "mumbai_hospital_processed_data.csv")
SEQ_LEN = 30
FORECAST_DAYS = 7
BATCH_SIZE = 32
EPOCHS = 20
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCY7e9GrAEh2aIhTK0y2d6YuPDc4B_WzSI")

def main():
    # Load and prepare data
    df, scaler, scaled, X_train_t, y_train_t, X_val_t, y_val_t, train_dl, device = load_and_prepare_data()

    # Initialize and train model
    model = LSTMModel(n_features=7).to(device)  # 7 features
    model = train_model(model, train_dl, X_val_t, y_val_t, epochs=EPOCHS, device=device)

    # Forecast admissions
    preds = forecast_admissions(model, scaled, scaler, seq_len=SEQ_LEN, forecast_days=FORECAST_DAYS, device=device)

    # Prepare forecast summary
    last_date = df["date"].iloc[-1]
    future_dates = [last_date + timedelta(days=i + 1) for i in range(FORECAST_DAYS)]
    summary_lines = [f"{d.date()} -> {p} patients" for d, p in zip(future_dates, preds)]
    forecast_summary = "\n".join(summary_lines)
    print("Forecast:\n", forecast_summary)

    # Query Gemini for suggestions
    genai_client = genai.Client(api_key=GEMINI_KEY)
    prompt = f"""
    You are a hospital operations advisor.

    Forecast for next {FORECAST_DAYS} days:
    {forecast_summary}

    Provide:
    1) Staffing plan (extra nurses/doctors per peak day) with numbers.
    2) Beds to reserve per day.
    3) Supplies to stock (oxygen cylinders, emergency meds) with quantities.
    Keep it concise.
    """
    resp = genai_client.models.generate_content(model="gemini-2.5-pro", contents=prompt)
    print("\n=== Gemini Suggestion ===\n", resp.text)

if __name__ == "__main__":
    main()