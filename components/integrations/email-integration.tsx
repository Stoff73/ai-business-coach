"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, BarChart3, Users, CheckCircle, AlertTriangle, Settings } from "lucide-react"

interface EmailIntegrationProps {
  connected: boolean
  onToggle: () => void
}

export function EmailIntegration({ connected, onToggle }: EmailIntegrationProps) {
  const [selectedClient, setSelectedClient] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [analysisSettings, setAnalysisSettings] = useState({
    communicationPatterns: true,
    customerInteractions: true,
    leadTracking: false,
    sentimentAnalysis: true,
  })

  const emailClients = [
    { id: "outlook", name: "Microsoft Outlook", icon: "📧" },
    { id: "apple-mail", name: "Apple Mail", icon: "✉️" },
    { id: "thunderbird", name: "Mozilla Thunderbird", icon: "🦅" },
    { id: "gmail-desktop", name: "Gmail Desktop", icon: "📮" },
  ]

  const handleConnect = async () => {
    if (connected) {
      onToggle()
      return
    }

    if (!selectedClient) return

    setIsConnecting(true)

    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsConnecting(false)
    onToggle()
  }

  const toggleAnalysisSetting = (setting: keyof typeof analysisSettings) => {
    setAnalysisSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-green-600" />
          <span className="font-medium">Email Integration</span>
        </div>
        <Switch
          checked={connected}
          onCheckedChange={handleConnect}
          disabled={isConnecting || (!connected && !selectedClient)}
        />
      </div>

      <p className="text-sm text-gray-600">
        Analyze email communications for business insights and customer relationship patterns.
      </p>

      {!connected && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Select Email Client</label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your email client" />
              </SelectTrigger>
              <SelectContent>
                {emailClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center space-x-2">
                      <span>{client.icon}</span>
                      <span>{client.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Privacy Notice</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Email analysis is performed locally. No email content is sent to external servers.
            </p>
          </div>

          {isConnecting && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-green-600">
                Connecting to {emailClients.find((c) => c.id === selectedClient)?.name}...
              </span>
            </div>
          )}
        </div>
      )}

      {connected && (
        <div className="space-y-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Email Client Connected</span>
            </div>
            <p className="text-xs text-green-700 mt-1">Analyzing communication patterns and customer interactions</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Analysis Settings</h4>

            {Object.entries(analysisSettings).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </p>
                  <p className="text-xs text-gray-500">
                    {key === "communicationPatterns" && "Track email frequency and response times"}
                    {key === "customerInteractions" && "Analyze customer communication quality"}
                    {key === "leadTracking" && "Identify potential leads from email content"}
                    {key === "sentimentAnalysis" && "Analyze tone and sentiment of communications"}
                  </p>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => toggleAnalysisSetting(key as keyof typeof analysisSettings)}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Email Metrics</span>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-blue-700">Response Rate: 87%</p>
                <p className="text-xs text-blue-700">Avg Response Time: 2.3h</p>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded border border-purple-200">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Contacts</span>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-purple-700">Active: 234</p>
                <p className="text-xs text-purple-700">New This Week: 12</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900">Available Insights:</h4>
        <ul className="space-y-1">
          {[
            "Communication frequency analysis",
            "Customer response patterns",
            "Lead identification and scoring",
            "Sentiment and tone analysis",
            "Meeting scheduling optimization",
          ].map((insight, index) => (
            <li key={index} className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
