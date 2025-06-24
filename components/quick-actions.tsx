"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, BarChart3, Settings, Zap, FileText, Calendar } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Ask AI Coach",
    description: "Get strategic advice",
    icon: MessageSquare,
    href: "/coach",
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
  {
    title: "View Analytics",
    description: "Deep dive into metrics",
    icon: BarChart3,
    href: "/analytics",
    color: "bg-green-50 text-green-600 hover:bg-green-100",
  },
  {
    title: "Generate Report",
    description: "Create business report",
    icon: FileText,
    href: "/reports",
    color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
  },
  {
    title: "Schedule Review",
    description: "Plan strategy session",
    icon: Calendar,
    href: "/schedule",
    color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  },
  {
    title: "Optimize Process",
    description: "AI-powered suggestions",
    icon: Zap,
    href: "/optimize",
    color: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
  },
  {
    title: "Manage Integrations",
    description: "Connect your tools",
    icon: Settings,
    href: "/integrations",
    color: "bg-gray-50 text-gray-600 hover:bg-gray-100",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon

            return (
              <Link key={index} href={action.href}>
                <Button
                  variant="ghost"
                  className={`h-auto p-3 flex flex-col items-center space-y-2 w-full ${action.color}`}
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-center">
                    <div className="text-xs font-medium">{action.title}</div>
                    <div className="text-xs opacity-70">{action.description}</div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
