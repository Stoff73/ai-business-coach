"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Users, Target, BarChart3 } from "lucide-react"

const metrics = [
  {
    title: "Monthly Revenue",
    value: "$124,500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Active Customers",
    value: "2,847",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-0.8%",
    trend: "down",
    icon: Target,
    color: "text-orange-600",
  },
  {
    title: "Growth Rate",
    value: "18.7%",
    change: "+2.1%",
    trend: "up",
    icon: BarChart3,
    color: "text-purple-600",
  },
]

export function BusinessMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown

        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="flex items-center text-xs mt-1">
                <TrendIcon className={`h-3 w-3 mr-1 ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>{metric.change}</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
