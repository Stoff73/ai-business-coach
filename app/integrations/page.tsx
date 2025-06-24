"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  CheckCircle,
  AlertCircle,
  Plus,
  ExternalLink,
  Zap,
  Database,
  Mail,
  CreditCard,
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  HardDrive,
} from "lucide-react"
import { FileUploadZone } from "@/components/integrations/file-upload-zone"
import { LocalDriveIntegration } from "@/components/integrations/local-drive-integration"
import { EmailIntegration } from "@/components/integrations/email-integration"
import { CalendarIntegration } from "@/components/integrations/calendar-integration"

const integrations = [
  {
    id: 1,
    name: "Salesforce CRM",
    description: "Sync customer data and sales pipeline",
    category: "CRM",
    icon: Users,
    connected: true,
    status: "active",
    lastSync: "2 hours ago",
    features: ["Customer sync", "Lead tracking", "Sales analytics"],
  },
  {
    id: 2,
    name: "Google Analytics",
    description: "Track website performance and user behavior",
    category: "Analytics",
    icon: BarChart3,
    connected: true,
    status: "active",
    lastSync: "1 hour ago",
    features: ["Traffic analysis", "Conversion tracking", "Audience insights"],
  },
  {
    id: 3,
    name: "Stripe Payments",
    description: "Process payments and manage subscriptions",
    category: "Payments",
    icon: CreditCard,
    connected: true,
    status: "active",
    lastSync: "30 minutes ago",
    features: ["Payment processing", "Subscription management", "Revenue tracking"],
  },
  {
    id: 4,
    name: "Mailchimp",
    description: "Email marketing and automation",
    category: "Marketing",
    icon: Mail,
    connected: false,
    status: "available",
    lastSync: null,
    features: ["Email campaigns", "Automation", "Audience segmentation"],
  },
  {
    id: 5,
    name: "Slack",
    description: "Team communication and notifications",
    category: "Communication",
    icon: MessageSquare,
    connected: true,
    status: "active",
    lastSync: "5 minutes ago",
    features: ["Team notifications", "Alert management", "Progress updates"],
  },
  {
    id: 6,
    name: "HubSpot",
    description: "Marketing, sales, and service platform",
    category: "CRM",
    icon: Database,
    connected: false,
    status: "available",
    lastSync: null,
    features: ["Lead management", "Marketing automation", "Customer service"],
  },
  {
    id: 7,
    name: "Calendly",
    description: "Schedule meetings and appointments",
    category: "Productivity",
    icon: Calendar,
    connected: false,
    status: "available",
    lastSync: null,
    features: ["Meeting scheduling", "Calendar sync", "Automated reminders"],
  },
  {
    id: 8,
    name: "Zapier",
    description: "Automate workflows between apps",
    category: "Automation",
    icon: Zap,
    connected: true,
    status: "active",
    lastSync: "15 minutes ago",
    features: ["Workflow automation", "App connections", "Trigger management"],
  },
]

const localIntegrations = [
  {
    id: "local-drive",
    name: "Local Drive Access",
    description: "Access and analyze files from your computer",
    icon: HardDrive,
    connected: false,
    features: ["File analysis", "Document insights", "Data extraction"],
  },
  {
    id: "email-client",
    name: "Email Client",
    description: "Connect your email for communication insights",
    icon: Mail,
    connected: false,
    features: ["Email analytics", "Communication patterns", "Contact insights"],
  },
  {
    id: "calendar-app",
    name: "Calendar Integration",
    description: "Sync your calendar for productivity insights",
    icon: Calendar,
    connected: false,
    features: ["Meeting analytics", "Time tracking", "Schedule optimization"],
  },
]

const categories = ["All", "CRM", "Analytics", "Payments", "Marketing", "Communication", "Productivity", "Automation"]

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [integrationStates, setIntegrationStates] = useState(
    integrations.reduce(
      (acc, integration) => {
        acc[integration.id] = integration.connected
        return acc
      },
      {} as Record<number, boolean>,
    ),
  )
  const [localIntegrationStates, setLocalIntegrationStates] = useState(
    localIntegrations.reduce(
      (acc, integration) => {
        acc[integration.id] = integration.connected
        return acc
      },
      {} as Record<string, boolean>,
    ),
  )

  const toggleIntegration = (id: number) => {
    setIntegrationStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleLocalIntegration = (id: string) => {
    setLocalIntegrationStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const filteredIntegrations = integrations.filter(
    (integration) => selectedCategory === "All" || integration.category === selectedCategory,
  )

  const connectedCount = Object.values(integrationStates).filter(Boolean).length
  const availableCount = integrations.length - connectedCount

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations & File Analysis</h1>
          <p className="text-gray-600">
            Connect your business tools and upload files to unlock powerful AI insights and automation
          </p>
        </div>

        <Tabs defaultValue="cloud" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cloud">Cloud Integrations</TabsTrigger>
            <TabsTrigger value="local">Local & Desktop</TabsTrigger>
            <TabsTrigger value="files">File Analysis</TabsTrigger>
          </TabsList>

          {/* Cloud Integrations Tab */}
          <TabsContent value="cloud" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Connected</p>
                      <p className="text-2xl font-bold text-green-600">{connectedCount}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Available</p>
                      <p className="text-2xl font-bold text-blue-600">{availableCount}</p>
                    </div>
                    <Plus className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-2xl font-bold text-purple-600">{categories.length - 1}</p>
                    </div>
                    <Settings className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Filter */}
            <Card>
              <CardContent className="p-6">
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
              </CardContent>
            </Card>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration) => {
                const Icon = integration.icon
                const isConnected = integrationStates[integration.id]

                return (
                  <Card key={integration.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${isConnected ? "bg-green-100" : "bg-gray-100"}`}>
                            <Icon className={`h-6 w-6 ${isConnected ? "text-green-600" : "text-gray-600"}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {integration.category}
                            </Badge>
                          </div>
                        </div>
                        <Switch checked={isConnected} onCheckedChange={() => toggleIntegration(integration.id)} />
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <div className="flex items-center space-x-1">
                            {isConnected ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-green-600 font-medium">Connected</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-500">Available</span>
                              </>
                            )}
                          </div>
                        </div>

                        {isConnected && integration.lastSync && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Last sync:</span>
                            <span className="text-gray-700">{integration.lastSync}</span>
                          </div>
                        )}

                        <div className="pt-2">
                          <p className="text-xs text-gray-500 mb-2">Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {integration.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 flex space-x-2">
                          <Button
                            size="sm"
                            variant={isConnected ? "outline" : "default"}
                            className={!isConnected ? "bg-blue-600 hover:bg-blue-700 flex-1" : "flex-1"}
                          >
                            {isConnected ? "Configure" : "Connect"}
                          </Button>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Local & Desktop Tab */}
          <TabsContent value="local" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Local Drive Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HardDrive className="h-5 w-5 text-blue-600" />
                    <span>Local Drive Access</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LocalDriveIntegration
                    connected={localIntegrationStates["local-drive"]}
                    onToggle={() => toggleLocalIntegration("local-drive")}
                  />
                </CardContent>
              </Card>

              {/* Email Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-green-600" />
                    <span>Email Integration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EmailIntegration
                    connected={localIntegrationStates["email-client"]}
                    onToggle={() => toggleLocalIntegration("email-client")}
                  />
                </CardContent>
              </Card>

              {/* Calendar Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span>Calendar Integration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CalendarIntegration
                    connected={localIntegrationStates["calendar-app"]}
                    onToggle={() => toggleLocalIntegration("calendar-app")}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Local Integration Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>Local Integration Benefits</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Privacy First</h3>
                    <p className="text-sm text-blue-700">
                      Your data stays on your device. AI analysis happens locally with optional cloud processing for
                      enhanced insights.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2">Real-time Analysis</h3>
                    <p className="text-sm text-green-700">
                      Instant insights from your local files, emails, and calendar without waiting for cloud sync.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-2">Comprehensive View</h3>
                    <p className="text-sm text-purple-700">
                      Combine local data with cloud integrations for a complete picture of your business operations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* File Analysis Tab */}
          <TabsContent value="files" className="space-y-6">
            <FileUploadZone />
          </TabsContent>
        </Tabs>

        {/* AI Integration Benefits */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>AI-Powered Integration Benefits</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Automated Insights</h3>
                <p className="text-sm text-blue-700">
                  AI analyzes data across all connected tools to provide unified business insights and recommendations.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Smart Workflows</h3>
                <p className="text-sm text-green-700">
                  Automatically trigger actions across platforms based on AI-detected patterns and business rules.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">Predictive Analytics</h3>
                <p className="text-sm text-purple-700">
                  Leverage combined data sources for accurate forecasting and proactive business decisions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
