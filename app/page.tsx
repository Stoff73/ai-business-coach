import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Brain,
  Megaphone,
  DollarSign,
  Settings,
  Smile,
  TrendingUp
} from "lucide-react"

const agents = [
  {
    name: "Business Coach",
    description: "Strategic guidance for your company",
    href: "/coach",
    icon: Brain,
  },
  {
    name: "Marketing Strategist",
    description: "Boost your marketing efforts",
    href: "/agents/marketing",
    icon: Megaphone,
  },
  {
    name: "Finance Advisor",
    description: "Optimize revenue and costs",
    href: "/agents/finance",
    icon: DollarSign,
  },
  {
    name: "Operations Optimizer",
    description: "Streamline daily workflows",
    href: "/agents/operations",
    icon: Settings,
  },
  {
    name: "Customer Support",
    description: "Enhance client satisfaction",
    href: "/agents/support",
    icon: Smile,
  },
  {
    name: "Growth Hacker",
    description: "Identify expansion opportunities",
    href: "/agents/growth",
    icon: TrendingUp,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Select an AI Agent</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const Icon = agent.icon
            return (
              <Link key={agent.name} href={agent.href} className="block">
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span>{agent.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{agent.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
