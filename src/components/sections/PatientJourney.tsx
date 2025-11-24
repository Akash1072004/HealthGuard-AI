// ...existing code...
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { User, Factory, Smartphone, MessageSquare, Hospital } from "lucide-react";
import { motion } from "framer-motion";

const PatientJourney = () => {
  const journeySteps = [
    {
      icon: User,
      title: "Meet Arjun",
      description: "Arjun, a 65-year-old with asthma in Delhi. The Persona Analyzer Agent knows his condition."
    },
    {
      icon: Factory,
      title: "The Trigger",
      description: "A pollution spike is predicted. The Surge Forecasting Agent flags a rise in respiratory cases."
    },
    {
      icon: Smartphone,
      title: "The Alert",
      description: "The Preventive Advisory Agent sends a personalized alert in Hindi to Arjun's phone: 'Air quality is poor. Stay indoors and keep your inhaler ready.'"
    },
    {
      icon: MessageSquare,
      title: "The Symptom",
      description: "Arjun feels breathless and uses the Symptom Checker Agent. The AI recognizes his symptoms are serious."
    },
    {
      icon: Hospital,
      title: "The Action",
      description: "The AI triages him, recommends an immediate hospital visit, and alerts the nearest hospital (using the Grid Balancer's data) that a high-risk asthma patient is incoming."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-foreground">A Day in the Life with HealthGuard AI</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting technology to a human story: How our agents work together to save a life.
          </p>
        </div>

        <ScrollArea className="w-full rounded-md border">
          {/* responsive grid: 1 column on mobile, 2 on small, 3 on large, etc. */}
          <div className="flex w-max space-x-8 p-4 relative">
            {journeySteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="w-[300px] bg-gradient-card shadow-medium border-primary/10 flex-shrink-0">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                      <step.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < journeySteps.length - 1 && (
                  <div className="absolute top-1/2 left-[calc(100%+16px)] w-8 h-1 bg-primary/50 -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};

export default PatientJourney;
// ...existing code...