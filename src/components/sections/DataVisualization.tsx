import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Tooltip, Legend } from "recharts";
import { TrendingUp, Users, Activity, Droplets, Wind } from "lucide-react";

const DataVisualization = () => {
  // Real-life scenario: Hospital surge predictions around Diwali in Mumbai due to pollution
  const surgeData = [
    { day: 'Diwali -4d', historical: 110, predicted: 112, aqi: 150 },
    { day: 'Diwali -2d', historical: 125, predicted: 128, aqi: 180 },
    { day: 'Diwali', historical: 190, predicted: 215, aqi: 350 },
    { day: 'Diwali +2d', historical: 240, predicted: 185, aqi: 420 },
    { day: 'Diwali +4d', historical: 225, predicted: 170, aqi: 320 },
    { day: 'Diwali +6d', historical: 180, predicted: 150, aqi: 250 },
    { day: 'Diwali +8d', historical: 150, predicted: 130, aqi: 190 }
  ];

  // Real-life scenario: Advisory effectiveness for common issues in Mumbai
  const advisoryData = [
    { category: 'Airborne Illnesses', alertsSent: 8500, hospitalVisitsPrevented: 1200 },
    { category: 'Monsoon Ailments', alertsSent: 12000, hospitalVisitsPrevented: 2500 },
    { category: 'Chronic Conditions', alertsSent: 6200, hospitalVisitsPrevented: 950 },
    { category: 'Heatwave Stress', alertsSent: 7800, hospitalVisitsPrevented: 1100 }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-foreground">Data-Driven Healthcare Insights</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Analytics from our Mumbai pilot program powering smarter healthcare decisions.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Hospital Surge Prediction Chart */}
          <Card className="bg-gradient-card shadow-large border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <TrendingUp className="h-6 w-6" />
                Diwali Respiratory Surge Prediction (Mumbai)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={surgeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Patient Admissions', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="hsl(var(--destructive))"
                      fontSize={12}
                      label={{ value: 'AQI', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      name="AI Predicted Admissions"
                      yAxisId="left"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="historical" 
                      stroke="hsl(var(--secondary))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Historical Average"
                      yAxisId="left"
                    />
                     <Line 
                      type="monotone" 
                      dataKey="aqi" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={1}
                      strokeDasharray="10 10"
                      dot={false}
                      name="AQI Level"
                      yAxisId="right"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>🎯 88% accuracy in 72h predictions</span>
                <span>📈 Correlation with AQI spike is clearly visible</span>
              </div>
            </CardContent>
          </Card>

          {/* Patient Advisory Effectiveness */}
          <Card className="bg-gradient-card shadow-large border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <Users className="h-6 w-6" />
                Advisory Impact on Hospital Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={advisoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="category" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="alertsSent" 
                      fill="hsl(var(--primary))" 
                      name="Advisories Sent"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="hospitalVisitsPrevented" 
                      fill="hsl(var(--secondary))" 
                      name="Prevented Hospital Visits"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>📱 82% patient engagement on WhatsApp</span>
                <span>📉 18% reduction in non-critical ER visits</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Stats */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <Card className="bg-gradient-card shadow-medium border-primary/10 text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-primary">50,000+</h3>
              <p className="text-sm text-muted-foreground">Patients in Pilot Program</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-medium border-primary/10 text-center">
            <CardContent className="p-6">
              <Droplets className="h-8 w-8 text-secondary mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-secondary">72%</h3>
              <p className="text-sm text-muted-foreground">Monsoon Illness Prediction Accuracy</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-medium border-primary/10 text-center">
            <CardContent className="p-6">
              <Wind className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-primary">182</h3>
              <p className="text-sm text-muted-foreground">Live AQI Stations Monitored</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-medium border-primary/10 text-center">
            <CardContent className="p-6">
              <Activity className="h-8 w-8 text-secondary mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-secondary">99.8%</h3>
              <p className="text-sm text-muted-foreground">System Uptime</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DataVisualization;

