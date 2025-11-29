import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Patient {
    id: number;
    name: string;
    age: number;
    condition: string;
    riskScore: number;
    phone: string;
    language: 'Hindi' | 'Marathi' | 'English';
}

const initialPatients: Patient[] = [
    { id: 1, name: 'Sanjay Sharma', age: 68, condition: 'Asthma', riskScore: 92, phone: '9876543210', language: 'Hindi' },
    { id: 2, name: 'Priya Verma', age: 55, condition: 'COPD', riskScore: 85, phone: '9988776655', language: 'English' },
    { id: 3, name: 'Amit Desai', age: 72, condition: 'Heart Disease', riskScore: 78, phone: '9001122334', language: 'Marathi' },
    { id: 4, name: 'Deepa Kulkarni', age: 40, condition: 'Allergies', riskScore: 52, phone: '9123456789', language: 'Marathi' },
    { id: 5, name: 'Rahul Singh', age: 30, condition: 'Diabetes', riskScore: 45, phone: '9234567890', language: 'Hindi' },
    { id: 6, name: 'Maria Dsouza', age: 60, condition: 'Hypertension', riskScore: 30, phone: '9345678901', language: 'English' },
];

const currentThreat = {
    type: "Smog Spike",
    aqi: 340,
    impact: "Severe air quality index (AQI) of 340 detected, exacerbating respiratory conditions."
};

const PatientListItem: React.FC<{ patient: Patient; isSelected: boolean; onSelect: (patient: Patient) => void }> = ({ patient, isSelected, onSelect }) => {
    const riskColor = patient.riskScore > 80 ? 'bg-red-500 hover:bg-red-600' : patient.riskScore > 50 ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600';

    return (
        <div
            className={`flex justify-between items-center p-4 mb-2 rounded-lg cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelect(patient)}
        >
            <div>
                <p className="font-semibold">{patient.name}</p>
                <p className="text-sm text-gray-500">{patient.condition}</p>
            </div>
            <Badge className={`${riskColor} text-white font-bold`}>
                {patient.riskScore}
            </Badge>
        </div>
    );
};

const AdvisoryPage = () => {
    // Sort patients by risk score (High to Low)
    const sortedPatients = useMemo(() => {
        return initialPatients.slice().sort((a, b) => b.riskScore - a.riskScore);
    }, []);

    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(sortedPatients[0] || null);

    const handleAction = (type: 'SMS' | 'WhatsApp') => {
        if (selectedPatient) {
            alert(`Drafting and sending ${type} alert to ${selectedPatient.name} via ${selectedPatient.phone}.`);
        }
    };

    if (!selectedPatient) {
        return <div className="p-8">No patients available for analysis.</div>;
    }

    const getAdvisoryText = (language: 'English' | 'Hindi' | 'Marathi', patientName: string) => {
        const baseMessage = `Warning: High pollution levels detected (AQI ${currentThreat.aqi}). Due to your pre-existing condition (${selectedPatient.condition}), we strongly advise you to stay indoors and monitor your health closely.`;
        
        switch (language) {
            case 'Hindi':
                // Hindi: "चेतावनी: उच्च प्रदूषण स्तर का पता चला है (AQI 340)। आपकी पहले से मौजूद स्थिति (${condition}) के कारण, हम आपको घर के अंदर रहने और अपने स्वास्थ्य की बारीकी से निगरानी करने की सलाह देते हैं।"
                return `नमस्ते ${patientName}, चेतावनी: उच्च प्रदूषण स्तर का पता चला है (AQI ${currentThreat.aqi})। आपकी पहले से मौजूद स्थिति (${selectedPatient.condition}) के कारण, हम आपको घर के अंदर रहने और अपने स्वास्थ्य की बारीकी से निगरानी करने की सलाह देते हैं।`;
            case 'Marathi':
                // Marathi: "चेतावणी: उच्च प्रदूषणाची पातळी आढळली आहे (AQI 340). तुमच्या पूर्वीच्या स्थितीमुळे (${condition}), आम्ही तुम्हाला घरात राहून तुमच्या आरोग्यावर बारकाईने लक्ष ठेवण्याचा सल्ला देतो."
                return `नमस्कार ${patientName}, चेतावणी: उच्च प्रदूषणाची पातळी आढळली आहे (AQI ${currentThreat.aqi}). तुमच्या पूर्वीच्या स्थितीमुळे (${selectedPatient.condition}), आम्ही तुम्हाला घरात राहून तुमच्या आरोग्यावर बारकाईने लक्ष ठेवण्याचा सल्ला देतो.`;
            case 'English':
            default:
                return `Hello ${patientName}, ${baseMessage}`;
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50">
            {/* Left Sidebar (The Triage List) */}
            <div className="w-1/4 border-r bg-white p-4 shadow-lg flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Triage List</h2>
                <p className="text-sm text-red-600 mb-4 font-medium">🚨 Active Threat: {currentThreat.type} (AQI: {currentThreat.aqi})</p>
                <ScrollArea className="flex-grow pr-2">
                    {sortedPatients.map((patient) => (
                        <PatientListItem
                            key={patient.id}
                            patient={patient}
                            isSelected={selectedPatient.id === patient.id}
                            onSelect={setSelectedPatient}
                        />
                    ))}
                </ScrollArea>
            </div>

            {/* Right Main Panel (The Analysis) */}
            <div className="w-3/4 p-8 overflow-y-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">{selectedPatient.name}</h1>
                    <div className="flex space-x-4 mt-2 text-lg text-gray-600">
                        <span>Age: {selectedPatient.age}</span>
                        <span>Condition: <span className="font-semibold text-blue-600">{selectedPatient.condition}</span></span>
                        <span>Language: {selectedPatient.language}</span>
                    </div>
                </div>

                {/* Risk Analysis Card */}
                <Card className="mb-8 bg-red-50 border-red-200">
                    <CardHeader>
                        <CardTitle className="text-xl text-red-700">Risk Analysis: Population Health Monitor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-800 mb-3">
                            ⚠️ High Risk: {selectedPatient.condition} + {currentThreat.type} Threat
                        </p>
                        <p className="text-gray-700">
                            Current Risk Score: <span className="font-extrabold text-red-800">{selectedPatient.riskScore}</span>/100
                        </p>
                        <p className="mt-2 text-gray-700">
                            <span className="font-semibold">Reasoning:</span> {currentThreat.impact} {selectedPatient.name} has a severe pre-existing respiratory condition ({selectedPatient.condition}), making them highly vulnerable to current air quality spike.
                        </p>
                    </CardContent>
                </Card>

                {/* Multilingual Advisory Generator */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl">Multilingual Advisory Generator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* English Draft */}
                        <div className="p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-semibold text-lg mb-1">English Draft (Default)</h3>
                            <p className="whitespace-pre-wrap text-sm text-gray-700">{getAdvisoryText('English', selectedPatient.name)}</p>
                        </div>
                        
                        {/* Hindi Draft */}
                        <div className="p-4 border rounded-lg bg-red-50">
                            <h3 className="font-semibold text-lg mb-1">Hindi Draft ({selectedPatient.language === 'Hindi' ? 'Target Language' : 'Alternative Language'})</h3>
                            <p className="whitespace-pre-wrap text-sm text-gray-700">{getAdvisoryText('Hindi', selectedPatient.name)}</p>
                        </div>

                        {/* Marathi Draft */}
                        <div className="p-4 border rounded-lg bg-red-50">
                            <h3 className="font-semibold text-lg mb-1">Marathi Draft ({selectedPatient.language === 'Marathi' ? 'Target Language' : 'Alternative Language'})</h3>
                            <p className="whitespace-pre-wrap text-sm text-gray-700">{getAdvisoryText('Marathi', selectedPatient.name)}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <Button variant="outline" onClick={() => handleAction('SMS')}>
                                Send SMS to {selectedPatient.phone}
                            </Button>
                            <Button onClick={() => handleAction('WhatsApp')}>
                                Send WhatsApp to {selectedPatient.phone}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdvisoryPage;