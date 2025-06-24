"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, BarChart3, CreditCard, Mail, Users, MessageSquare, Calendar, Database, Zap } from "lucide-react"

interface IntegrationsStepProps {
  data: {
    selectedIntegrations: string[]
    priorities: string[]
  }
  onUpdate: (data: any) => void
}

const availableIntegrations = [
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Website traffic and user behavior analytics",
    category: "Analytics",
    icon: BarChart3,
    priority: "High",
    benefits: ["Traffic insights", "Conversion tracking", "User behavior analysis"],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment processing and revenue tracking",
    category: "Payments",
    icon: CreditCard,
    priority: "High",
    benefits: ["Revenue tracking", "Payment analytics", "Subscription metrics"],
  },
  {
    id: "salesforce",
    name: "Salesforce CRM",
    description: "Customer relationship management",
    category: "CRM",
    icon: Users,
    priority: "Medium",
    benefits: ["Customer data", "Sales pipeline", "Lead tracking"],
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Email marketing and automation",
    category: "Marketing",
    icon: Mail,
    priority: "Medium",
    benefits: ["Email metrics", "Campaign performance", "Audience insights"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team communication and notifications",
    category: "Communication",
    icon: MessageSquare,
    priority: "Low",
    benefits: ["Team notifications", "Progress updates", "Alert management"],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Marketing, sales, and service platform",
    category: "CRM",
    icon: Database,
    priority: "Medium",
    benefits: ["Lead management", "Marketing automation", "Customer service"],
  },
  {
    id: "calendly",
    name: "Calendly",
    description: "Meeting scheduling and appointment booking",
    category: "Productivity",
    icon: Calendar,
    priority: "Low",
    benefits: ["Meeting analytics", "Booking insights", "Schedule optimization"],
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Workflow automation between apps",
    category: "Automation",
    icon: Zap,
    priority: "Medium",
    benefits: ["Workflow automation", "Data sync", "Process optimization"],
  },
]

const priorities = [
  { id: "revenue-tracking", label: "Revenue & Financial Tracking" },
  { id: "customer-analytics", label: "Customer Analytics & Insights" },
  { id: "marketing-performance", label: "Marketing Performance" },
  { id: "operational-efficiency", label: "Operational Efficiency" },
  { id: "team-productivity", label: "Team Productivity" },
]

export function IntegrationsStep({ data, onUpdate }: IntegrationsStepProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const handleIntegrationToggle = (integrationId: string) => {
    const updatedIntegrations = data.selectedIntegrations.includes(integrationId)
      ? data.selectedIntegrations.filter((i) => i !== integrationId)
      : [...data.selectedIntegrations, integrationId]
    onUpdate({ selectedIntegrations: updatedIntegrations })
  }

  const handlePriorityToggle = (priorityId: string) => {
    const updatedPriorities = data.priorities.includes(priorityId)
      ? data.priorities.filter((p) => p !== priorityId)
      : [...data.priorities, priorityId]
    onUpdate({ priorities: updatedPriorities })
  }

  const categories = ["All", ...Array.from(new Set(availableIntegrations.map((i) => i.category)))]
  const filteredIntegrations = availableIntegrations.filter(
    (integration) => selectedCategory === "All" || integration.category === selectedCategory,
  )

  return (
    <div className="space-y-8">
      {/* Integration Priorities */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Integration Priorities</h3>
        </div>
        <p className="text-sm text-gray-600">
          What areas are most important for your business intelligence? This helps us recommend the best integrations:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {priorities.map((priority) => {
            const isSelected = data.priorities.includes(priority.id)

            return (
              <div
                key={priority.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handlePriorityToggle(priority.id)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox checked={isSelected} readOnly />
                  <span className={`text-sm ${isSelected ? "text-blue-900 font-medium" : "text-gray-700"}`}>
                    {priority.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Integrations</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon
          const isSelected = data.selectedIntegrations.includes(integration.id)

          return (
            <div
              key={integration.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleIntegrationToggle(integration.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-100" : "bg-gray-100"}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-600"}`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                      {integration.name}
                    </h4>
                    <Badge
                      variant="secondary"
                      className={`text-xs mt-1 ${
                        integration.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : integration.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {integration.priority} Priority
                    </Badge>
                  </div>
                </div>
                <Checkbox checked={isSelected} readOnly />
              </div>

              <p className="text-sm text-gray-600 mb-3">{integration.description}</p>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">Benefits:</p>
                <div className="flex flex-wrap gap-1">
                  {integration.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {data.selectedIntegrations.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">
            Selected Integrations ({data.selectedIntegrations.length})
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.selectedIntegrations.map((integrationId) => {
              const integration = availableIntegrations.find((i) => i.id === integrationId)
              return (
                <Badge key={integrationId} variant="secondary" className="bg-green-100 text-green-700">
                  {integration?.name}
                </Badge>
              )
            })}
          </div>
          <p className="text-sm text-green-700">
            You can connect these integrations after setup is complete. Our AI will use data from these sources to
            provide more accurate insights and recommendations.
          </p>
        </div>
      )}
    </div>
  )
}
