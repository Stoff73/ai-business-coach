"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Users, DollarSign, Briefcase } from "lucide-react"

interface BusinessInfoStepProps {
  data: {
    companyName: string
    industry: string
    businessModel: string
    companySize: string
    revenue: string
    description: string
  }
  onUpdate: (data: any) => void
}

const industries = [
  "Technology",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Real Estate",
  "Food & Beverage",
  "Other",
]

const businessModels = [
  "B2B SaaS",
  "B2C E-commerce",
  "Marketplace",
  "Subscription",
  "Consulting Services",
  "Product Sales",
  "Advertising",
  "Freemium",
  "Other",
]

const companySizes = [
  "Solo (1 person)",
  "Small (2-10 people)",
  "Medium (11-50 people)",
  "Large (51-200 people)",
  "Enterprise (200+ people)",
]

const revenueRanges = [
  "Pre-revenue",
  "$0 - $10K/month",
  "$10K - $50K/month",
  "$50K - $100K/month",
  "$100K - $500K/month",
  "$500K - $1M/month",
  "$1M+/month",
]

export function BusinessInfoStep({ data, onUpdate }: BusinessInfoStepProps) {
  const handleChange = (field: string, value: string) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>Company Name *</span>
          </Label>
          <Input
            id="companyName"
            value={data.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder="Enter your company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4" />
            <span>Industry *</span>
          </Label>
          <Select value={data.industry} onValueChange={(value) => handleChange("industry", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessModel">Business Model *</Label>
          <Select value={data.businessModel} onValueChange={(value) => handleChange("businessModel", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your business model" />
            </SelectTrigger>
            <SelectContent>
              {businessModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companySize" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Company Size *</span>
          </Label>
          <Select value={data.companySize} onValueChange={(value) => handleChange("companySize", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {companySizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="revenue" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Monthly Revenue Range *</span>
          </Label>
          <Select value={data.revenue} onValueChange={(value) => handleChange("revenue", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select revenue range" />
            </SelectTrigger>
            <SelectContent>
              {revenueRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Business Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Briefly describe your business, products/services, and target market..."
          rows={4}
        />
        <p className="text-xs text-gray-500">
          This helps our AI understand your business context and provide more relevant insights.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Why we need this information</h3>
        <p className="text-sm text-blue-700">
          Your business information helps our AI coach understand your industry context, scale challenges, and provide
          tailored strategic recommendations that are relevant to your specific situation.
        </p>
      </div>
    </div>
  )
}
