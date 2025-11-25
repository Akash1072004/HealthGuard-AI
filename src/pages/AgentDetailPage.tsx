import { useParams } from "react-router-dom";
import agentData from "@/mocks/agentData.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define a type for agent data structure
interface AgentLog {
  id: number;
  timestamp: string;
  agentType: string;
  status: string;
  message: string;
  actionTaken: string | null;
}

const allAgentData: AgentLog[] = agentData as AgentLog[];

const AgentDetailPage = () => {
  const { agentType } = useParams();

  if (!agentType) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Agent Details</h1>
        <p>Agent type not specified.</p>
      </div>
    );
  }

  const agentSpecificData = allAgentData.filter(
    (agent) => agent.agentType.toUpperCase() === agentType.toUpperCase()
  );

  const title = agentType.replace(/_/g, ' ') + " Agent Details";

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
          <CardTitle>Recent Activity Log ({agentSpecificData.length} entries)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Action Taken</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentSpecificData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell className="font-medium">{data.timestamp}</TableCell>
                  <TableCell>{data.status}</TableCell>
                  <TableCell>{data.message}</TableCell>
                  <TableCell>{data.actionTaken || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDetailPage;
