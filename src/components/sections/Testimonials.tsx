import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Anjali Desai",
      role: "Head of Pulmonology, KEM Hospital, Mumbai",
      avatar: "AD",
      quote: "During last year's post-Diwali pollution spike, HealthGuard AI's forecast was invaluable. We adjusted staff schedules and prepped our respiratory wards two days in advance, completely avoiding the chaos of previous years."
    },
    {
      name: "Suresh Patil",
      role: "Asthma Patient, Dadar",
      avatar: "SP", 
      quote: "The Marathi WhatsApp alerts about high AQI zones are a blessing. I know which areas to avoid on my commute. It’s the first time I've gotten through the winter smog season without an emergency hospital visit."
    },
    {
      name: "Mr. Rakesh Singh",
      role: "Public Health Officer, BMC",
      avatar: "RS",
      quote: "This system gives us a hyperlocal view of potential outbreaks. We used the data to run targeted awareness campaigns for vector-borne diseases in specific wards during the monsoon, and saw a 22% drop in cases."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto animate-slide-up">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-foreground">What Healthcare Leaders Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real impact stories from our Mumbai pilot program
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-300 border-primary/10 hover:border-primary/30 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="relative">
                  <Quote className="h-8 w-8 text-primary/20 absolute -top-2 -left-2" />
                  <p className="text-muted-foreground italic pl-6">
                    "{testimonial.quote}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
