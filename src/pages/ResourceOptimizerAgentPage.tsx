import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Type Definitions ---
interface ResourceStatus {
  name: string;
  available: number;
  required: number;
}

interface Recommendation {
  id: number;
  priority: 'High' | 'Medium';
  title: string;
  description: string;
}

// --- Mock Data (Requirement 1) ---
const hospitalStatus: { [key: string]: ResourceStatus } = {
  ICU: { name: 'ICU Beds', available: 10, required: 24 }, // Critical Shortage: 14 needed
  Ventilator: { name: 'Ventilators', available: 5, required: 8 }, // Shortage: 3 needed
  GeneralWards: { name: 'General Wards', available: 150, required: 100 }, // Surplus: 50 surplus
  OxygenCylinders: { name: 'Oxygen Cylinders', available: 45, required: 50 }, // Slight Shortage: 5 needed
};

const recommendations: Recommendation[] = [
  {
    id: 1,
    priority: 'High',
    title: 'Allocate 14 Additional ICU Beds from Annex B',
    description: 'Immediate relocation of non-critical patients from Annex B to free up 14 ICU beds, addressing the critical shortage.',
  },
  {
    id: 2,
    priority: 'High',
    title: 'Transfer 3 Ventilators from Hospital C',
    description: 'Initiate resource transfer protocol for 3 unused ventilators from neighboring Hospital C to meet demand.',
  },
  {
    id: 3,
    priority: 'Medium',
    title: 'Optimize Oxygen Distribution Flow',
    description: 'Adjust flow meters in high-demand units to ensure the current supply (45 cylinders) lasts an additional 12 hours.',
  },
];

// --- Helper Components for Metrics (Section 2) ---

const MetricCard = ({ resource }: { resource: ResourceStatus }) => {
    const gap = resource.required - resource.available;
    const isShortage = gap > 0;
    const statusColor = isShortage ? 'bg-red-500 text-white' : 'bg-green-500 text-white';
    const Icon = isShortage ? XCircle : CheckCircle;

    return (
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{resource.name}</CardTitle>
                <Icon className={`h-4 w-4 ${isShortage ? 'text-red-500' : 'text-green-500'}`} />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">
                    {resource.available}
                </div>
                <div className="text-sm text-muted-foreground">
                    Required: {resource.required}
                </div>
                <p className={`mt-2 text-xs font-semibold p-1 rounded text-center ${statusColor}`}>
                    {gap !== 0 ? `${Math.abs(gap)} ${isShortage ? 'NEEDED' : 'SURPLUS'}` : 'BALANCED'}
                </p>
            </CardContent>
        </Card>
    );
};


export default function ResourceOptimizerAgentPage() {
    
    // Check for critical shortage (Section 1)
    const isCriticalShortage = 
        hospitalStatus.ICU.required > hospitalStatus.ICU.available || 
        hospitalStatus.Ventilator.required > hospitalStatus.Ventilator.available;

    // Handle Interactivity (Requirement 3)
    const handleApprove = (recommendationId: number, title: string) => {
        // Requirement 3: Log to console and show an alert
        alert(`Recommendation "${title}" (ID: ${recommendationId}) approved and deployed.`);
        console.log(`Approved recommendation ID: ${recommendationId} - ${title}`);
    };

    const statusList = Object.values(hospitalStatus);

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            
            {/* Page Title (Requirement 2.1) */}
            <header className="pb-4 border-b">
                <div className="flex items-center space-x-4 mb-4">
                    <Button variant="outline" asChild>
                      <Link to="/dashboard">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                      </Link>
                    </Button>
                </div>
                <h1 className="text-4xl font-extrabold flex items-center">
                    <Zap className="h-8 w-8 mr-3 text-indigo-600" />
                    🤖 Resource Optimizer Agent
                </h1>
                <p className="text-lg text-muted-foreground ml-11">
                    Autonomous Resource Allocation & Command
                </p>
            </header>

            {/* Section 1: Crisis Banner (Requirement 2.2) */}
            {isCriticalShortage && (
                <div className="bg-red-700 text-white p-4 rounded-lg shadow-xl flex items-center justify-center animate-pulse">
                    <AlertTriangle className="h-6 w-6 mr-3" />
                    <span className="text-xl font-bold tracking-wider">CRITICAL RESOURCE SHORTAGE DETECTED</span>
                </div>
            )}
            
            {/* Section 2: Key Metrics (The Gap) (Requirement 2.3) */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold border-b pb-2">Resource Gap Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard resource={hospitalStatus.ICU} />
                    <MetricCard resource={hospitalStatus.Ventilator} />
                    <MetricCard resource={hospitalStatus.GeneralWards} />
                    <MetricCard resource={hospitalStatus.OxygenCylinders} />
                </div>
            </section>
            
            {/* Section 3: Command Center (Action Cards) (Requirement 2.4) */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold border-b pb-2">Command Center: Recommended Actions ({recommendations.length} Pending)</h2>
                <div className="grid gap-6">
                    {recommendations.map((rec) => (
                        <Card key={rec.id} className="shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">{rec.title}</CardTitle>
                                    <span 
                                        className={`px-3 py-1 text-xs font-bold rounded-full 
                                            ${rec.priority === 'High' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-yellow-100 text-yellow-800 border border-yellow-300'}
                                        `}
                                    >
                                        {rec.priority} Priority
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex justify-between items-end">
                                <p className="text-sm text-muted-foreground max-w-3xl">{rec.description}</p>
                                <Button 
                                    className={`ml-4 ${rec.priority === 'High' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                    onClick={() => handleApprove(rec.id, rec.title)}
                                >
                                    {rec.priority === 'High' ? 'DEPLOY URGENTLY' : 'APPROVE'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Section 4: Detailed Status Table (Requirement 2.5) */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold border-b pb-2">Detailed Hospital Status</h2>
                <div className="rounded-lg border overflow-hidden">
                    {/* Simple HTML table styled with Tailwind */}
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Resource</th>
                                <th scope="col" className="px-6 py-3 text-right">Available</th>
                                <th scope="col" className="px-6 py-3 text-right">Required</th>
                                <th scope="col" className="px-6 py-3 text-right">Status Gap</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statusList.map((status, index) => {
                                const gap = status.required - status.available;
                                const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                                return (
                                    <tr key={status.name} className={`${rowClass} border-b last:border-b-0`}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                                            {status.name}
                                        </th>
                                        <td className="px-6 py-4 text-right">{status.available}</td>
                                        <td className="px-6 py-4 text-right">{status.required}</td>
                                        <td className={`px-6 py-4 text-right font-bold ${gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {gap > 0 ? `+${gap} (Shortage)` : `${gap} (Surplus)`}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}