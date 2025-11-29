# ============================================================
# Preventive Advisory Agent System
# Built using LangChain + Google Gemini
# Compatible with your Cardiologist/Psychologist architecture
# ============================================================

from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv("apikey.env")  # Load Gemini API key

class PreventiveAgentBase:
    def __init__(self, patient_data=None, role=None, extra_info=None):
        self.patient_data = patient_data
        self.role = role
        self.extra_info = extra_info

        # system prompt template
        self.prompt_template = self.create_prompt_template()

        # Use Gemini API (gpt-5)
        self.model = ChatOpenAI(
            temperature=0.3,
            model="gpt-5",
        )

    def create_prompt_template(self):
        templates = {
            "LifestyleAdvisor": """
            Act as a Lifestyle & Preventive Wellness Specialist.

            You will receive patient's health data.
            Your task:
            - Identify health risks related to diet, sleep, stress, routine.
            - Give 5 personalized preventive recommendations.
            - Keep language simple, actionable, and culturally relevant.
            - Do NOT speak like a doctor; speak like a wellness expert.

            Patient Data:
            {patient_data}
            """,

            "PollutionAdvisor": """
            Act as an Environmental & Air Quality Health Advisor.

            You will receive:
            - Patient health data
            - Pollution / AQI information
            - Respiratory vulnerability

            Task:
            - Provide 5 personalized preventive tips to reduce pollution impact.
            - Mention masks, indoor ventilation, humidifier, hydration etc.
            - Tailor suggestions based on chronic issues (asthma/bronchitis/anxiety).

            Patient Data:
            {patient_data}

            Pollution Details:
            {pollution_data}
            """,

            "DiseaseRiskAdvisor": """
            Act as a Preventive Medicine Specialist.

            Given:
            - Patient health data
            - Reported symptoms
            - Past medical conditions (if any)

            Task:
            - Identify 3 possible risk areas (future concerns).
            - Provide early preventive steps (high level, non-medical).
            - Emphasize lifestyle, monitoring, screenings, warning signs.

            Patient Data:
            {patient_data}

            Symptoms:
            {symptoms}
            """,

            "PreventiveAdvisoryTeam": """
            Act as a Multidisciplinary Preventive Advisory Committee.

            You will receive:
            - Lifestyle Advisor recommendations
            - Pollution Advisor recommendations
            - Disease-Risk Advisor report

            Task:
            - Merge all into a **single unified Preventive Health Advisory**
            - Provide:
                1) Summary (4 lines)
                2) Key Prevention Strategies (bullet points)
                3) Daily Routine Recommendations
                4) Red Flag Signs to monitor

            Be precise, non-medical, and future-focused.

            Lifestyle Advisor:
            {lifestyle}

            Pollution Advisor:
            {pollution}

            Disease-Risk Advisor:
            {risk}
            """
        }

        return PromptTemplate.from_template(templates[self.role])

    def run(self):
        print(f"{self.role} running…")
        prompt = self.prompt_template.format(
            patient_data=self.patient_data,
            pollution_data=self.extra_info.get("pollution_data", "") if self.extra_info else "",
            symptoms=self.extra_info.get("symptoms", "") if self.extra_info else "",
            lifestyle=self.extra_info.get("lifestyle", "") if self.extra_info else "",
            risk=self.extra_info.get("risk", "") if self.extra_info else "",
            pollution=self.extra_info.get("pollution", "") if self.extra_info else "",
        )
        try:
            return self.model.invoke(prompt).content
        except Exception as e:
            print("Error:", e)
            return None


# ------------------------------------------------------------
# Specialized Agents
# ------------------------------------------------------------

class LifestyleAdvisor(PreventiveAgentBase):
    def __init__(self, patient_data):
        super().__init__(patient_data=patient_data, role="LifestyleAdvisor")

class PollutionAdvisor(PreventiveAgentBase):
    def __init__(self, patient_data, pollution_data):
        extra = {"pollution_data": pollution_data}
        super().__init__(patient_data=patient_data, role="PollutionAdvisor", extra_info=extra)

class DiseaseRiskAdvisor(PreventiveAgentBase):
    def __init__(self, patient_data, symptoms):
        extra = {"symptoms": symptoms}
        super().__init__(patient_data=patient_data, role="DiseaseRiskAdvisor", extra_info=extra)

class PreventiveAdvisoryTeam(PreventiveAgentBase):
    def __init__(self, lifestyle, pollution, risk):
        extra = {
            "lifestyle": lifestyle,
            "pollution": pollution,
            "risk": risk
        }
        super().__init__(role="PreventiveAdvisoryTeam", extra_info=extra)
