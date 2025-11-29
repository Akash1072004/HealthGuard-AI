from flask import Flask, request, jsonify
from flask_cors import CORS
from resource_agent import ResourceOptimizerAgent

app = Flask(__name__)
# Enable CORS for frontend communication (React runs on a different port)
CORS(app)

@app.route('/api/optimize', methods=['POST'])
def optimize_resources():
    """
    POST endpoint to run the Resource Optimizer Agent.
    Expects JSON data with 'prediction' and 'status' keys.
    """
    try:
        data = request.get_json()
        
        if not data or 'prediction' not in data or 'status' not in data:
            return jsonify({"error": "Invalid input data. Expected 'prediction' and 'status' objects."}), 400

        prediction_data = data['prediction']
        current_status = data['status']
        
        agent = ResourceOptimizerAgent()
        result = agent.optimize(prediction_data, current_status)
        
        return jsonify(result), 200

    except Exception as e:
        app.logger.error(f"Error during optimization: {e}")
        return jsonify({"error": "Internal server error during resource optimization."}), 500

@app.route('/api/resource_optimization_data', methods=['GET'])
def get_resource_optimization_data():
    """
    GET endpoint to retrieve resource optimization data using scenario 1 example data.
    """
    try:
        agent = ResourceOptimizerAgent()
        
        # Using Scenario 1 data for demonstration (High Deficit example from resource_agent.py)
        prediction_data = {"respiratory": 150}
        current_status = {"icu_beds_free": 10, "ventilators_free": 5}
        
        result = agent.optimize(prediction_data, current_status)
        
        return jsonify(result), 200

    except Exception as e:
        app.logger.error(f"Error retrieving resource optimization data: {e}")
        return jsonify({"error": "Internal server error retrieving data."}), 500


if __name__ == '__main__':
    # Run the server on http://localhost:5000
    app.run(debug=True, host='0.0.0.0', port=5000)