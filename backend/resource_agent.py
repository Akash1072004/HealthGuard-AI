import json

class ResourceOptimizerAgent:
    """
    Analyzes prediction data and current resource status to provide optimization recommendations.
    """
    def optimize(self, prediction_data, current_status):
        """
        Calculates resource needs and deficits, generating recommendations.

        :param prediction_data: Dictionary containing forecast data (e.g., {'respiratory': 150}).
        :param current_status: Dictionary containing current resource status (e.g., {'icu_beds_free': 10, 'ventilators_free': 5}).
        :return: A dictionary containing status, risk level, and recommendations.
        """
        recommendations = []
        risk_level = "Low"
        
        # 1. ICU Beds Logic
        respiratory_cases = prediction_data.get('respiratory', 0)
        icu_needed_rate = 0.20 # 20% of respiratory cases need ICU
        ventilator_needed_rate = 0.50 # 50% of ICU patients need ventilators

        # ICU Needs
        icu_needed = int(respiratory_cases * icu_needed_rate)
        icu_free = current_status.get('icu_beds_free', 0)
        icu_deficit = icu_needed - icu_free

        if icu_deficit > 0:
            risk_level = "High"
            recommendations.append({
                "resource": "ICU Beds",
                "action": f"Allocate {icu_deficit} beds for the forecasted surge.",
                "priority": "High"
            })
        elif icu_needed > 0:
            risk_level = "Medium" if icu_free - icu_needed < 5 else risk_level
            recommendations.append({
                "resource": "ICU Beds",
                "action": f"Maintain {icu_needed} beds on standby. Current surplus: {icu_free - icu_needed}",
                "priority": "Medium"
            })

        # 2. Ventilator Logic (assume 50% of ICU patients need them)
        ventilators_needed = int(icu_needed * ventilator_needed_rate)
        ventilators_free = current_status.get('ventilators_free', 0)
        ventilator_deficit = ventilators_needed - ventilators_free

        if ventilator_deficit > 0:
            risk_level = "High"
            recommendations.append({
                "resource": "Ventilators",
                "action": f"Source {ventilator_deficit} additional ventilators immediately.",
                "priority": "High"
            })
        elif ventilators_needed > 0:
            risk_level = "Medium" if ventilators_free - ventilators_needed < 3 else risk_level
            recommendations.append({
                "resource": "Ventilators",
                "action": f"Ensure {ventilators_needed} ventilators are fully operational. Current surplus: {ventilators_free - ventilators_needed}",
                "priority": "Medium"
            })


        if not recommendations:
            recommendations.append({
                "resource": "All Resources",
                "action": "Current resources are adequate for the predicted patient load.",
                "priority": "Low"
            })
            risk_level = "Low"

        return {
            "status": "Optimization Complete",
            "risk_level": risk_level,
            "recommendations": recommendations
        }

if __name__ == '__main__':
    # Example usage for testing
    agent = ResourceOptimizerAgent()
    
    # Scenario 1: High Deficit
    prediction_data_1 = {"respiratory": 150}
    current_status_1 = {"icu_beds_free": 10, "ventilators_free": 5}
    result_1 = agent.optimize(prediction_data_1, current_status_1)
    print("Scenario 1 Results:")
    print(json.dumps(result_1, indent=4))
    
    # Scenario 2: Adequate Resources
    prediction_data_2 = {"respiratory": 10}
    current_status_2 = {"icu_beds_free": 10, "ventilators_free": 5}
    result_2 = agent.optimize(prediction_data_2, current_status_2)
    print("\nScenario 2 Results:")
    print(json.dumps(result_2, indent=4))