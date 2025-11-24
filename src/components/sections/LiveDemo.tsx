import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, Activity, Users, BarChart3 } from "lucide-react";

const LiveDemo = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            🚀 Live Demo
          </Badge>
          <h2 className="text-4xl font-bold mb-6 text-foreground">See HealthGuard AI in Action</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dive into the core functionalities of HealthGuard AI. Witness real-time hospital surge predictions and explore how our personalized patient advisory system empowers individuals with proactive health management.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mock Dashboard */}
          <Card className="bg-gradient-card shadow-large border-primary/20 dark:border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <BarChart3 className="h-6 w-6" />
                Hospital Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-muted/30 dark:bg-muted/50 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg dark:from-primary/10 dark:to-secondary/10"></div>
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Play className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Dynamic Hospital Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    Simulate patient inflow, visualize resource allocation, and observe AI-driven surge predictions in real-time. Understand how hospitals can proactively manage capacity and optimize operations.
                  </p>
                  <Link to="/live-simulation-dashboard">
                    <Button variant="outline" className="border-primary/30 hover:bg-primary/10 dark:border-primary/50 dark:hover:bg-primary/20">
                      Launch Demo
                    </Button>
                  </Link>
                </div>
                
                {/* Mock Data Overlay */}
                <div className="absolute top-4 right-4 space-y-2">
                  <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-primary/20 dark:bg-card/90 dark:border-primary/50">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium">Surge Alert: +40%</span>
                    </div>
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-primary/20 dark:bg-card/90 dark:border-primary/50">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Capacity: 85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Patient App Demo */}
          <Card className="bg-gradient-card shadow-large border-primary/20 dark:border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <Users className="h-6 w-6" />
                Patient Advisory App
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock Phone Interface */}
                <div className="bg-muted/30 dark:bg-muted/50 rounded-2xl p-4 mx-auto max-w-sm">
                  <div className="bg-card rounded-xl p-4 shadow-soft">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
                      <div>
                        <h4 className="font-semibold text-sm">HealthGuard AI Patient App</h4>
                        <p className="text-xs text-muted-foreground">Your Personalized Health Companion</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <p className="text-sm">🌬️ Air quality alert: High pollution levels expected. Consider staying indoors today.</p>
                      </div>
                      <div className="bg-secondary/10 rounded-lg p-3">
                        <p className="text-sm">💊 Reminder: Take your respiratory medication as prescribed.</p>
                      </div>
                      <div className="bg-accent/30 rounded-lg p-3">
                        <p className="text-sm">📍 Nearest available clinic: City Hospital (2.3 km away)</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore how patients receive tailored health advisories, medication reminders, and access to nearby medical facilities directly through their mobile device.
                  </p>
                  <Link to="/patient-journey">
                    <Button variant="outline" className="border-primary/30 hover:bg-primary/10 dark:border-primary/50 dark:hover:bg-primary/20">
                      Try Patient App
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;