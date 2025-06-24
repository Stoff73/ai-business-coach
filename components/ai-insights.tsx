"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, AlertTriangle, Target, ArrowRight } from "lucide-react"

const insights = [
  {
    type: "opportunity",
    title: "Optimize Customer Acquisition",
    description:
      "Your CAC has decreased by 15% while LTV increased by 8%. Consider scaling your top-performing marketing channels.",
    impact: "High",
    action: "Review marketing spend allocation",
    icon: TrendingUp,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    type: "warning",
    title: "Conversion Rate Decline",
    description: "Website conversion rate dropped 0.8% this month. User session data suggests checkout friction.",
    impact: "Medium",
    action: "Audit checkout process",
    icon: AlertTriangle,
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    type: "strategy",
    title: "Market Expansion Opportunity",
    description: "Analysis shows 23% of your traffic comes from untapped geographic regions with high purchase intent.",
    impact: "High",
    action: "Explore regional expansion",
    icon: Target,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
]

export function AIInsights() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <CardTitle>AI Strategic Insights</CardTitle>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon

          return (
            <div key={index} className={`p-4 rounded-lg border ${insight.color}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <h3 className="font-semibold text-sm">{insight.title}</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {insight.impact} Impact
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-3">{insight.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Recommended Action: {insight.action}</span>
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                  Act Now
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
