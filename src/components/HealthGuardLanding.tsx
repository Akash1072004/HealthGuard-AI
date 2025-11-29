import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Hospital, Users, Brain, Shield, Activity, Zap, Heart, BarChart3, MessageSquare, Calendar, Target, Globe } from "lucide-react";
import heroImage from "@/assets/hero image.png";
import SocialShare from "@/components/SocialShare";
import symp from "../../Images1/symptom.jpg";

const HealthGuardLanding = () => {
  const agents = [
    {
      icon: BarChart3,
      title: "Surge Forecasting Agent",
      description: "Predicts hospital patient inflow using festival calendars, weather data, and historical patterns.",
      image: "patient inflow.jpg"
    },
    {
      icon: Zap,
      title: "Resource Optimizer Agent",
      description: "Optimizes bed allocation, staff scheduling, and equipment distribution across facilities.",
      image: "recomend resource.jpg"
    },
    {
      icon: Users,
      title: "Persona Analyzer Agent",
      description: "Creates detailed patient profiles based on demographics, health history, and risk factors.",
      image: "persona.jpg"
    },
    {
      icon: Shield,
      title: "Preventive Advisory Agent",
      description: "Delivers personalized, multilingual health advisories and preventive care recommendations.",
      image: "Preventive .jpg"
    },
    // {
    //   icon: MessageSquare,
    //   title: "Symptom Checker Agent",
    //   description: "AI-powered conversational interface for initial symptom assessment and triage.",
    //   image: "symptom.jpg"
    // },
    // {
    //   icon: Globe,
    //   title: "Grid Balancer Agent",
    //   description: "Creates a smart, city-wide hospital network. Prevents overcrowding by recommending real-time patient load balancing and resource sharing between facilities.",
    //   image: "grid balancer.jpg"
    // }
  ];

  const techStack = [
    "Python", "Hugging Face", "LangChain", "Streamlit",
    "Flask", "MongoDB", "MySQL", "Docker"
  ];

  const demoFlow = [
    {
      step: "01",
      title: "Hospital Dashboard Alert",
      description: "System predicts 40% surge in respiratory cases for next week during festival season."
    },
    {
      step: "02",
      title: "Patient App Notification",
      description: "High-risk patients receive personalized multilingual advisories about air quality and precautions."
    },
    // {
    //   step: "03",
    //   title: "Symptom Checker Chat",
    //   description: "Patients interact with AI for symptoms, get triage recommendations, and preventive guidance."
    // }
  ];

  const audience = [
    {
      icon: Hospital,
      title: "Hospitals",
      description: "Optimize resource allocation and prepare for patient surges"
    },
    {
      icon: Heart,
      title: "Chronic Patients",
      description: "Receive personalized health advisories and preventive care"
    },
    {
      icon: Target,
      title: "Public Health",
      description: "Monitor population health trends and deploy targeted interventions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero dark:bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/60 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="col-span-2 animate-fade-in">

              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
                HealthGuard AI
              </h1>
              <p className="text-xl lg:text-2xl mb-4 text-foreground font-medium">
                Personalized Agentic AI for Predictive Healthcare
              </p>
              <p className="text-lg mb-8 text-muted-foreground max-w-lg">
                Multi-agent system for predicting hospital surges and delivering proactive, persona-based healthcare advisories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-primary hover:shadow-large transition-all duration-300 animate-glow">
                  Try Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 dark:border-primary/50 dark:hover:bg-primary/20">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="col-span-3">
              {/* The background image now covers this section */}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl font-bold mb-6 text-foreground">The Healthcare Crisis</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Card className="bg-gradient-card border-destructive/20 shadow-medium dark:border-destructive/50">
              <CardHeader className="flex flex-col items-center text-center">
                <img src="overCrowded hospital.jpg" alt="Overcrowded Hospitals" className="w-full h-24 object-cover rounded-t-lg mb-4" />
                <CardTitle className="text-destructive flex items-center gap-2">
                  <Activity className="h-6 w-6" />
                  Overcrowded Hospitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  During festivals, pollution spikes, and epidemics, hospitals face unpredictable patient surges,
                  leading to resource shortages and compromised care quality.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-destructive/20 shadow-medium dark:border-destructive/50">
              <CardHeader className="flex flex-col items-center text-center">
                <img src="Generic care approach.jpg" alt="Generic Care Approach" className="w-full h-24 object-cover rounded-t-lg mb-4" />
                <CardTitle className="text-destructive flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Generic Care Approach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Current systems lack personalization, failing to provide targeted advisories
                  based on individual patient profiles and risk factors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 dark:bg-muted/50">
        <div className="max-w-6xl mx-auto animate-slide-up">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Our Solution: Multi-Agent AI System</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              HealthGuard AI combines specialized AI agents for hospitals and patients,
              creating a comprehensive predictive healthcare ecosystem.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Card className="bg-gradient-card shadow-large border-primary/20 dark:border-primary/50">
              <CardHeader className="flex flex-col items-center text-center">
                <img src="Hospital agent.jpg" alt="Hospital Agents" className="w-full h-32 object-cover rounded-t-lg mb-4 border-2 border-primary/50 shadow-md" />
                <CardTitle className="flex items-center gap-3 text-primary">
                  <Hospital className="h-8 w-8" />
                  Hospital Agents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 mt-1 text-secondary" />
                  <div>
                    <h4 className="font-semibold mb-1">Predictive Analytics</h4>
                    <p className="text-sm text-muted-foreground">Forecast patient surges using multi-source data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 mt-1 text-secondary" />
                  <div>
                    <h4 className="font-semibold mb-1">Resource Optimization</h4>
                    <p className="text-sm text-muted-foreground">Dynamic allocation of beds, staff, and equipment</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-large border-primary/20 dark:border-primary/50">
              <CardHeader className="flex flex-col items-center text-center">
                <img src="patient agent.jpg" alt="Patient Agents" className="w-full h-32 object-cover rounded-t-lg mb-4 border-2 border-primary/50 shadow-md" />
                <CardTitle className="flex items-center gap-3 text-primary">
                  <Users className="h-8 w-8" />
                  Patient Agents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 mt-1 text-secondary" />
                  <div>
                    <h4 className="font-semibold mb-1">Personalized Advisories</h4>
                    <p className="text-sm text-muted-foreground">Multilingual, persona-based health recommendations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 mt-1 text-secondary" />
                  <div>
                    <h4 className="font-semibold mb-1">AI Symptom Checker</h4>
                    <p className="text-sm text-muted-foreground">Conversational triage and care guidance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 text-foreground">How Our AI Agents Work</h2>
            <p className="text-xl text-muted-foreground">
              Five specialized agents working together to transform healthcare delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <Card
                key={index}
                className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-300 border-primary/10 hover:border-primary/30 animate-scale-in dark:border-primary/50 dark:hover:border-primary/70"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="flex flex-col items-center text-center">
                  {agent.image && (
                    <img src={agent.image} alt={agent.title} className="w-full h-32 object-cover object-[center_bottom_75%] rounded-lg mb-4 border-2 border-primary/50 shadow-md" />
                  )}
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <agent.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{agent.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{agent.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Tech Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 dark:bg-muted/50">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <h2 className="text-4xl font-bold mb-6 text-foreground">Powered by Modern Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {techStack.map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-6 py-3 text-base bg-card shadow-soft hover:shadow-medium transition-all duration-300 text-[rgb(11,136,169)] hover:text-white dark:bg-secondary dark:text-primary-foreground dark:hover:bg-secondary/80"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Flow */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">See It In Action</h2>
            <p className="text-xl text-muted-foreground">
              Experience the complete HealthGuard AI workflow
            </p>
          </div>

          <div className="space-y-8">
            {demoFlow.map((step, index) => (
              <Card
                key={index}
                className="bg-gradient-card shadow-medium border-primary/20 animate-slide-up dark:border-primary/50"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-primary-foreground">{step.step}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-foreground">{step.title}</h3>
                      <p className="text-lg text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 dark:bg-muted/50">
        <div className="max-w-5xl mx-auto animate-slide-up">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Who Benefits</h2>
            <p className="text-xl text-muted-foreground">
              Transforming healthcare for multiple stakeholders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {audience.map((item, index) => (
              <Card
                key={index}
                className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-300 border-primary/10 hover:border-primary/30 text-center animate-scale-in dark:border-primary/50 dark:hover:border-primary/70"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Social Share */}
      <SocialShare />

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Join Us
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Be part of the healthcare revolution. Experience HealthGuard AI and help us shape the future of predictive healthcare.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-gradient-primary hover:shadow-large transition-all duration-300 animate-glow">
              Register Interest <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 dark:border-primary/50 dark:hover:bg-primary/20">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/50 border-t border-primary/20 dark:border-primary/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground text-xl font-custom-display">
            Built By Team{" "}
            <span className="font-bold text-primary">ZeroIndex</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HealthGuardLanding;