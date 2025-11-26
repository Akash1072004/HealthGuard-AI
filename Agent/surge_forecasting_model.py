import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

# CONFIG
DATA_PATH = os.path.join("Agent", "mumbai_hospital_processed_data.csv")
SEQ_LEN = 30
BATCH_SIZE = 32
EPOCHS = 20

def load_and_prepare_data():
    """Load data, preprocess, scale, and prepare training/validation sets."""
    df = pd.read_csv(DATA_PATH, parse_dates=["date"]).sort_values("date").reset_index(drop=True)
    features = ["admissions", "aqi", "temperature", "humidity", "is_festival", "prev_day_admissions", "prev_week_avg"]
    df = df[["date"] + features].fillna(method="ffill").fillna(method="bfill")

    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df[features].values.astype(float))

    # Build sequences
    X, y = [], []
    for i in range(len(scaled) - SEQ_LEN):
        X.append(scaled[i:i + SEQ_LEN])
        y.append(scaled[i + SEQ_LEN][0])  # admissions is index 0
    X = np.array(X)
    y = np.array(y)

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

    return df, scaler, scaled, X_train_t, y_train_t, X_val_t, y_val_t, train_dl, device

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

def train_model(model, train_dl, X_val_t, y_val_t, epochs=EPOCHS, device=None):
    """Train the model and return trained model."""
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    opt = torch.optim.Adam(model.parameters(), lr=1e-3)
    loss_fn = nn.MSELoss()

    for epoch in range(epochs):
        model.train()
        total_loss = 0
        for xb, yb in train_dl:
            opt.zero_grad()
            pred = model(xb)
            loss = loss_fn(pred.squeeze(), yb)
            loss.backward()
            opt.step()
            total_loss += loss.item()
        # Validation
        model.eval()
        with torch.no_grad():
            val_pred = model(X_val_t).squeeze()
            val_loss = loss_fn(val_pred, y_val_t).item()
        print(".4f")
    return model

def forecast_admissions(model, scaled, scaler, seq_len=SEQ_LEN, forecast_days=7, device=None):
    """Forecast admissions for next forecast_days."""
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.eval()
    last_window = scaled[-seq_len:]  # shape (SEQ_LEN, n_features)
    preds = []
    cur_window = torch.tensor(last_window, dtype=torch.float32).unsqueeze(0).to(device)  # (1, seq_len, n_feat)
    for _ in range(forecast_days):
        with torch.no_grad():
            p = model(cur_window).cpu().numpy().squeeze()
        # Build next input: shift and append predicted admissions scaled
        next_scaled = cur_window.cpu().numpy().squeeze()  # seq_len x n_feat
        # Replace admission column of last row with p
        next_row = next_scaled[-1].copy()
        next_row[0] = p
        new_window = np.vstack([next_scaled[1:], next_row])
        cur_window = torch.tensor(new_window, dtype=torch.float32).unsqueeze(0).to(device)
        # Inverse transform to admissions real scale
        dummy = np.zeros((1, scaled.shape[1]))
        dummy[0, 0] = p
        inv = scaler.inverse_transform(dummy)[0][0]
        preds.append(int(round(inv)))
    return preds