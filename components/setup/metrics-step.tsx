"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, DollarSign, Users, Target, Clock } from "lucide-react"

interface MetricsStepProps {
  data: {
    trackingMetrics: string[]
    currentMetrics: Record<string, string>
    reportingFrequency: string
  }
  onUpdate: (data: any) => void
}

const availableMetrics = [
  { id: "monthly-revenue", label: "Monthly Revenue", icon: DollarSign, unit: "$" },
  { id: "customer-count", label: "Total Customers", icon: Users, unit: "" },
  { id: "conversion-rate", label: "Conversion Rate", icon: Target, unit: "%" },
  { id: "customer-acquisition-cost", label: "Customer Acquisition Cost", icon: DollarSign, unit: "$" },
  { id: "lifetime-value", label: "Customer Lifetime Value", icon: TrendingUp, unit: "$" },
  { id: "monthly-recurring-revenue", label: "Monthly Recurring Revenue", icon: DollarSign, unit: "$" },
  { id: "churn-rate", label: "Churn Rate", icon: Target, unit: "%" },
  { id: "average-order-value", label: "Average Order Value", icon: DollarSign, unit: "$" },
  { id: "website-traffic", label: "Monthly Website Traffic", icon: BarChart3, unit: "" },
  { id: "lead-conversion", label: "Lead Conversion Rate", icon: Target, unit: "%" },
  { id: "gross-margin", label: "Gross Margin", icon: TrendingUp, unit: "%" },
  { id: "net-promoter-score", label: "Net Promoter Score", icon: Target, unit: "" },
]

const reportingFrequencies = ["Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly"]

export function MetricsStep({ data, onUpdate }: MetricsStepProps) {
  const handleMetricToggle = (metricId: string) => {
    const updatedMetrics = data.trackingMetrics.includes(metricId)
      ? data.trackingMetrics.filter((m) => m !== metricId)
      : [...data.trackingMetrics, metricId]
    onUpdate({ trackingMetrics: updatedMetrics })
  }

  const handleCurrentMetricChange = (metricId: string, value: string) => {
    onUpdate({
      currentMetrics: {
        ...data.currentMetrics,
        [metricId]: value,
      },
    })
  }

  const handleFrequencyChange = (frequency: string) => {
    onUpdate({ reportingFrequency: frequency })
  }

  return (
    <div className="space-y-8">
      {/* Metric Selection */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Key Performance Indicators</h3>
        </div>
        <p className="text-sm text-gray-600">
          Select the metrics most important to your business. Our AI will track these and provide insights:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableMetrics.map((metric) => {
            const Icon = metric.icon
            const isSelected = data.trackingMetrics.includes(metric.id)

            return (
              <div
                key={metric.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleMetricToggle(metric.id)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox checked={isSelected} readOnly />
                  <Icon className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                  <span className={`font-medium ${isSelected ? "text-blue-900" : "text-gray-700"}`}>
                    {metric.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {data.trackingMetrics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Selected metrics:</span>
            {data.trackingMetrics.map((metricId) => {
              const metric = availableMetrics.find((m) => m.id === metricId)
              return (
                <Badge key={metricId} variant="secondary" className="bg-blue-100 text-blue-700">
                  {metric?.label}
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      {/* Current Values */}
      {data.trackingMetrics.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Current Metric Values</h3>
          </div>
          <p className="text-sm text-gray-600">
            Enter your current values to establish baselines for AI tracking and recommendations:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.trackingMetrics.map((metricId) => {
              const metric = availableMetrics.find((m) => m.id === metricId)
              if (!metric) return null

              return (
                <div key={metricId} className="space-y-2">
                  <Label htmlFor={metricId} className="flex items-center space-x-2">
                    <metric.icon className="w-4 h-4" />
                    <span>{metric.label}</span>
                  </Label>
                  <div className="relative">
                    {metric.unit && (
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {metric.unit}
                      </span>
                    )}
                    <Input
                      id={metricId}
                      value={data.currentMetrics[metricId] || ""}
                      onChange={(e) => handleCurrentMetricChange(metricId, e.target.value)}
                      placeholder={`Enter current ${metric.label.toLowerCase()}`}
                      className={metric.unit ? "pl-8" : ""}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Reporting Frequency */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Reporting Frequency</h3>
        </div>
        <p className="text-sm text-gray-600">How often would you like to receive AI insights and reports?</p>

        <div className="max-w-md">
          <Select value={data.reportingFrequency} onValueChange={handleFrequencyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select reporting frequency" />
            </SelectTrigger>
            <SelectContent>
              {reportingFrequencies.map((frequency) => (
                <SelectItem key={frequency} value={frequency}>
                  {frequency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-2">AI Metric Intelligence</h3>
        <p className="text-sm text-purple-700">
          Our AI will continuously monitor your selected metrics, identify trends and anomalies, benchmark against
          industry standards, and provide actionable recommendations to improve performance. You can always add or
          modify metrics later.
        </p>
      </div>
    </div>
  )
}
