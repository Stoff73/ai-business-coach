"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Users, DollarSign, Calendar, AlertTriangle } from "lucide-react"

interface BusinessGoalsStepProps {
  data: {
    primaryGoals: string[]
    timeframe: string
    targetRevenue: string
    targetCustomers: string
    challenges: string[]
  }
  onUpdate: (data: any) => void
}

const availableGoals = [
  { id: "increase-revenue", label: "Increase Revenue", icon: DollarSign },
  { id: "acquire-customers", label: "Acquire More Customers", icon: Users },
  { id: "improve-retention", label: "Improve Customer Retention", icon: Target },
  { id: "expand-market", label: "Expand to New Markets", icon: TrendingUp },
  { id: "optimize-operations", label: "Optimize Operations", icon: Target },
  { id: "raise-funding", label: "Raise Funding", icon: DollarSign },
  { id: "launch-product", label: "Launch New Product", icon: Target },
  { id: "improve-margins", label: "Improve Profit Margins", icon: TrendingUp },
]

const timeframes = ["3 months", "6 months", "1 year", "2 years", "3+ years"]

const commonChallenges = [
  { id: "customer-acquisition", label: "Customer Acquisition Cost too high" },
  { id: "low-conversion", label: "Low conversion rates" },
  { id: "customer-retention", label: "Customer retention issues" },
  { id: "cash-flow", label: "Cash flow management" },
  { id: "competition", label: "Intense competition" },
  { id: "scaling-team", label: "Scaling team and operations" },
  { id: "product-market-fit", label: "Finding product-market fit" },
  { id: "marketing-roi", label: "Poor marketing ROI" },
  { id: "operational-efficiency", label: "Operational inefficiencies" },
  { id: "technology-debt", label: "Technology/infrastructure limitations" },
]

export function BusinessGoalsStep({ data, onUpdate }: BusinessGoalsStepProps) {
  const handleGoalToggle = (goalId: string) => {
    const updatedGoals = data.primaryGoals.includes(goalId)
      ? data.primaryGoals.filter((g) => g !== goalId)
      : [...data.primaryGoals, goalId]
    onUpdate({ primaryGoals: updatedGoals })
  }

  const handleChallengeToggle = (challengeId: string) => {
    const updatedChallenges = data.challenges.includes(challengeId)
      ? data.challenges.filter((c) => c !== challengeId)
      : [...data.challenges, challengeId]
    onUpdate({ challenges: updatedChallenges })
  }

  const handleChange = (field: string, value: string) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="space-y-8">
      {/* Primary Goals */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Primary Business Goals</h3>
        </div>
        <p className="text-sm text-gray-600">Select your top 3-5 business objectives for the next period:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableGoals.map((goal) => {
            const Icon = goal.icon
            const isSelected = data.primaryGoals.includes(goal.id)

            return (
              <div
                key={goal.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox checked={isSelected} readOnly />
                  <Icon className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                  <span className={`font-medium ${isSelected ? "text-blue-900" : "text-gray-700"}`}>{goal.label}</span>
                </div>
              </div>
            )
          })}
        </div>

        {data.primaryGoals.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Selected goals:</span>
            {data.primaryGoals.map((goalId) => {
              const goal = availableGoals.find((g) => g.id === goalId)
              return (
                <Badge key={goalId} variant="secondary" className="bg-blue-100 text-blue-700">
                  {goal?.label}
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      {/* Timeframe and Targets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="timeframe" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Goal Timeframe *</span>
          </Label>
          <Select value={data.timeframe} onValueChange={(value) => handleChange("timeframe", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((timeframe) => (
                <SelectItem key={timeframe} value={timeframe}>
                  {timeframe}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetRevenue" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Target Revenue</span>
          </Label>
          <Input
            id="targetRevenue"
            value={data.targetRevenue}
            onChange={(e) => handleChange("targetRevenue", e.target.value)}
            placeholder="e.g., $100K/month"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetCustomers" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Target Customers</span>
          </Label>
          <Input
            id="targetCustomers"
            value={data.targetCustomers}
            onChange={(e) => handleChange("targetCustomers", e.target.value)}
            placeholder="e.g., 5,000 customers"
          />
        </div>
      </div>

      {/* Current Challenges */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Current Business Challenges</h3>
        </div>
        <p className="text-sm text-gray-600">
          Select the main challenges you're facing. This helps our AI prioritize recommendations:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {commonChallenges.map((challenge) => {
            const isSelected = data.challenges.includes(challenge.id)

            return (
              <div
                key={challenge.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleChallengeToggle(challenge.id)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox checked={isSelected} readOnly />
                  <span className={`text-sm ${isSelected ? "text-orange-900 font-medium" : "text-gray-700"}`}>
                    {challenge.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {data.challenges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Selected challenges:</span>
            {data.challenges.map((challengeId) => {
              const challenge = commonChallenges.find((c) => c.id === challengeId)
              return (
                <Badge key={challengeId} variant="secondary" className="bg-orange-100 text-orange-700">
                  {challenge?.label}
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-semibold text-green-900 mb-2">AI Goal Tracking</h3>
        <p className="text-sm text-green-700">
          Based on your goals and challenges, our AI will continuously monitor your progress, identify opportunities,
          and provide actionable recommendations to help you achieve your objectives faster.
        </p>
      </div>
    </div>
  )
}
