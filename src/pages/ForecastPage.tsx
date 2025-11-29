import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import forecastData from "../mocks/forecastData.json";

const ForecastPage = () => {
  const { forecasts, geminiSuggestion } = forecastData;

  const getSurgeLevel = (patients: number) => {
    if (patients >= 140) {
      return { text: "High Surge", className: "bg-red-500 hover:bg-red-600" };
    } else if (patients >= 120) {
      return { text: "Moderate Surge", className: "bg-yellow-500 hover:bg-yellow-600" };
    } else {
      return { text: "Low Surge", className: "bg-green-500 hover:bg-green-600" };
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold">7-Day Patient Admission Forecast</h1>
      
      {/* Forecast Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Admission Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Forecasted Patients</TableHead>
                <TableHead className="text-right">Surge Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forecasts.map((forecast) => {
                const surge = getSurgeLevel(forecast.patients);
                return (
                  <TableRow key={forecast.date}>
                    <TableCell className="font-medium">{forecast.date}</TableCell>
                    <TableCell>{forecast.patients}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={surge.className}>{surge.text}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Gemini Suggestion Card */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Resource Allocation Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Staffing Plan:</h3>
            <p>{geminiSuggestion.staffingPlan}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Beds to Reserve:</h3>
            <p>{geminiSuggestion.bedsToReserve}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Supplies to Stock:</h3>
            <p>{geminiSuggestion.suppliesToStock}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastPage;