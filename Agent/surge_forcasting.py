# Agent/pytorch_lstm_agent.py
import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from datetime import timedelta
from google import genai

# CONFIG
DATA_PATH = r"Agent\mumbai_hospital_processed_data.csv"
SEQ_LEN = 30
FORECAST_DAYS = 7
BATCH_SIZE = 32
EPOCHS = 20
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCY7e9GrAEh2aIhTK0y2d6YuPDc4B_WzSI")
genai_client = genai.Client(api_key=GEMINI_KEY)

# LOAD & PREP
df = pd.read_csv(DATA_PATH, parse_dates=["date"]).sort_values("date").reset_index(drop=True)
features = ["admissions","aqi","temperature","humidity","is_festival","prev_day_admissions","prev_week_avg"]
df = df[["date"] + features].fillna(method="ffill").fillna(method="bfill")

scaler = MinMaxScaler()
scaled = scaler.fit_transform(df[features].values.astype(float))

# Build sequences
X, y = [], []
for i in range(len(scaled) - SEQ_LEN):
    X.append(scaled[i:i+SEQ_LEN])
    y.append(scaled[i+SEQ_LEN][0])  # admissions is index 0
X = np.array(X); y = np.array(y)
# Train/test split
split = int(0.85 * len(X))
X_train, X_val = X[:split], X[split:]
y_train, y_val = y[:split], y[split:]

# Convert to torch
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
X_train_t = torch.tensor(X_train, dtype=torch.float32).to(device)
y_train_t = torch.tensor(y_train, dtype=torch.float32).to(device)
X_val_t = torch.tensor(X_val, dtype=torch.float32).to(device)
y_val_t = torch.tensor(y_val, dtype=torch.float32).to(device)

train_ds = TensorDataset(X_train_t, y_train_t)
train_dl = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)

# Model
class LSTMModel(nn.Module):
    def __init__(self, n_features, hidden=128, n_layers=2):
        super().__init__()
        self.lstm = nn.LSTM(n_features, hidden, num_layers=n_layers, batch_first=True)
        self.fc = nn.Sequential(
            nn.Linear(hidden, 64),
            nn.ReLU(),
            nn.Linear(64, 1)
        )
    def forward(self, x):
        out, _ = self.lstm(x)
        out = out[:, -1, :]  # last time step
        return self.fc(out)

model = LSTMModel(n_features=X.shape[2]).to(device)
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.MSELoss()

# Train
for epoch in range(EPOCHS):
    model.train()
    total_loss = 0
    for xb, yb in train_dl:
        opt.zero_grad()
        pred = model(xb)
        loss = loss_fn(pred.squeeze(), yb)
        loss.backward()
        opt.step()
        total_loss += loss.item()
    # val
    model.eval()
    with torch.no_grad():
        val_pred = model(X_val_t).squeeze()
        val_loss = loss_fn(val_pred, y_val_t).item()
    print(f"Epoch {epoch+1}/{EPOCHS} train_loss={total_loss/len(train_dl):.4f} val_loss={val_loss:.4f}")

# Forecast next days
model.eval()
last_window = scaled[-SEQ_LEN:]  # shape (SEQ_LEN, n_features)
preds = []
cur_window = torch.tensor(last_window, dtype=torch.float32).unsqueeze(0).to(device)  # (1, seq_len, n_feat)
for _ in range(FORECAST_DAYS):
    with torch.no_grad():
        p = model(cur_window).cpu().numpy().squeeze()
    # Build next input: shift and append predicted admissions scaled
    next_scaled = cur_window.cpu().numpy().squeeze()  # seq_len x n_feat
    # replace admission column of last row with p
    next_row = next_scaled[-1].copy()
    next_row[0] = p
    new_window = np.vstack([next_scaled[1:], next_row])
    cur_window = torch.tensor(new_window, dtype=torch.float32).unsqueeze(0).to(device)
    # inverse transform to admissions real scale
    dummy = np.zeros((1, scaled.shape[1]))
    dummy[0,0] = p
    inv = scaler.inverse_transform(dummy)[0][0]
    preds.append(int(round(inv)))

# Prepare forecast summary
last_date = df["date"].iloc[-1]
future_dates = [last_date + timedelta(days=i+1) for i in range(FORECAST_DAYS)]
summary_lines = [f"{d.date()} -> {p} patients" for d,p in zip(future_dates, preds)]
forecast_summary = "\n".join(summary_lines)
print("Forecast:\n", forecast_summary)

# Query Gemini (google-genai installed)
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
