import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Globe, Shield } from "lucide-react";

const ImpactMetrics = () => {
  const metrics = [
    {
      icon: TrendingUp,
      value: "28%",
      label: "Reduction in ER Overcrowding",
      description: "Achieved during the 2024 Mumbai monsoon season pilot."
    },
    {
      icon: Clock,
      value: "6 hours",
      label: "Faster Public Health Alerts",
      description: "Compared to traditional announcement methods (from 8 hours to 2)."
    },
    {
      icon: Globe,
      value: "12+",
      label: "Indian Languages Supported",
      description: "Ensuring accessibility with advisories in Marathi, Hindi, Gujarati & more."
    },
    {
      icon: Shield,
      value: "100%",
      label: "DPDP Act Compliant",
      description: "Built for India's data privacy framework from the ground up."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-foreground">Measurable Impact</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real results from our AI-powered healthcare transformation
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card 
              key={index}
              className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-300 border-primary/10 hover:border-primary/30 text-center animate-scale-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <metric.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-primary">{metric.value}</h3>
                  <p className="font-semibold text-foreground">{metric.label}</p>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
