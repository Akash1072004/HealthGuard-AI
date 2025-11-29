import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import agentData from "@/mocks/agentData.json";

// Define a type for agent data structure (based on AgentDetailPage usage of agentData.json)
interface AgentSummary {
  id: number;
  name: string;
  description: string;
  status: string;
  link: string;
}

const allAgentData: AgentSummary[] = agentData as AgentSummary[];

const AGENT_TYPES = [
  // Agents use 'name' property but need to be formatted as route types (e.g., 'Resource Optimizer' -> 'resource_optimizer')
  ...new Set(allAgentData.map(agent => agent.name.toLowerCase().replace(/ /g, '_')))
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
        {AGENT_TYPES.map((agentType) => {
          // All agents now link to their specific page (from agentData.json) or a generic detail page
          const agent = allAgentData.find(a => a.name.toLowerCase().replace(/ /g, '_') === agentType);

          if (!agent) return null;

          // Determine the correct link: use specific functional path for Resource Optimizer, otherwise use agent detail path
          let targetLink;
          if (agentType === 'resource_optimizer_agent') {
            // New dedicated page for Resource Optimizer Agent
            targetLink = '/agents/resource_optimizer';
          } else if (agentType === 'surge_forecasting_agent') {
            // Link for Surge Forecasting functional page
            targetLink = '/surge-forecasting';
          } else if (agent.link && !agent.link.startsWith('/agent/')) {
            // Use specific link from JSON if provided and not a generic agent link
            targetLink = agent.link;
          } else {
            // Default to generic agent detail page
            targetLink = `/agents/${agentType}`;
          }

          const isResourceOptimizer = agentType === 'resource_optimizer_agent' || agentType === 'surge_forecasting_agent';
          const cardClass = isResourceOptimizer
            ? "hover:bg-accent transition-colors cursor-pointer h-full border-2 border-green-500 shadow-lg"
            : "hover:bg-accent transition-colors cursor-pointer h-full";

          return (
            <Link key={agentType} to={targetLink}>
              <Card className={cardClass}>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {formatAgentType(agentType)}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardHome;