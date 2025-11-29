import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import agentData from "@/mocks/agentData.json";

// Define a type for agent data structure (as seen in AgentDetailPage)
interface AgentLog {
  id: number;
  timestamp: string;
  agentType: string;
  status: string;
  message: string;
  actionTaken: string | null;
}

const allAgentData: AgentLog[] = agentData as AgentLog[];

const AGENT_TYPES = [
  ...new Set(allAgentData.map(agent => agent.agentType))
];

const formatAgentType = (type: string) => {
  return type.replace(/_/g, ' ')
             .toLowerCase()
             .split(' ')
             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
             .join(' ');
};

const DashboardHome = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center text-primary">Intelligent Agents Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {AGENT_TYPES.map((agentType) => (
          <Link key={agentType} to={`/agents/${agentType}`}>
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {formatAgentType(agentType)}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;