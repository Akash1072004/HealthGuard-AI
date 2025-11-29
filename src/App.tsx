import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LiveDemoPage from "./pages/LiveDemoPage";
import LiveSimulationDashboardPage from "./pages/LiveSimulationDashboardPage";
import PatientJourneyPage from "./pages/PatientJourneyPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import ImpactMetricsPage from "./pages/ImpactMetricsPage";
import FAQPage from "./pages/FAQPage";
import ForecastPage from "./pages/ForecastPage";
import DataVisualizationPage from "./pages/DataVisualizationPage";
import ResourcesPage from "./pages/ResourcesPage";
import AgentDetailPage from "./pages/AgentDetailPage";
import ContactFormPage from "./pages/ContactFormPage";
import ResourceOptimizerAgentPage from "./pages/ResourceOptimizerAgentPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import AdvisoryPage from "./pages/AdvisoryPage";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/live-demo" element={<Layout><LiveDemoPage /></Layout>} />
            <Route path="/live-simulation-dashboard" element={<Layout><LiveSimulationDashboardPage /></Layout>} />
            <Route path="/patient-journey" element={<Layout><PatientJourneyPage /></Layout>} />
            <Route path="/testimonials" element={<Layout><TestimonialsPage /></Layout>} />
            <Route path="/impact-metrics" element={<Layout><ImpactMetricsPage /></Layout>} />
            <Route path="/faq" element={<Layout><FAQPage /></Layout>} />
            <Route path="/data-visualization" element={<Layout><DataVisualizationPage /></Layout>} />
            <Route path="/contact-form" element={<Layout><ContactFormPage /></Layout>} />
            <Route path="/signin" element={<Layout><SignInPage /></Layout>} />
            <Route path="/signup" element={<Layout><SignUpPage /></Layout>} />
            <Route path="/surge-forecasting" element={<Layout><ForecastPage /></Layout>} />
            <Route path="/resource-optimizer" element={<Layout><ResourceOptimizerAgentPage /></Layout>} />
            <Route path="/agents/:agentType" element={<Layout><AgentDetailPage /></Layout>} />
            <Route path="/advisory" element={<Layout><AdvisoryPage /></Layout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
