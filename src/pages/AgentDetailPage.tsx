import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import agentData from "@/mocks/agentData.json";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";


// Define a type for general agent log data structure (Renamed to AgentSummary based on mock data)
interface AgentSummary {
  id: number;
  name: string;
  description: string;
  status: string;
  link: string;
}

const allAgentData: AgentSummary[] = agentData as AgentSummary[];

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AgentDetailPage = () => {
  const { agentType } = useParams();
  
  const title = (agentType || "Agent").replace(/_/g, ' ') + " Details";

  if (!agentType) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Agent Details</h1>
        <p>Agent type not specified.</p>
      </div>
    );
  }

  // --- General Agent Log Logic (Fallback/Other Agents) ---

  // Since agentData.json holds summary data, we look for the specific agent by name/title
  // Note: This section should ideally fetch detailed logs, but using mock summary data for now.
  const agentSpecificData = allAgentData.filter(
    (agent) => agent.name.toLowerCase().replace(/ /g, '_') === agentType.toLowerCase()
  );

  if (!agentSpecificData.length) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold text-primary mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground">
          No recent activity found for this agent type: {agentType}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-bold text-primary">{title}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{agentSpecificData[0].name} Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Metric</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Description</TableCell>
                  <TableCell>{agentSpecificData[0].description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Operational Status</TableCell>
                  <TableCell>{agentSpecificData[0].status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Mock Link</TableCell>
                  <TableCell>{agentSpecificData[0].link}</TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDetailPage;
