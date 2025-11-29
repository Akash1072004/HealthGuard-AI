🏥 HealthGuard AI

Predictive Healthcare "Operating System" for Indian Hospitals > Built for MumbaiHacks 2025

📖 Overview

HealthGuard AI is an agentic AI system designed to solve the critical problem of unpredictable patient surges in Indian hospitals during festivals (Diwali, Ganesh Chaturthi), pollution spikes, and epidemics.

Unlike simple dashboards, HealthGuard AI acts as a collaborative team of autonomous agents that move from Prediction → Resource Optimization → Public Action without human intervention.

🤖 The Agentic Architecture

Our system is built around three core collaborating agents:

1. 🧠 Surge Forecasting Agent (The Brain)

Role: Predicts the when, where, and what of patient surges.

Tech: Uses LSTM (Long Short-Term Memory) networks on historical hospital admissions, AQI data, and Indian festival calendars.

Output: "Predicted +40% rise in respiratory cases in Ward F-North in 48 hours."

2. 🤖 Resource Optimizer Agent (The Commander)

Role: Autonomously manages hospital logistics in response to predictions.

Tech: Rule-based Logic Engine (simulating Deep Reinforcement Learning) to optimize bed and staff allocation.

Output: Actionable commands like "Allocating 15 additional ICU beds" or "Deploying 3 pulmonologists."

3. 📢 Preventive Advisory Agent (The Communicator)

Role: Proactive public health communication.

Tech: NLP & GenAI to create personalized, multilingual alerts (English, Hindi, Marathi).

Output: Targeted WhatsApp/SMS alerts: "Namaste Rahul, AQI is severe today. Please avoid outdoor travel."

🚀 Key Features

🇮🇳 Indian Context First: Specifically trained on data related to Indian festivals (Diwali, Holi) and local pollution patterns.

🗣️ Multilingual Support: Generates advisories in English, Hindi, and Marathi to reach the widest population.

⚡ Real-Time "Command Center": A unified dashboard showing live agent collaboration feeds.

📱 WhatsApp Integration: Simulates direct-to-patient alerts on a realistic mobile interface.

📊 Interactive Visualizations: Dynamic charts comparing capacity vs. predicted demand.

🛠️ Tech Stack

Frontend

Framework: React (Vite) + TypeScript

Styling: Tailwind CSS + Shadcn/UI

Icons: Lucide React

Runtime: Bun

Backend & AI (Architecture)

Core Logic: Python (Flask API)

Forecasting: LSTM / Prophet (Time-series analysis)

Orchestration: LangChain (Agent triggers)

Data Sources

Pollution: AQICN Historical Data (Mumbai)

Calendar: Indian Holiday Calendar 2023-2025

Health Data: Synthetic dataset modeled on HMIS aggregate trends.

📸 Screenshots

(Add your project screenshots here)

Main Dashboard

Preventive Agent





🏃‍♂️ Getting Started

Prerequisites

Node.js or Bun installed.

Python 3.9+ (for backend agents).

Installation

Clone the repository

git clone [https://github.com/Akash1072004/HealthGuard-AI.git](https://github.com/Akash1072004/HealthGuard-AI.git)
cd HealthGuard-AI


Install Frontend Dependencies

bun install
# or
npm install


Run the Development Server

bun run dev
# or
npm run dev


Open in Browser
Navigate to http://localhost:5173 to see the Agent Command Center.

📂 Project Structure

HealthGuard-AI/
├── src/
│   ├── components/         # Reusable UI components (Cards, Buttons)
│   ├── layouts/            # Dashboard sidebar structure
│   ├── mocks/              # Dummy data for agent simulation
│   ├── pages/
│   │   ├── DashboardHome.tsx      # Main Agent Feed
│   │   ├── ForecastPage.tsx       # Surge visualizations
│   │   ├── ResourcesPage.tsx      # Resource Optimizer interface
│   │   ├── AdvisoryPage.tsx       # Persona Analyzer (Patient Risk)
│   │   └── PreventiveAdvisoryPage.tsx # Public Alerts (WhatsApp Mockup)
│   ├── App.tsx             # Routing logic
│   └── main.tsx            # Entry point
└── public/                 # Static assets


🔮 Future Roadmap

[ ] ABDM Integration: Connect with Ayushman Bharat Digital Mission for real patient health records.

[ ] IoT Integration: Real-time data form Smart Ventilators.

[ ] Voice Agents: IVR calls for elderly patients who cannot read SMS.

👥 Contributors

HealthGuard Innovators Team

Akash - Full Stack Developer

(Add other team members)

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
