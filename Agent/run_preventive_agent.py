from concurrent.futures import ThreadPoolExecutor, as_completed
from Agent.PreventiveAdvisoryAgent import (
    LifestyleAdvisor,
    PollutionAdvisor,
    DiseaseRiskAdvisor,
    PreventiveAdvisoryTeam
)
import os, json

# Sample patient data
patient_data = """
Name: Michael Johnson
Age: 45
History: Mild anxiety, borderline hypertension, sedentary lifestyle
"""

symptoms = "fatigue, poor sleep, occasional chest tightness, breathlessness while climbing stairs"
pollution_data = "AQI 310, PM2.5 levels extremely high in Mumbai, high respiratory risk"

# Initialize agents
agents = {
    "Lifestyle": LifestyleAdvisor(patient_data),
    "Pollution": PollutionAdvisor(patient_data, pollution_data),
    "Risk": DiseaseRiskAdvisor(patient_data, symptoms)
}

def execute_agent(name, agent):
    result = agent.run()
    return name, result

responses = {}

with ThreadPoolExecutor() as executor:
    futures = {executor.submit(execute_agent, name, agent): name for name, agent in agents.items()}
    for f in as_completed(futures):
        name, result = f.result()
        responses[name] = result

# Final meta-agent
team_agent = PreventiveAdvisoryTeam(
    lifestyle=responses["Lifestyle"],
    pollution=responses["Pollution"],
    risk=responses["Risk"]
)

final_advisory = team_agent.run()

# Save output
output_path = "results/preventive_advisory.txt"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w") as f:
    f.write("### Preventive Health Advisory\n\n")
    f.write(final_advisory)

print("Saved preventive advisory:", output_path)
