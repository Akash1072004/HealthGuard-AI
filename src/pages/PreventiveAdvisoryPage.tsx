import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Phone, Users, Globe } from "lucide-react";

// --- Phone Preview Component ---
const WhatsAppMockup: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-full p-4">
      <div className="w-[300px] h-[600px] bg-gray-100 rounded-[30px] shadow-2xl overflow-hidden border-[10px] border-black relative">
        {/* Mockup Header (WhatsApp Style) */}
        <div className="h-16 bg-green-600 text-white flex items-center justify-between p-3">
          <span className="font-bold">Public Health Alert</span>
          <div className="flex space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75h19.5M2.25 12h19.5m-10.5 5.25h10.5" />
            </svg>
          </div>
        </div>
        
        {/* Mockup Chat Body */}
        <div className="h-[calc(100%-112px)] overflow-y-auto p-2 bg-[url('/public/whatsapp-bg.png')] bg-cover">
          <div className="flex justify-end mb-2">
            <div className="max-w-[80%] bg-[#DCF8C6] p-2 rounded-lg shadow">
              <p className="text-sm break-words">{message || "Type your advisory message here..."}</p>
              <div className="text-xs text-gray-500 text-right mt-1">
                9:41 AM
              </div>
            </div>
          </div>
        </div>
        
        {/* Mockup Input Area (Placeholder) */}
        <div className="h-12 bg-white border-t flex items-center p-2">
            <input 
                className="flex-1 border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none"
                placeholder="Message"
                disabled
            />
            <Button className="ml-2 h-8 w-8 rounded-full p-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A5.996 5.996 0 0115 12c0 2.83-1.405 5.4-3.593 7.874L6 12z" />
                </svg>
            </Button>
        </div>
      </div>
    </div>
  );
};

// --- Main Advisory Agent Component ---

const PreventiveAdvisoryPage = () => {
  const [messageContent, setMessageContent] = useState<string>("");
  const [selectedAudience, setSelectedAudience] = useState<string>("general_public");
  
  // Mock data for target reach based on selection
  const targetReachMap: { [key: string]: number } = {
    general_public: 5400000, // Example population for Mumbai area
    high_risk: 1200000,
    slum_areas: 2500000,
    all: 10000000,
  };
  
  const currentReach = targetReachMap[selectedAudience] || 0;
  
  const formatReach = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)} Million`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)} K`;
      return num.toString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Left Column: Controls (2/3 width on large screens) */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" /> 
              Audience & Targeting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="audience-select">Select Target Audience</Label>
                <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                  <SelectTrigger id="audience-select" className="w-full">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general_public">General Public (Mumbai)</SelectItem>
                    <SelectItem value="high_risk">High-Risk Communities</SelectItem>
                    <SelectItem value="slum_areas">Slum Areas (High Density)</SelectItem>
                    <SelectItem value="all">All Available Contacts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col justify-end">
                <Card className="p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Estimated Target Reach</div>
                    <div className="text-2xl font-bold text-green-600">
                        {formatReach(currentReach)}
                    </div>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-indigo-500" />
                Translation Studio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="english" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="hindi">Hindi</TabsTrigger>
                <TabsTrigger value="marathi">Marathi</TabsTrigger>
              </TabsList>
              
              <TabsContent value="english" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="message-en">English Advisory Content</Label>
                  <Textarea
                    id="message-en"
                    placeholder="Type your public health alert message in English here..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="hindi" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="message-hi">Hindi Advisory Content</Label>
                  <Textarea
                    id="message-hi"
                    placeholder="स्वास्थ्य चेतावनी संदेश हिंदी में टाइप करें (Auto-translation previewed here)..."
                    disabled
                    className="min-h-[200px]"
                    value={messageContent ? "ऑटो-जनरेटेड हिंदी अनुवाद: " + messageContent : ""}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="marathi" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="message-mr">Marathi Advisory Content</Label>
                  <Textarea
                    id="message-mr"
                    placeholder="आरोग्य सूचना संदेश मराठीत टाइप करा (Auto-translation previewed here)..."
                    disabled
                    className="min-h-[200px]"
                    value={messageContent ? "ऑटो-जनरेटेड मराठी अनुवाद: " + messageContent : ""}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
             <Button size="lg" className="bg-red-600 hover:bg-red-700">
                Send Public Health Advisory Now
            </Button>
        </div>

      </div>

      {/* Right Column: Phone Preview (1/3 width on large screens) */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6 h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-gray-500" />
                WhatsApp Message Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[700px] p-0">
            <WhatsAppMockup message={messageContent} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreventiveAdvisoryPage;