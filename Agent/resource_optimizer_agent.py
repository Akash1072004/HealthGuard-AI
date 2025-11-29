"""
Resource Optimizer Agent
- FastAPI app with /optimize_resources endpoint
- ILP optimizer using pulp
- Gemini (google-genai) for human-readable recommendations
"""

import os
import math
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pulp
import pandas as pd
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

# Gemini / Google GenAI client
try:
    from google import genai
except Exception:
    genai = None
    # We'll handle absence gracefully

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if genai and GEMINI_API_KEY:
    genai_client = genai.Client(api_key=GEMINI_API_KEY)
else:
    genai_client = None

app = FastAPI(title="HealthGuard Resource Optimizer Agent", version="1.0")

# ---------------------------
# Pydantic models (request/response)
# ---------------------------
class ForecastDay(BaseModel):
    date: str                # ISO date string e.g. "2025-11-30"
    predicted_admissions: int

class HospitalState(BaseModel):
    hospital_id: str
    baseline_beds: int           # total beds currently available
    baseline_nurses: int         # nurses on shift per day baseline
    baseline_doctors: int        # doctors on shift per day baseline
    baseline_oxygen_units: int   # oxygen cylinders available
    baseline_med_packs: int      # emergency medicine packs on hand
    max_bed_capacity: int = None # optional absolute max bed capacity if expandable
    max_nurses: int = None
    max_doctors: int = None

class OptimizeRequest(BaseModel):
    forecast: List[ForecastDay]
    hospital: HospitalState
    rules: Dict[str, Any] = {}   # optional tuning rules (costs, ratios)

class ResourceSuggestion(BaseModel):
    date: str
    predicted_admissions: int
    extra_beds: int
    extra_nurses: int
    extra_doctors: int
    extra_oxygen_units: int
    extra_med_packs: int

class OptimizeResponse(BaseModel):
    hospital_id: str
    suggestions: List[ResourceSuggestion]
    gemini_text: str = None

# ---------------------------
# Default cost & ratio params (can be overridden via request.rules)
# ---------------------------
DEFAULT_PARAMS = {
    "cost_nurse_per_day": 1000,          # INR per extra nurse per day
    "cost_doctor_per_day": 4000,
    "cost_bed_per_day": 500,             # cost to prepare/reserve a bed
    "cost_oxygen_unit": 2000,            # cost per oxygen cylinder
    "cost_med_pack": 250,                # cost per emergency med pack
    "patients_per_nurse": 6,             # how many patients one nurse can handle
    "patients_per_doctor": 20,           # doctor capacity
    "oxygen_per_patient_rate": 0.1,      # fraction of patients needing oxygen
    "med_pack_per_patient_rate": 0.3,    # fraction of patients needing emergency med pack
    "safety_buffer": 0.15,               # extra buffer fraction of predicted admissions
}

# ---------------------------
# Helper: build and solve ILP
# ---------------------------
def optimize_resources_ilp(forecast: pd.DataFrame, hospital: HospitalState, params: dict):
    """
    Build ILP: minimize cost of extra resources subject to coverage constraints.
    Returns list of suggestions (dict per day).
    """
    days = list(forecast["date"].astype(str))
    preds = list(forecast["predicted_admissions"].astype(int))

    # Create pulp problem
    prob = pulp.LpProblem("resource_optimization", pulp.LpMinimize)

    # Decision variables per day
    extra_nurses = pulp.LpVariable.dicts("nurse", days, lowBound=0, cat="Integer")
    extra_doctors = pulp.LpVariable.dicts("doctor", days, lowBound=0, cat="Integer")
    extra_beds = pulp.LpVariable.dicts("bed", days, lowBound=0, cat="Integer")
    extra_oxygen = pulp.LpVariable.dicts("oxygen", days, lowBound=0, cat="Integer")
    extra_med = pulp.LpVariable.dicts("med", days, lowBound=0, cat="Integer")

    # Objective: minimize total cost
    cost = (
        pulp.lpSum(params["cost_nurse_per_day"] * extra_nurses[d] for d in days) +
        pulp.lpSum(params["cost_doctor_per_day"] * extra_doctors[d] for d in days) +
        pulp.lpSum(params["cost_bed_per_day"] * extra_beds[d] for d in days) +
        pulp.lpSum(params["cost_oxygen_unit"] * extra_oxygen[d] for d in days) +
        pulp.lpSum(params["cost_med_pack"] * extra_med[d] for d in days)
    )
    prob += cost

    # Constraints per day:
    for i, d in enumerate(days):
        pred = preds[i]
        buffer = math.ceil(pred * params["safety_buffer"])
        required_total = pred + buffer

        # Beds constraint: baseline + extra_beds >= required_total
        prob += hospital.baseline_beds + extra_beds[d] >= required_total, f"beds_cover_{d}"

        # Nurses: (baseline_nurses + extra_nurses) * patients_per_nurse >= required_total
        prob += (hospital.baseline_nurses + extra_nurses[d]) * params["patients_per_nurse"] >= required_total, f"nurse_cover_{d}"

        # Doctors:
        prob += (hospital.baseline_doctors + extra_doctors[d]) * params["patients_per_doctor"] >= required_total, f"doctor_cover_{d}"

        # Oxygen: baseline + extra_oxygen >= predicted * oxygen_rate
        oxygen_needed = math.ceil(pred * params["oxygen_per_patient_rate"])
        prob += hospital.baseline_oxygen_units + extra_oxygen[d] >= oxygen_needed, f"oxygen_cover_{d}"

        # Med packs:
        med_needed = math.ceil(pred * params["med_pack_per_patient_rate"])
        prob += hospital.baseline_med_packs + extra_med[d] >= med_needed, f"med_cover_{d}"

        # Max capacity constraints if provided
        if hospital.max_bed_capacity:
            prob += hospital.baseline_beds + extra_beds[d] <= hospital.max_bed_capacity, f"beds_max_{d}"
        if hospital.max_nurses:
            prob += hospital.baseline_nurses + extra_nurses[d] <= hospital.max_nurses, f"nurses_max_{d}"
        if hospital.max_doctors:
            prob += hospital.baseline_doctors + extra_doctors[d] <= hospital.max_doctors, f"doctors_max_{d}"

    # Solve
    try:
        prob.solve(pulp.PULP_CBC_CMD(msg=False))
    except Exception as e:
        raise RuntimeError(f"ILP solver error: {e}")

    if pulp.LpStatus[prob.status] != "Optimal":
        # return None to signal fallback
        return None

    # Build suggestions
    suggestions = []
    for d in days:
        suggestions.append({
            "date": d,
            "predicted_admissions": int(forecast.loc[forecast["date"].astype(str) == d, "predicted_admissions"].values[0]),
            "extra_beds": int(pulp.value(extra_beds[d])),
            "extra_nurses": int(pulp.value(extra_nurses[d])),
            "extra_doctors": int(pulp.value(extra_doctors[d])),
            "extra_oxygen_units": int(pulp.value(extra_oxygen[d])),
            "extra_med_packs": int(pulp.value(extra_med[d])),
        })

    return suggestions

# ---------------------------
# Fallback heuristic (fast)
# ---------------------------
def heuristic_resources(forecast: pd.DataFrame, hospital: HospitalState, params: dict):
    suggestions = []
    for _, row in forecast.iterrows():
        pred = int(row["predicted_admissions"])
        buffer = math.ceil(pred * params["safety_buffer"])
        required_total = pred + buffer

        # Beds
        extra_beds = max(0, required_total - hospital.baseline_beds)

        # Nurses: each nurse handles patients_per_nurse
        nurses_needed = math.ceil(required_total / params["patients_per_nurse"])
        extra_nurses = max(0, nurses_needed - hospital.baseline_nurses)

        # Doctors
        doctors_needed = math.ceil(required_total / params["patients_per_doctor"])
        extra_doctors = max(0, doctors_needed - hospital.baseline_doctors)

        # Oxygen and meds
        oxygen_needed = math.ceil(pred * params["oxygen_per_patient_rate"])
        extra_oxygen = max(0, oxygen_needed - hospital.baseline_oxygen_units)

        med_needed = math.ceil(pred * params["med_pack_per_patient_rate"])
        extra_med = max(0, med_needed - hospital.baseline_med_packs)

        suggestions.append({
            "date": str(row["date"].date()) if hasattr(row["date"], "date") else str(row["date"]),
            "predicted_admissions": pred,
            "extra_beds": int(extra_beds),
            "extra_nurses": int(extra_nurses),
            "extra_doctors": int(extra_doctors),
            "extra_oxygen_units": int(extra_oxygen),
            "extra_med_packs": int(extra_med),
        })
    return suggestions

# ---------------------------
# Gemini wrapper: build prompt and call (if available)
# ---------------------------
def call_gemini_summary(hospital_id: str, suggestions: List[dict], params: dict):
    if genai_client is None:
        # Return a simple textual summary
        lines = [f"Hospital {hospital_id} - Resource Plan Summary:"]
        for s in suggestions:
            lines.append(f"{s['date']}: +{s['extra_nurses']} nurses, +{s['extra_doctors']} doctors, +{s['extra_beds']} beds, +{s['extra_oxygen_units']} oxygen, +{s['extra_med_packs']} med packs (predicted {s['predicted_admissions']})")
        return "\n".join(lines)

    # Build compact forecast block
    forecast_lines = []
    for s in suggestions:
        forecast_lines.append(f"{s['date']}: {s['predicted_admissions']}")

    prompt = f"""
You are an operations advisor for hospitals.

Hospital ID: {hospital_id}
Forecasted admissions and recommended extra resources:
{chr(10).join(forecast_lines)}

For each peak day, produce:
1) A short staffing plan with numbers (nurses, doctors).
2) Beds to reserve.
3) Oxygen cylinders and medicine pack quantities to order.
4) One-line rationale and critical warnings.

Be concise and use bullet points.
"""
    try:
        resp = genai_client.generate_text(model="gemini-2.5-pro", content=prompt)
        # resp has .text
        return resp.text
    except Exception as e:
        # fallback textual summary
        return f"Gemini call failed: {e}\n\n" + "\n".join(f"{s['date']}: +{s['extra_nurses']} nurses, +{s['extra_doctors']} doctors" for s in suggestions)

# ---------------------------
# FastAPI endpoint
# ---------------------------
@app.post("/optimize_resources", response_model=OptimizeResponse)
def optimize_resources(req: OptimizeRequest):
    # Validate and convert to DataFrame
    try:
        forecast_df = pd.DataFrame([f.dict() for f in req.forecast])
        # Ensure date parsing
        forecast_df["date"] = pd.to_datetime(forecast_df["date"], errors="coerce")
        if forecast_df["date"].isna().any():
            raise ValueError("Invalid date in forecast list.")
        forecast_df = forecast_df.sort_values("date").reset_index(drop=True)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid forecast format: {e}")

    # Merge params
    params = DEFAULT_PARAMS.copy()
    params.update(req.rules or {})

    # Try ILP first
    try:
        ilp_result = optimize_resources_ilp(forecast_df, req.hospital, params)
    except Exception as e:
        ilp_result = None

    if ilp_result is None:
        # fallback heuristic
        suggestions = heuristic_resources(forecast_df, req.hospital, params)
        gemini_text = call_gemini_summary(req.hospital.hospital_id, suggestions, params)
    else:
        suggestions = ilp_result
        gemini_text = call_gemini_summary(req.hospital.hospital_id, suggestions, params)

    # Build response
    response = OptimizeResponse(
        hospital_id=req.hospital.hospital_id,
        suggestions=[ResourceSuggestion(**s) for s in suggestions],
        gemini_text=gemini_text
    )
    return response

# ---------------------------
# Run app (uvicorn) if executed directly
# ---------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("Agent.resource_optimizer_agent:app", host="0.0.0.0", port=8001, reload=True)
