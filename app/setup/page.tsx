"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { BusinessInfoStep } from "@/components/setup/business-info-step"
import { BusinessGoalsStep } from "@/components/setup/business-goals-step"
import { MetricsStep } from "@/components/setup/metrics-step"
import { IntegrationsStep } from "@/components/setup/integrations-step"
import { PreferencesStep } from "@/components/setup/preferences-step"
import { ReviewStep } from "@/components/setup/review-step"
import { ProgressManager } from "@/components/setup/progress-manager"
import { UnsavedChangesWarning } from "@/components/setup/unsaved-changes-warning"
import { useAutoSave } from "@/hooks/use-auto-save"

const steps = [
  { id: 1, title: "Business Info", description: "Tell us about your business" },
  { id: 2, title: "Goals & Objectives", description: "Define your business goals" },
  { id: 3, title: "Key Metrics", description: "Set up your success metrics" },
  { id: 4, title: "Integrations", description: "Connect your business tools" },
  { id: 5, title: "AI Preferences", description: "Customize your coaching experience" },
  { id: 6, title: "Review & Launch", description: "Review and complete setup" },
]

export interface SetupData {
  businessInfo: {
    companyName: string
    industry: string
    businessModel: string
    companySize: string
    revenue: string
    description: string
  }
  goals: {
    primaryGoals: string[]
    timeframe: string
    targetRevenue: string
    targetCustomers: string
    challenges: string[]
  }
  metrics: {
    trackingMetrics: string[]
    currentMetrics: Record<string, string>
    reportingFrequency: string
  }
  integrations: {
    selectedIntegrations: string[]
    priorities: string[]
  }
  preferences: {
    coachingStyle: string
    reportingPreference: string
    notificationFrequency: string
    focusAreas: string[]
  }
}

export default function SetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [setupData, setSetupData] = useState<SetupData>({
    businessInfo: {
      companyName: "",
      industry: "",
      businessModel: "",
      companySize: "",
      revenue: "",
      description: "",
    },
    goals: {
      primaryGoals: [],
      timeframe: "",
      targetRevenue: "",
      targetCustomers: "",
      challenges: [],
    },
    metrics: {
      trackingMetrics: [],
      currentMetrics: {},
      reportingFrequency: "",
    },
    integrations: {
      selectedIntegrations: [],
      priorities: [],
    },
    preferences: {
      coachingStyle: "",
      reportingPreference: "",
      notificationFrequency: "",
      focusAreas: [],
    },
  })

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const saveProgress = async () => {
    setIsSaving(true)
    try {
      const progressData = {
        data: setupData,
        step: currentStep,
        completed: completedSteps,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem("business-coach-setup-progress", JSON.stringify(progressData))
      setLastSaved(new Date())
      setHasUnsavedChanges(false)

      // Simulate API call for server-side saving
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Failed to save progress:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-save functionality
  useAutoSave({
    data: setupData,
    onSave: saveProgress,
    delay: 3000,
    enabled: true,
  })

  useEffect(() => {
    loadSavedProgress()
  }, [])

  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [setupData])

  const loadSavedProgress = async () => {
    try {
      const saved = localStorage.getItem("business-coach-setup-progress")
      if (saved) {
        const { data, step, completed, timestamp } = JSON.parse(saved)
        loadProgress(data, step, completed)
        setLastSaved(new Date(timestamp))
      }
    } catch (error) {
      console.error("Failed to load saved progress:", error)
    }
  }

  const clearSavedProgress = () => {
    localStorage.removeItem("business-coach-setup-progress")
    setLastSaved(null)
    setHasUnsavedChanges(false)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  const updateSetupData = (section: keyof SetupData, data: any) => {
    setSetupData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCompletedSteps((prev) => [...prev.filter((s) => s !== currentStep), currentStep])
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || completedSteps.includes(stepId)) {
      setCurrentStep(stepId)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessInfoStep data={setupData.businessInfo} onUpdate={(data) => updateSetupData("businessInfo", data)} />
        )
      case 2:
        return <BusinessGoalsStep data={setupData.goals} onUpdate={(data) => updateSetupData("goals", data)} />
      case 3:
        return <MetricsStep data={setupData.metrics} onUpdate={(data) => updateSetupData("metrics", data)} />
      case 4:
        return (
          <IntegrationsStep data={setupData.integrations} onUpdate={(data) => updateSetupData("integrations", data)} />
        )
      case 5:
        return (
          <PreferencesStep data={setupData.preferences} onUpdate={(data) => updateSetupData("preferences", data)} />
        )
      case 6:
        return <ReviewStep data={setupData} />
      default:
        return null
    }
  }

  const progress = (currentStep / steps.length) * 100

  const loadProgress = (data: SetupData, step: number, completed: number[]) => {
    setSetupData(data)
    setCurrentStep(step)
    setCompletedSteps(completed)
    setHasUnsavedChanges(false)
    setLastSaved(new Date())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Business Coach AI</h1>
          <p className="text-gray-600">Let's set up your personalized business coaching experience</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Progress Saving Status */}
        {(lastSaved || hasUnsavedChanges || isSaving) && (
          <div className="mb-6">
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-600">Saving progress...</span>
                      </>
                    ) : hasUnsavedChanges ? (
                      <>
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Unsaved changes</span>
                      </>
                    ) : lastSaved ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">Progress saved {formatTimeAgo(lastSaved)}</span>
                      </>
                    ) : null}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={saveProgress}
                      disabled={isSaving || !hasUnsavedChanges}
                      className="text-xs"
                    >
                      {isSaving ? "Saving..." : "Save Now"}
                    </Button>
                    {lastSaved && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSavedProgress}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Clear Saved
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(step.id)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    completedSteps.includes(step.id)
                      ? "bg-green-500 border-green-500 text-white cursor-pointer"
                      : step.id === currentStep
                        ? "bg-blue-500 border-blue-500 text-white cursor-pointer"
                        : step.id < currentStep
                          ? "border-gray-300 text-gray-500 cursor-pointer hover:border-gray-400"
                          : "border-gray-200 text-gray-300 cursor-not-allowed"
                  }`}
                  disabled={step.id > currentStep && !completedSteps.includes(step.id)}
                >
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      completedSteps.includes(step.id) || currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className="text-center" style={{ width: "120px" }}>
                <p className="text-xs font-medium text-gray-900">{step.title}</p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              {steps[currentStep - 1].title}: {steps[currentStep - 1].description}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderCurrentStep()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <ProgressManager
              currentData={setupData}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onLoadProgress={loadProgress}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {currentStep} of {steps.length} steps
              </span>
            </div>

            {currentStep === steps.length ? (
              <Button className="bg-green-600 hover:bg-green-700 flex items-center space-x-2">
                <span>Complete Setup</span>
                <CheckCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Unsaved Changes Warning */}
        <UnsavedChangesWarning
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={saveProgress}
          onDiscard={() => setHasUnsavedChanges(false)}
        />
      </div>
    </div>
  )
}
