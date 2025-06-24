"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Target, BarChart3, Settings, Bot, CheckCircle, Edit, Rocket, Sparkles } from "lucide-react"
import type { SetupData } from "@/app/setup/page"

interface ReviewStepProps {
  data: SetupData
}

export function ReviewStep({ data }: ReviewStepProps) {
  const handleCompleteSetup = async () => {
    // Here you would typically save the setup data to your backend
    console.log("Setup data:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to dashboard
    window.location.href = "/"
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
        <p className="text-gray-600">Review your configuration and launch your AI business coach</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Business Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Company</p>
              <p className="text-gray-900">{data.businessInfo.companyName || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Industry</p>
              <p className="text-gray-900">{data.businessInfo.industry || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Business Model</p>
              <p className="text-gray-900">{data.businessInfo.businessModel || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Company Size</p>
              <p className="text-gray-900">{data.businessInfo.companySize || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue Range</p>
              <p className="text-gray-900">{data.businessInfo.revenue || "Not specified"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Goals & Objectives */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <span>Goals & Objectives</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Primary Goals</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.goals.primaryGoals.length > 0 ? (
                  data.goals.primaryGoals.map((goal) => (
                    <Badge key={goal} variant="secondary" className="text-xs">
                      {goal.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None selected</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Timeframe</p>
              <p className="text-gray-900">{data.goals.timeframe || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Target Revenue</p>
              <p className="text-gray-900">{data.goals.targetRevenue || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Current Challenges</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.goals.challenges.length > 0 ? (
                  data.goals.challenges.slice(0, 3).map((challenge) => (
                    <Badge key={challenge} variant="outline" className="text-xs">
                      {challenge.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None selected</span>
                )}
                {data.goals.challenges.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{data.goals.challenges.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Key Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Tracking Metrics</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.metrics.trackingMetrics.length > 0 ? (
                  data.metrics.trackingMetrics.slice(0, 4).map((metric) => (
                    <Badge key={metric} variant="secondary" className="text-xs">
                      {metric.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None selected</span>
                )}
                {data.metrics.trackingMetrics.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{data.metrics.trackingMetrics.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Reporting Frequency</p>
              <p className="text-gray-900">{data.metrics.reportingFrequency || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Current Values Set</p>
              <p className="text-gray-900">{Object.keys(data.metrics.currentMetrics).length} metrics configured</p>
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Settings className="w-5 h-5 text-orange-600" />
              <span>Integrations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Selected Integrations</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.integrations.selectedIntegrations.length > 0 ? (
                  data.integrations.selectedIntegrations.slice(0, 3).map((integration) => (
                    <Badge key={integration} variant="secondary" className="text-xs">
                      {integration.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None selected</span>
                )}
                {data.integrations.selectedIntegrations.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{data.integrations.selectedIntegrations.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Priority Areas</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.integrations.priorities.length > 0 ? (
                  data.integrations.priorities.slice(0, 2).map((priority) => (
                    <Badge key={priority} variant="outline" className="text-xs">
                      {priority.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None selected</span>
                )}
                {data.integrations.priorities.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{data.integrations.priorities.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Preferences */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span>AI Coaching Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Coaching Style</p>
              <p className="text-gray-900">
                {data.preferences.coachingStyle
                  ? data.preferences.coachingStyle.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
                  : "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Reporting Style</p>
              <p className="text-gray-900">{data.preferences.reportingPreference || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-gray-900">{data.preferences.notificationFrequency || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Focus Areas</p>
              <p className="text-gray-900">{data.preferences.focusAreas.length} areas selected</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-blue-600" />
            <span>What Happens Next?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">AI Analysis</h4>
                <p className="text-sm text-gray-600">
                  Our AI will analyze your business context and begin generating personalized insights
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Dashboard Setup</h4>
                <p className="text-sm text-gray-600">
                  Your personalized dashboard will be configured with relevant metrics and insights
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Start Coaching</h4>
                <p className="text-sm text-gray-600">
                  Begin receiving AI-powered business coaching and strategic recommendations
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" className="flex items-center space-x-2">
          <Edit className="w-4 h-4" />
          <span>Edit Configuration</span>
        </Button>

        <Button
          onClick={handleCompleteSetup}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center space-x-2 px-8"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Launch AI Business Coach</span>
        </Button>
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-gray-500">
          You can always modify these settings later in your dashboard preferences
        </p>
      </div>
    </div>
  )
}
