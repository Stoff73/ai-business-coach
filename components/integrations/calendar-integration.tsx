"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, TrendingUp, CheckCircle, AlertTriangle, Settings, BarChart3 } from "lucide-react"

interface CalendarIntegrationProps {
  connected: boolean
  onToggle: () => void
}

export function CalendarIntegration({ connected, onToggle }: CalendarIntegrationProps) {
  const [selectedCalendar, setSelectedCalendar] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [trackingSettings, setTrackingSettings] = useState({
    meetingAnalytics: true,
    timeBlocking: true,
    productivityInsights: true,
    scheduleOptimization: false,
  })

  const calendarApps = [
    { id: "outlook-calendar", name: "Microsoft Outlook Calendar", icon: "📅" },
    { id: "apple-calendar", name: "Apple Calendar", icon: "🗓️" },
    { id: "google-calendar", name: "Google Calendar", icon: "📆" },
    { id: "thunderbird-calendar", name: "Thunderbird Calendar", icon: "⚡" },
  ]

  const handleConnect = async () => {
    if (connected) {
      onToggle()
      return
    }

    if (!selectedCalendar) return

    setIsConnecting(true)

    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsConnecting(false)
    onToggle()
  }

  const toggleTrackingSetting = (setting: keyof typeof trackingSettings) => {
    setTrackingSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <span className="font-medium">Calendar Integration</span>
        </div>
        <Switch
          checked={connected}
          onCheckedChange={handleConnect}
          disabled={isConnecting || (!connected && !selectedCalendar)}
        />
      </div>

      <p className="text-sm text-gray-600">
        Analyze your calendar for productivity insights and meeting optimization recommendations.
      </p>

      {!connected && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Select Calendar App</label>
            <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your calendar app" />
              </SelectTrigger>
              <SelectContent>
                {calendarApps.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    <div className="flex items-center space-x-2">
                      <span>{app.icon}</span>
                      <span>{app.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Privacy Protected</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Calendar analysis is performed locally. Event details remain private on your device.
            </p>
          </div>

          {isConnecting && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-purple-600">
                Connecting to {calendarApps.find((c) => c.id === selectedCalendar)?.name}...
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
              <span className="text-sm font-medium text-green-800">Calendar Connected</span>
            </div>
            <p className="text-xs text-green-700 mt-1">Analyzing schedule patterns and productivity metrics</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Tracking Settings</h4>

            {Object.entries(trackingSettings).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </p>
                  <p className="text-xs text-gray-500">
                    {key === "meetingAnalytics" && "Track meeting frequency, duration, and patterns"}
                    {key === "timeBlocking" && "Analyze time allocation across different activities"}
                    {key === "productivityInsights" && "Identify peak productivity hours and patterns"}
                    {key === "scheduleOptimization" && "Get AI recommendations for optimal meeting scheduling"}
                  </p>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => toggleTrackingSetting(key as keyof typeof trackingSettings)}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Time Analytics</span>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-blue-700">Meetings: 18h/week</p>
                <p className="text-xs text-blue-700">Focus Time: 22h/week</p>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded border border-purple-200">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Productivity</span>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-purple-700">Peak Hours: 9-11 AM</p>
                <p className="text-xs text-purple-700">Efficiency: 78%</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Schedule Analytics
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
            "Meeting frequency and duration analysis",
            "Time allocation across projects",
            "Peak productivity hour identification",
            "Schedule optimization recommendations",
            "Work-life balance metrics",
          ].map((insight, index) => (
            <li key={index} className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-gray-600">{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
