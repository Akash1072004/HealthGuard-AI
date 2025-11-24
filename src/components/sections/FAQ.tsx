import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How does HealthGuard AI protect patient privacy?",
      answer: "We implement end-to-end encryption, HIPAA compliance, and federated learning approaches. Patient data never leaves their device in raw form - only anonymized insights are shared with healthcare providers for predictions."
    },
    {
      question: "Is the system real-time?",
      answer: "Yes, HealthGuard AI operates in real-time with live data feeds from weather APIs, festival calendars, hospital systems, and IoT sensors. Predictions and advisories are updated every 15 minutes for maximum accuracy."
    },
    {
      question: "How can hospitals integrate with HealthGuard AI?",
      answer: "Integration is seamless through our RESTful APIs and standard healthcare data formats (HL7 FHIR). We provide SDKs for popular hospital management systems and offer white-label solutions for custom implementations."
    },
    {
      question: "What languages does the system support?",
      answer: "Currently, we support 12+ languages including Hindi, English, Marathi, Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, Punjabi, Urdu, and Odia. We're continuously adding more based on regional healthcare needs."
    },
    {
      question: "How accurate are the surge predictions?",
      answer: "Our multi-agent system achieves 85% accuracy in predicting patient surges 72 hours in advance. Accuracy improves to 95% for 24-hour predictions by incorporating real-time environmental and social factors."
    },
    {
      question: "Can patients use this without a smartphone?",
      answer: "Yes! We offer SMS-based advisories, voice calls in local languages, and integration with community health workers for patients without smartphones. Our goal is universal healthcare accessibility."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-foreground">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about HealthGuard AI
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-gradient-card border border-primary/10 rounded-lg px-6 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-2 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;