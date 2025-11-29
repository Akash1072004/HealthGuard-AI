"""
Persona Analyzer Agent
------------------------------------
Takes patient meta-data, history, wearable signals, lifestyle patterns
and generates a structured "Health Persona Vector" + Gemini explanation.

Used by Preventive Advisory Agent + Symptom Checker Agent.
"""

import os
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional, Dict
import numpy as np
from dotenv import load_dotenv

# Load env vars
load_dotenv()

# Gemini client
try:
    from google import genai
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    genai_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None
except:
    genai_client = None


app = FastAPI(
    title="HealthGuard AI - Persona Analyzer Agent",
    version="1.0",
    description="Generates patient persona vector with risk scoring & Gemini summary."
)

# -----------------------------
# INPUT MODELS
# -----------------------------
class WearableSignals(BaseModel):
    avg_heart_rate: float
    resting_heart_rate: float
    steps_per_day: int
    sleep_hours: float
    spo2: float                # oxygen saturation (%)
    hr_variability: float      # HRV

class PatientData(BaseModel):
    patient_id: str
    age: int
    gender: str
    city: str
    chronic_conditions: List[str] = []
    medical_history: List[str] = []
    smoker: bool = False
    alcohol: bool = False
    exercise_hours_per_week: float = 0
    bmi: Optional[float] = None
    languages: List[str] = ["en"]
    wearable: Optional[WearableSignals] = None


# -------------------------------------------
# RISK SCORE MODELS (cheap & deterministic)
# -------------------------------------------
def compute_chronic_risk(conditions: List[str]) -> int:
    high = {"asthma", "copd", "diabetes", "hypertension", "ckd", "heart disease"}
    score = sum([2 if c.lower() in high else 1 for c in conditions])
    return min(score * 10, 40)  # max 40% risk


def compute_lifestyle_risk(smoker: bool, alcohol: bool, exercise: float) -> int:
    score = 0
    if smoker: score += 20
    if alcohol: score += 10
    if exercise < 2: score += 10
    return min(score, 30)


def compute_wearable_risk(wear: WearableSignals) -> int:
    score = 0

    if wear.avg_heart_rate > 95:
        score += 15

    if wear.hr_variability < 20:
        score += 10

    if wear.spo2 < 94:
        score += 20

    if wear.sleep_hours < 6:
        score += 10

    return min(score, 40)


def compute_age_risk(age: int) -> int:
    if age < 30: return 5
    if age < 45: return 10
    if age < 60: return 20
    return 30


# -------------------------------------------
# COMPOSE PERSONA VECTOR
# -------------------------------------------
def build_persona_vector(data: PatientData):
    chronic_risk = compute_chronic_risk(data.chronic_conditions)
    lifestyle_risk = compute_lifestyle_risk(data.smoker, data.alcohol, data.exercise_hours_per_week)
    age_risk = compute_age_risk(data.age)
    wearable_risk = compute_wearable_risk(data.wearable) if data.wearable else 0

    total_risk = min(chronic_risk + lifestyle_risk + age_risk + wearable_risk, 100)

    persona_vector = {
        "patient_id": data.patient_id,
        "age": data.age,
        "gender": data.gender,
        "city": data.city,
        "languages": data.languages,
        "chronic_conditions": data.chronic_conditions,
        "lifestyle_risk": lifestyle_risk,
        "wearable_risk": wearable_risk,
        "age_risk": age_risk,
        "chronic_risk": chronic_risk,
        "total_risk_score": total_risk,     # final score
        "risk_category": (
            "Low" if total_risk < 30 else
            "Moderate" if total_risk < 60 else
            "High"
        )
    }

    return persona_vector


# -------------------------------------------
# GEMINI SUMMARY AGENT
# -------------------------------------------
def generate_gemini_summary(persona: dict):
    if not genai_client:
        return "[Gemini disabled] Persona generated successfully."

    prompt = f"""
You are a medical risk-analysis assistant.

Based on this persona vector:
{persona}

Explain:
- Key health risks  
- Why the score is Low/Moderate/High  
- Personalized preventive advice  
- Tone: short, crisp, patient-friendly  
- Language preference: {persona["languages"][0]}
"""
    try:
        resp = genai_client.generate_text(
            model="gemini-2.5-pro",
            content=prompt
        )
        return resp.text
    except Exception as e:
        return f"[Gemini Error] {e}"


# -------------------------------------------
# FASTAPI ENDPOINT
# -------------------------------------------
@app.post("/persona", tags=["Persona Analyzer"])
def analyze_persona(data: PatientData):
    """
    Generate:
    - Persona vector weights
    - Risk score (0–100)
    - Category: Low / Moderate / High
    - Gemini summary of recommendations
    """
    persona_vec = build_persona_vector(data)
    summary = generate_gemini_summary(persona_vec)

    return {
        "status": "success",
        "persona_vector": persona_vec,
        "gemini_summary": summary
    }


# -------------------------------------------
# Run standalone
# -------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("Agent.persona_analyzer_agent:app", host="0.0.0.0", port=8002, reload=True)
