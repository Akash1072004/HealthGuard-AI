"""
Patient Agent — Medical Report Analyzer (Gemini-powered)

Features:
- FastAPI endpoints for analyzing medical reports
- Uses google-genai (Gemini) as primary LLM; graceful fallback to a local rule-based analyzer
- Rate limiting per "client_id" (simple in-memory)
- Small in-context learning using a local knowledge base (persisted to disk)
- Designed to run in VS Code / server environments (no Streamlit)
"""

import os
import time
import json
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pathlib import Path

# Attempt to import google-genai (Gemini). If missing, we'll still run local analysis fallback.
try:
    from google import genai
except Exception:
    genai = None

# -----------------------
# Configuration
# -----------------------
LOG = logging.getLogger("patient_agent")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")  # change if needed

# Rate limit defaults
DEFAULT_DAILY_LIMIT = int(os.getenv("PATIENT_AGENT_DAILY_LIMIT", "20"))

# Knowledge base file (persistent storage)
KB_PATH = Path(os.getenv("PATIENT_AGENT_KB", "agent_kb.json"))

# Initialize Gemini client (if available and key present)
if genai and GEMINI_API_KEY:
    genai_client = genai.Client(api_key=GEMINI_API_KEY)
    LOG.info("Gemini client initialized.")
else:
    genai_client = None
    if genai is None:
        LOG.warning("google-genai SDK not installed; Gemini disabled, falling back to local analyzer.")
    else:
        LOG.warning("GEMINI_API_KEY not found; Gemini disabled.")

# -----------------------
# Pydantic models
# -----------------------
class PatientMeta(BaseModel):
    client_id: str                  # to track rate limits (e.g., user/session id)
    patient_id: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    languages: Optional[list] = ["en"]

class AnalyzeRequest(BaseModel):
    meta: PatientMeta
    report_text: str
    chat_history: Optional[list] = None    # list of {"role": "user"/"assistant", "content": "..."}
    check_only: Optional[bool] = False

class AnalyzeResponse(BaseModel):
    success: bool
    summary: Optional[str] = None
    insights: Optional[Dict[str, Any]] = None
    model_used: Optional[str] = None
    rate_limit_remaining: Optional[int] = None

# -----------------------
# Utility helpers
# -----------------------
def load_kb():
    if KB_PATH.exists():
        try:
            return json.loads(KB_PATH.read_text(encoding="utf-8"))
        except Exception as e:
            LOG.warning(f"Failed to load KB: {e}")
            return {}
    return {}

def save_kb(kb):
    try:
        KB_PATH.write_text(json.dumps(kb, ensure_ascii=False, indent=2), encoding="utf-8")
    except Exception as e:
        LOG.warning(f"Failed to save KB: {e}")

# Simple in-memory user rate limit store
_rate_store: Dict[str, Dict[str, Any]] = {}

def get_rate_info(client_id: str):
    """Return (allowed:bool, remaining:int, reset_seconds:int)"""
    now = datetime.utcnow()
    s = _rate_store.get(client_id)
    if not s:
        # initialize
        s = {
            "count": 0,
            "limit": DEFAULT_DAILY_LIMIT,
            "reset_at": (now + timedelta(days=1)).timestamp()
        }
        _rate_store[client_id] = s

    reset_seconds = max(0, int(s["reset_at"] - now.timestamp()))
    remaining = max(0, s["limit"] - s["count"])
    allowed = remaining > 0
    return allowed, remaining, reset_seconds

def increment_rate(client_id: str):
    s = _rate_store.get(client_id)
    if not s:
        s = {"count": 0, "limit": DEFAULT_DAILY_LIMIT, "reset_at": (datetime.utcnow() + timedelta(days=1)).timestamp()}
        _rate_store[client_id] = s
    s["count"] += 1

# Knowledge base helpers (very small-scale)
_kb = load_kb()

def update_kb_from_analysis(meta: PatientMeta, report_text: str, analysis_text: str):
    """Store short mappings for in-context learning: key indicators -> summary lines"""
    try:
        if not report_text or not isinstance(report_text, str):
            return
        profile = f"{meta.age or 'NA'}-{meta.gender or 'NA'}"
        # simple indicators to look for
        indicators = ["hemoglobin", "glucose", "cholesterol", "triglyceride", "hdl", "ldl", "wbc", "rbc", "creatinine", "spO2", "oxygen"]
        rt = report_text.lower()
        for ind in indicators:
            if ind in rt:
                # extract first sentence mentioning indicator from analysis_text
                snippet = ""
                for line in analysis_text.splitlines():
                    if ind in line.lower():
                        snippet = line.strip()
                        break
                if not snippet:
                    snippet = analysis_text.splitlines()[0][:250] if analysis_text else ""
                _kb.setdefault(ind, {}).setdefault(profile, [])
                # keep max 3 entries per profile per indicator
                lst = _kb[ind][profile]
                if snippet and (not lst or lst[-1] != snippet):
                    lst.append(snippet)
                    if len(lst) > 3:
                        lst.pop(0)
        # persist
        save_kb(_kb)
    except Exception as e:
        LOG.warning("KB update failed: %s", e)

def get_kb_context(report_text: str, meta: PatientMeta, max_items: int = 3) -> str:
    if not _kb:
        return ""
    rt = (report_text or "").lower()
    profile = f"{meta.age or 'NA'}-{meta.gender or 'NA'}"
    items = []
    for ind, profiles in _kb.items():
        if ind in rt:
            # profile-specific first
            if profile in profiles:
                for p in profiles[profile]:
                    items.append(f"- {ind} (similar profile): {p}")
            # then generic
            for pr, vals in profiles.items():
                if pr != profile:
                    for v in vals:
                        items.append(f"- {ind} (other profile {pr}): {v}")
        if len(items) >= max_items:
            break
    return "\n".join(items[:max_items])

# -----------------------
# Local fallback analyzer (rule-based summarizer)
# -----------------------
def local_medical_analyzer(report_text: str, meta: PatientMeta) -> Dict[str, Any]:
    """
    Lightweight deterministic analyzer:
    - Extracts numeric lab values (simple regex)
    - Produces a short summary and basic insights
    This is used when Gemini is unavailable or as a fast check.
    """
    import re
    insights = {}
    summary_lines = []

    # find common labs with simple regex (e.g., "Hemoglobin: 10.5 g/dL" or "hb 10.5")
    lab_patterns = {
        "hemoglobin": r"(hemoglobin|hb)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
        "glucose": r"(glucose|rbs|sugar)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
        "creatinine": r"(creatinine)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
        "spO2": r"(spO2|spo2|o2 sat|oxygen saturation)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
        "wbc": r"(wbc)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
        "hdl": r"(hdl)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
        "ldl": r"(ldl)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
    }
    text = report_text or ""
    text_lower = text.lower()

    for key, pat in lab_patterns.items():
        m = re.search(pat, text_lower)
        if m:
            try:
                val = float(m.group(2))
                insights[key] = val
                summary_lines.append(f"{key}: {val}")
            except:
                pass

    # Simple rule-based interpretations
    if "fever" in text_lower or "temperature" in text_lower:
        summary_lines.append("Possible febrile illness — consider infection workup if persistent.")

    if "cough" in text_lower and ("blood" in text_lower or "hemoptysis" in text_lower):
        summary_lines.append("Cough with blood reported — flag for urgent respiratory evaluation.")

    # interpret low SpO2
    sp = insights.get("spO2")
    if sp is not None:
        if sp < 94:
            summary_lines.append(f"Low SpO2 ({sp}) — oxygen assessment recommended.")
    # hemoglobin
    hb = insights.get("hemoglobin")
    if hb is not None:
        if hb < 10:
            summary_lines.append(f"Hemoglobin {hb} g/dL — suggests anemia; further testing/advice needed.")

    # basic summary
    summary = " ; ".join(summary_lines) if summary_lines else "No actionable lab values automatically detected."

    return {"summary": summary, "insights": insights, "model_used": "local_rule_based"}

# -----------------------
# Gemini call wrapper
# -----------------------
def call_gemini_medical(report_text: str, meta: PatientMeta, chat_history: Optional[list] = None, kb_context: str = "") -> Dict[str, Any]:
    """
    Calls Gemini to analyze medical report and produce structured insights.
    Returns dict with keys: summary (text), insights (dict), model_used.
    """
    if genai is None or genai_client is None:
        return {"summary": None, "insights": None, "model_used": None, "error": "Gemini unavailable"}

    # Build prompt with constrained instructions for medical safety & brevity
    prompt_lines = [
        "You are a clinical assistant. Read the medical report and provide:",
        "1) A concise (3-6 lines) plain-language summary of key findings.",
        "2) A bullet list of actionable medical insights (labs to follow up, urgent red flags).",
        "3) A short prioritized checklist of next steps for clinicians (not patient-facing).",
        "4) Mention any assumptions you made and the uncertainties.",
        "Output as JSON with keys: summary, insights[], recommendations[], assumptions[].",
    ]
    if kb_context:
        prompt_lines.append("\nRelevant past analysis context:\n" + kb_context)

    # add patient meta for personalization
    meta_text = f"Patient age: {meta.age or 'NA'}, gender: {meta.gender or 'NA'}."
    prompt = "\n".join(prompt_lines) + "\n\n" + meta_text + "\n\nMedical report:\n" + report_text

    # include last 2 messages of chat_history if present (reduce token usage)
    if chat_history:
        hist = []
        for m in chat_history[-2:]:
            role = m.get("role", "user")
            content = m.get("content", "")[:1000]
            hist.append(f"{role.upper()}: {content}")
        prompt += "\n\nSession context:\n" + "\n".join(hist)

    try:
        # Use the client to generate (API may differ across versions; this is a common pattern)
        resp = genai_client.generate_text(model=MODEL_NAME, content=prompt)
        # genai_client.generate_text returns an object with .text in many releases; fallback to str(resp)
        text = getattr(resp, "text", None) or str(resp)
        # Try to parse JSON in the returned text if model followed instruction
        parsed = None
        try:
            # extract first JSON blob if present
            import re
            json_blob = re.search(r"\{.*\}", text, flags=re.S)
            if json_blob:
                parsed = json.loads(json_blob.group(0))
        except Exception:
            parsed = None

        result = {"summary": None, "insights": None, "recommendations": None, "model_used": MODEL_NAME}
        if parsed:
            result["summary"] = parsed.get("summary")
            result["insights"] = parsed.get("insights") or parsed.get("insights", [])
            result["recommendations"] = parsed.get("recommendations") or parsed.get("recommendations", [])
            result["raw_text"] = text
        else:
            # fallback: put full text as summary
            result["summary"] = text[:2000]
            result["raw_text"] = text

        return result
    except Exception as e:
        LOG.exception("Gemini call failed: %s", e)
        return {"error": str(e)}

# -----------------------
# FastAPI app & endpoint
# -----------------------
app = FastAPI(title="Patient Agent - Medical Report Analyzer", version="1.0")

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    LOG.exception("Unhandled error: %s", exc)
    return JSONResponse(status_code=500, content={"success": False, "error": str(exc)})

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest):
    """
    Analyze a medical report and return structured insights.

    Rate-limited by client_id (simple daily limit).
    """
    client_id = req.meta.client_id or "anonymous"
    allowed, remaining, reset_seconds = get_rate_info(client_id)
    if not allowed:
        raise HTTPException(status_code=429, detail=f"Rate limit exceeded. Reset in {reset_seconds}s")

    if req.check_only:
        return AnalyzeResponse(success=True, rate_limit_remaining=remaining)

    # Preprocess: simple cleaning
    report_text = (req.report_text or "").strip()
    if not report_text:
        raise HTTPException(status_code=400, detail="report_text is empty")

    # Build KB context (in-context learning)
    kb_ctx = get_kb_context(report_text, req.meta)

    # Try Gemini analysis first (if configured)
    gemini_result = None
    if genai and genai_client:
        gemini_result = call_gemini_medical(report_text, req.meta, chat_history=req.chat_history, kb_context=kb_ctx)

    # If Gemini failed or not available, use local analyzer
    if not gemini_result or gemini_result.get("error"):
        LOG.info("Using local analyzer (Gemini unavailable or failed).")
        local = local_medical_analyzer(report_text, req.meta)
        summary = local["summary"]
        insights = local.get("insights", {})
        model_used = local.get("model_used", "local")
        # update KB
        update_kb_from_analysis(req.meta, report_text, summary)
        # increment rate
        increment_rate(client_id)
        allowed2, remaining2, _ = get_rate_info(client_id)
        return AnalyzeResponse(success=True, summary=summary, insights=insights, model_used=model_used, rate_limit_remaining=remaining2)

    # If Gemini returned content:
    # Persist learning
    parsed_summary = gemini_result.get("summary") or gemini_result.get("raw_text")[:2000]
    update_kb_from_analysis(req.meta, report_text, parsed_summary)
    # increment usage
    increment_rate(client_id)
    allowed3, remaining3, _ = get_rate_info(client_id)

    # Build final structured response
    resp = AnalyzeResponse(
        success=True,
        summary=parsed_summary,
        insights=gemini_result.get("insights") or {},
        model_used=gemini_result.get("model_used") or MODEL_NAME,
        rate_limit_remaining=remaining3
    )
    return resp

# -----------------------
# If run as script, start server
# -----------------------
if __name__ == "__main__":
    import uvicorn
    LOG.info("Starting Patient Agent HTTP server on port 8003")
    uvicorn.run("Agent.patient_agent:app", host="0.0.0.0", port=8003, reload=True)
