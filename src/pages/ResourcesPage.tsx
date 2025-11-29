import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import agentData from "@/mocks/agentData.json";

interface Agent {
  id: number;
  name: string;
  description: string;
  status: "SUCCESS" | "ERROR";
  link: string;
}

const ResourcesPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Intelligent Agents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agentData.map((agent: Agent) => (
          <Link to={agent.link} key={agent.id} className="block hover:shadow-lg transition-shadow duration-300">
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{agent.name}</CardTitle>
                  <Badge variant={agent.status === "SUCCESS" ? "default" : "destructive"}>
                    {agent.status}
                  </Badge>
                </div>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;