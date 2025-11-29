import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Recommendation {
  resource: string;
  action: string;
  priority: "High" | "Medium" | "Low";
}

interface HospitalStatus {
    icu_beds_free: number;
    ventilators_free: number;
}
const DUMMY_RECOMMENDATIONS: Recommendation[] = [
    {
        resource: "ICU Staffing",
        action: "Reallocate 2 critical care nurses from Cardiology to ICU due to projected respiratory surge.",
        priority: "High",
    },
    {
        resource: "Ventilator Stock",
        action: "Transfer 3 non-emergency mobile ventilators from storage to main ICU floor.",
        priority: "Medium",
    },
    {
        resource: "Triage Flow",
        action: "Implement fast-track triage for low-acuity cases to free up emergency department resources.",
        priority: "Low",
    },
];

const DUMMY_RISK_LEVEL: "High" | "Medium" | "Low" | "Unknown" = "Medium";

const initialHospitalStatus: HospitalStatus = {
    icu_beds_free: 10,
    ventilators_free: 5,
};

const initialMockPrediction = {
    respiratory: 150,
};

const ResourcesPage = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [hospitalStatus] = useState<HospitalStatus>(initialHospitalStatus);
  const [riskLevel, setRiskLevel] = useState("Unknown");

  const runOptimization = async () => {
    setLoading(true);
    setRecommendations([]);
    setRiskLevel("Calculating...");

    // --- Mocking Agent Response ---
    // Simulate API call delay for realistic user experience
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Use dummy data to simulate successful optimization result
    setRecommendations(DUMMY_RECOMMENDATIONS);
    setRiskLevel(DUMMY_RISK_LEVEL);
    setLoading(false);
    
    // --- Original Backend Connection Logic (Commented Out) ---
    /*
    try {
      const response = await fetch("http://localhost:5000/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prediction: initialMockPrediction,
          status: hospitalStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setRecommendations(result.recommendations || []);
      setRiskLevel(result.risk_level || "Unknown");

    } catch (error) {
      console.error("Error running optimization:", error);
      setRiskLevel("Error");
      setRecommendations([{
          resource: "System",
          action: "Failed to connect to Resource Optimizer Backend.",
          priority: "High"
      }]);
    }
    */
    // --------------------------------------------------------
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">Resource Optimizer Agent</h1>
      <p className="text-lg text-gray-600 mb-6">Analyze forecast data against current hospital resource status to generate actionable recommendations.</p>

      <div className="flex justify-between items-center mb-6 p-4 border rounded-lg bg-gray-50">
        <div>
            <h2 className="text-xl font-semibold">Current Status & Prediction Input</h2>
            <p>Respiratory Forecast (Mock): <span className="font-mono text-blue-600">{initialMockPrediction.respiratory}</span></p>
            <p>Free ICU Beds: <span className="font-mono text-green-600">{hospitalStatus.icu_beds_free}</span></p>
            <p>Free Ventilators: <span className="font-mono text-green-600">{hospitalStatus.ventilators_free}</span></p>
        </div>
        <Button
          onClick={runOptimization}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 shadow-md"
        >
          {loading ? "Optimizing..." : "Run AI Optimization"}
        </Button>
      </div>

      <h2 className="text-3xl font-bold mb-4">Optimization Results (Risk: <span className={`font-mono ${riskLevel === 'High' ? 'text-red-500' : riskLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>{riskLevel}</span>)</h2>

      {recommendations.length === 0 && !loading ? (
        <Card className="p-6 text-center text-gray-500 border-dashed">
            <p>Click "Run AI Optimization" to generate resource recommendations.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => {
            const priorityClass = rec.priority === "High" ? "border-red-500 bg-red-50/50" : rec.priority === "Medium" ? "border-yellow-500 bg-yellow-50/50" : "border-green-500 bg-green-50/50";
            return (
              <Card
                key={index}
                className={`h-full border-l-4 ${priorityClass} shadow-md`}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{rec.resource}</CardTitle>
                    <Badge variant={rec.priority === "High" ? "destructive" : rec.priority === "Medium" ? "default" : "secondary"}>
                      {rec.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-base text-gray-700">{rec.action}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;