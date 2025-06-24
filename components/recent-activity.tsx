"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp, MessageSquare, CheckSquare, Settings } from "lucide-react"

const activities = [
  {
    type: "insight",
    title: "New strategic insight generated",
    description: "Customer acquisition optimization opportunity identified",
    time: "2 hours ago",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    type: "task",
    title: "Task completed",
    description: "Q4 performance review finished",
    time: "4 hours ago",
    icon: CheckSquare,
    color: "text-blue-600",
  },
  {
    type: "chat",
    title: "AI coaching session",
    description: "Discussed market expansion strategy",
    time: "1 day ago",
    icon: MessageSquare,
    color: "text-purple-600",
  },
  {
    type: "integration",
    title: "New integration added",
    description: "Connected Salesforce CRM",
    time: "2 days ago",
    icon: Settings,
    color: "text-orange-600",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-gray-600" />
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon

            return (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-gray-50 ${activity.color}`}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
