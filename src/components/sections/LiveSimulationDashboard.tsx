import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin, CalendarDays, Cloud, Droplets, TrendingUp, Hospital, Ambulance } from "lucide-react";
import { motion } from "framer-motion";

const LiveSimulationDashboard = () => {
  const [scenario, setScenario] = useState("diwali");
  const [timeframe, setTimeframe] = useState([-3]); // -3 days before event

  // Dummy data for simulation
  const simulationData = {
    diwali: {
      timeline: [
        { day: -3, label: "3 Days Before", surge: 15, hospitals: [{ id: 1, status: "green" }, { id: 2, status: "green" }, { id: 3, status: "yellow" }], reroutes: 0 },
        { day: -2, label: "2 Days Before", surge: 25, hospitals: [{ id: 1, status: "green" }, { id: 2, status: "yellow" }, { id: 3, status: "yellow" }], reroutes: 0 },
        { day: -1, label: "1 Day Before", surge: 40, hospitals: [{ id: 1, status: "yellow" }, { id: 2, status: "yellow" }, { id: 3, status: "red" }], reroutes: 2 },
        { day: 0, label: "Event Day", surge: 60, hospitals: [{ id: 1, status: "yellow" }, { id: 2, status: "red" }, { id: 3, status: "red" }], reroutes: 5 },
      ],
      description: "Simulating patient surge during Diwali festival due to increased pollution and gatherings."
    },
    pollution: {
      timeline: [
        { day: -3, label: "3 Days Before", surge: 10, hospitals: [{ id: 1, status: "green" }, { id: 2, status: "green" }, { id: 3, status: "green" }], reroutes: 0 },
        { day: -2, label: "2 Days Before", surge: 20, hospitals: [{ id: 1, status: "green" }, { id: 2, status: "yellow" }, { id: 3, status: "green" }], reroutes: 0 },
        { day: -1, label: "1 Day Before", surge: 35, hospitals: [{ id: 1, status: "yellow" }, { id: 2, status: "red" }, { id: 3, status: "yellow" }], reroutes: 1 },
        { day: 0, label: "Event Day", surge: 50, hospitals: [{ id: 1, status: "red" }, { id: 2, status: "red" }, { id: 3, status: "yellow" }], reroutes: 3 },
      ],
      description: "Visualizing the impact of a sudden pollution spike on respiratory cases and hospital load."
    },
    monsoon: {
      timeline: [
        { day: -3, label: "3 Days Before", surge: 5, hospitals: [{ id: 1, status: "green" }, { id: 2, status: "green" }, { id: 3, status: "green" }], reroutes: 0 },
        { day: -2, label: "2 Days Before", surge: 10, hospitals: [{ id: 1, status: "green" }, { id: 2, status: "green" }, { id: 3, status: "yellow" }], reroutes: 0 },
        { day: -1, label: "1 Day Before", surge: 20, hospitals: [{ id: 1, status: "yellow" }, { id: 2, status: "yellow" }, { id: 3, status: "red" }], reroutes: 0 },
        { day: 0, label: "Event Day", surge: 30, hospitals: [{ id: 1, status: "yellow" }, { id: 2, status: "red" }, { id: 3, status: "red" }], reroutes: 2 },
      ],
      description: "Tracking water-borne diseases and other health issues during the monsoon season."
    }
  };

  const currentData = simulationData[scenario].timeline.find(d => d.day === timeframe[0]) || simulationData[scenario].timeline[0];

  const getHospitalColor = (status: string) => {
    switch (status) {
      case "green": return "bg-green-500";
      case "yellow": return "bg-yellow-500";
      case "red": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-foreground">See HealthGuard AI in Action</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience real-time simulations of our agents optimizing city-wide healthcare.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-card shadow-large border-primary/20 p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" /> Live City Simulation
              </CardTitle>
              <CardDescription>{simulationData[scenario].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Scenario Selector */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col md:flex-row items-center justify-between gap-4"
              >
                <h3 className="text-lg font-semibold text-foreground">Select Scenario:</h3>
                <Tabs value={scenario} onValueChange={(value: string) => setScenario(value)} className="w-full md:w-auto">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="diwali">
                      <CalendarDays className="h-4 w-4 mr-2" /> Diwali Festival
                    </TabsTrigger>
                    <TabsTrigger value="pollution">
                      <Cloud className="h-4 w-4 mr-2" /> Pollution Spike
                    </TabsTrigger>
                    <TabsTrigger value="monsoon">
                      <Droplets className="h-4 w-4 mr-2" /> Monsoon Season
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </motion.div>

              {/* Timeline Slider */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Timeline: {currentData.label}</h3>
                <Slider
                  min={-3}
                  max={0}
                  step={1}
                  value={timeframe}
                  onValueChange={setTimeframe}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>3 Days Before</span>
                  <span>Event Day</span>
                </div>
              </motion.div>

              {/* Simulation Visualization */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Map View Placeholder */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Card className="bg-secondary/20 border-primary/10 aspect-video flex flex-col">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.719454320116!2d72.87765591490106!3d19.07598998708804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da2ed8f8d6487d6!2sLilavati%20Hospital%20and%20Research%20Centre!5e0!3m2!1sen!2sin!4v1678987654321!5m2!1sen!2sin"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Hospital Map"
                      className="flex-grow"
                    ></iframe>
                    <div className="p-4 text-center">
                      <div className="flex justify-center gap-4 mt-4">
                        {currentData.hospitals.map(hospital => (
                          <div key={hospital.id} className={`w-6 h-6 rounded-full ${getHospitalColor(hospital.status)} animate-pulse`} title={`Hospital ${hospital.id}: ${hospital.status}`}></div>
                        ))}
                      </div>
                      {currentData.reroutes > 0 && (
                        <div className="mt-4 flex items-center justify-center text-primary animate-bounce">
                          <Ambulance className="h-6 w-6 mr-2" />
                          <span>{currentData.reroutes} Ambulances Rerouted!</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>

                {/* Data Cards */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Card className="bg-gradient-card border-primary/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                          <TrendingUp className="h-5 w-5" /> Surge Agent Prediction
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-foreground">+{currentData.surge}%</p>
                        <p className="text-muted-foreground">Predicted increase in patient inflow</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <Card className="bg-gradient-card border-primary/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                          <Hospital className="h-5 w-5" /> Resource Optimizer
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-foreground">+{Math.round(currentData.surge * 0.5)} ICU Beds</p>
                        <p className="text-muted-foreground">Recommended additional capacity</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Card className="bg-gradient-card border-primary/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                          <Ambulance className="h-5 w-5" /> Grid Balancer Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-foreground">{currentData.reroutes}</p>
                        <p className="text-muted-foreground">Ambulances rerouted to available hospitals</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveSimulationDashboard;