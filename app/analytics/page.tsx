"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Target, Download, Calendar, Filter } from "lucide-react"

const metrics = [
  {
    title: "Revenue Growth",
    value: "$124,500",
    change: "+12.5%",
    trend: "up",
    period: "vs last month",
  },
  {
    title: "Customer Acquisition",
    value: "2,847",
    change: "+8.2%",
    trend: "up",
    period: "active customers",
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-0.8%",
    trend: "down",
    period: "needs attention",
  },
  {
    title: "Average Order Value",
    value: "$87.50",
    change: "+5.3%",
    trend: "up",
    period: "vs last month",
  },
]

const insights = [
  {
    title: "Peak Performance Hours",
    description: "Your business performs best between 2-4 PM EST with 34% higher conversion rates.",
    impact: "High",
    action: "Schedule marketing campaigns during peak hours",
  },
  {
    title: "Geographic Opportunity",
    description: "23% of traffic comes from untapped regions with high purchase intent.",
    impact: "High",
    action: "Consider regional expansion strategy",
  },
  {
    title: "Customer Lifetime Value",
    description: "CLV increased by 15% while CAC decreased by 8% - excellent efficiency gains.",
    impact: "Medium",
    action: "Scale successful acquisition channels",
  },
  {
    title: "Mobile Experience Gap",
    description: "Mobile conversion rate is 40% lower than desktop, indicating UX issues.",
    impact: "High",
    action: "Prioritize mobile optimization",
  },
]

const channelPerformance = [
  { channel: "Organic Search", revenue: "$45,200", growth: "+15.2%", conversion: "4.1%" },
  { channel: "Paid Social", revenue: "$32,800", growth: "+8.7%", conversion: "2.8%" },
  { channel: "Email Marketing", revenue: "$28,500", growth: "+22.1%", conversion: "6.2%" },
  { channel: "Direct Traffic", revenue: "$18,000", growth: "+5.3%", conversion: "3.9%" },
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Analytics</h1>
              <p className="text-gray-600">Deep insights into your business performance and growth opportunities</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 Days
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown

            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                    <TrendIcon className={`h-4 w-4 ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="flex items-center text-sm">
                    <span className={`font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {metric.change}
                    </span>
                    <span className="text-gray-500 ml-1">{metric.period}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Revenue Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive revenue chart would be displayed here</p>
                  <p className="text-sm text-gray-500">Showing 30-day trend with $124.5K total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>Conversion Funnel</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Website Visitors</span>
                  <span className="font-bold">12,450</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-100 rounded">
                  <span className="text-sm font-medium">Product Views</span>
                  <span className="font-bold">4,230 (34%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-200 rounded">
                  <span className="text-sm font-medium">Add to Cart</span>
                  <span className="font-bold">1,680 (13.5%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-300 rounded">
                  <span className="text-sm font-medium">Checkout Started</span>
                  <span className="font-bold">890 (7.1%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-400 text-white rounded">
                  <span className="text-sm font-medium">Purchase Complete</span>
                  <span className="font-bold">403 (3.24%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Channel Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span>Channel Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Channel</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Growth</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Conversion</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {channelPerformance.map((channel, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{channel.channel}</td>
                      <td className="py-3 px-4">{channel.revenue}</td>
                      <td className="py-3 px-4">
                        <span className="text-green-600 font-medium">{channel.growth}</span>
                      </td>
                      <td className="py-3 px-4">{channel.conversion}</td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">
                          Optimize
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>AI-Powered Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        insight.impact === "High" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {insight.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Recommended: {insight.action}</span>
                    <Button size="sm" variant="ghost" className="text-xs">
                      Take Action
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
