"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Bot, Bell, FileText, Target, TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react"

interface PreferencesStepProps {
  data: {
    coachingStyle: string
    reportingPreference: string
    notificationFrequency: string
    focusAreas: string[]
  }
  onUpdate: (data: any) => void
}

const coachingStyles = [
  {
    id: "strategic",
    name: "Strategic Advisor",
    description: "High-level strategic insights and long-term planning focus",
    icon: Target,
  },
  {
    id: "analytical",
    name: "Data-Driven Analyst",
    description: "Deep data analysis with detailed metrics and performance insights",
    icon: BarChart3,
  },
  {
    id: "growth-focused",
    name: "Growth Hacker",
    description: "Aggressive growth tactics and rapid experimentation approach",
    icon: TrendingUp,
  },
  {
    id: "balanced",
    name: "Balanced Coach",
    description: "Mix of strategic, analytical, and tactical recommendations",
    icon: Bot,
  },
]

const reportingPreferences = [
  "Executive Summary (High-level overview)",
  "Detailed Analysis (Comprehensive insights)",
  "Action-Focused (Specific next steps)",
  "Visual Dashboard (Charts and graphs)",
]

const notificationFrequencies = [
  "Real-time (Immediate alerts)",
  "Daily Digest (Once per day)",
  "Weekly Summary (Once per week)",
  "Monthly Report (Once per month)",
  "Only Critical Issues",
]

const focusAreas = [
  { id: "revenue-growth", label: "Revenue Growth", icon: DollarSign },
  { id: "customer-acquisition", label: "Customer Acquisition", icon: Users },
  { id: "operational-efficiency", label: "Operational Efficiency", icon: Target },
  { id: "market-expansion", label: "Market Expansion", icon: TrendingUp },
  { id: "product-development", label: "Product Development", icon: Target },
  { id: "team-management", label: "Team Management", icon: Users },
  { id: "financial-management", label: "Financial Management", icon: DollarSign },
  { id: "competitive-analysis", label: "Competitive Analysis", icon: BarChart3 },
]

export function PreferencesStep({ data, onUpdate }: PreferencesStepProps) {
  const handleStyleChange = (style: string) => {
    onUpdate({ coachingStyle: style })
  }

  const handleReportingChange = (preference: string) => {
    onUpdate({ reportingPreference: preference })
  }

  const handleNotificationChange = (frequency: string) => {
    onUpdate({ notificationFrequency: frequency })
  }

  const handleFocusAreaToggle = (areaId: string) => {
    const updatedAreas = data.focusAreas.includes(areaId)
      ? data.focusAreas.filter((a) => a !== areaId)
      : [...data.focusAreas, areaId]
    onUpdate({ focusAreas: updatedAreas })
  }

  return (
    <div className="space-y-8">
      {/* Coaching Style */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">AI Coaching Style</h3>
        </div>
        <p className="text-sm text-gray-600">
          Choose the coaching approach that best matches your preferences and business needs:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coachingStyles.map((style) => {
            const Icon = style.icon
            const isSelected = data.coachingStyle === style.id

            return (
              <div
                key={style.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleStyleChange(style.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-100" : "bg-gray-100"}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-600"}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                      {style.name}
                    </h4>
                    <p className="text-sm text-gray-600">{style.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reporting Preferences */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Reporting Preferences</h3>
        </div>
        <p className="text-sm text-gray-600">How would you prefer to receive your business insights and reports?</p>

        <Select value={data.reportingPreference} onValueChange={handleReportingChange}>
          <SelectTrigger className="max-w-md">
            <SelectValue placeholder="Select reporting style" />
          </SelectTrigger>
          <SelectContent>
            {reportingPreferences.map((preference) => (
              <SelectItem key={preference} value={preference}>
                {preference}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notification Frequency */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Notification Frequency</h3>
        </div>
        <p className="text-sm text-gray-600">How often would you like to receive notifications and alerts?</p>

        <Select value={data.notificationFrequency} onValueChange={handleNotificationChange}>
          <SelectTrigger className="max-w-md">
            <SelectValue placeholder="Select notification frequency" />
          </SelectTrigger>
          <SelectContent>
            {notificationFrequencies.map((frequency) => (
              <SelectItem key={frequency} value={frequency}>
                {frequency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Focus Areas */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">AI Focus Areas</h3>
        </div>
        <p className="text-sm text-gray-600">
          Select the areas where you'd like the AI to provide the most attention and insights:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {focusAreas.map((area) => {
            const Icon = area.icon
            const isSelected = data.focusAreas.includes(area.id)

            return (
              <div
                key={area.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleFocusAreaToggle(area.id)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox checked={isSelected} readOnly />
                  <Icon className={`w-4 h-4 ${isSelected ? "text-purple-600" : "text-gray-500"}`} />
                  <span className={`text-sm ${isSelected ? "text-purple-900 font-medium" : "text-gray-700"}`}>
                    {area.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {data.focusAreas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Selected focus areas:</span>
            {data.focusAreas.map((areaId) => {
              const area = focusAreas.find((a) => a.id === areaId)
              return (
                <Badge key={areaId} variant="secondary" className="bg-purple-100 text-purple-700">
                  {area?.label}
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Personalized AI Experience</h3>
        <p className="text-sm text-blue-700">
          Based on your preferences, our AI will tailor its communication style, focus areas, and reporting frequency to
          match your needs. You can always adjust these settings later in your dashboard.
        </p>
      </div>
    </div>
  )
}
