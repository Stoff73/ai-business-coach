"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Save, Clock, Trash2, Download, Upload, CheckCircle } from "lucide-react"
import type { SetupData } from "@/app/setup/page"

interface SavedProgress {
  id: string
  name: string
  data: SetupData
  step: number
  completed: number[]
  timestamp: string
  completionPercentage: number
}

interface ProgressManagerProps {
  currentData: SetupData
  currentStep: number
  completedSteps: number[]
  onLoadProgress: (data: SetupData, step: number, completed: number[]) => void
}

export function ProgressManager({ currentData, currentStep, completedSteps, onLoadProgress }: ProgressManagerProps) {
  const [savedProgresses, setSavedProgresses] = useState<SavedProgress[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [saveName, setSaveName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSavedProgresses()
  }, [])

  const loadSavedProgresses = () => {
    try {
      const saved = localStorage.getItem("business-coach-saved-progresses")
      if (saved) {
        setSavedProgresses(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to load saved progresses:", error)
    }
  }

  const saveCurrentProgress = async () => {
    if (!saveName.trim()) return

    setIsSaving(true)
    try {
      const completionPercentage = Math.round((completedSteps.length / 6) * 100)

      const newProgress: SavedProgress = {
        id: Date.now().toString(),
        name: saveName.trim(),
        data: currentData,
        step: currentStep,
        completed: completedSteps,
        timestamp: new Date().toISOString(),
        completionPercentage,
      }

      const updatedProgresses = [...savedProgresses, newProgress]
      localStorage.setItem("business-coach-saved-progresses", JSON.stringify(updatedProgresses))
      setSavedProgresses(updatedProgresses)
      setSaveName("")
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to save progress:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const loadProgress = (progress: SavedProgress) => {
    onLoadProgress(progress.data, progress.step, progress.completed)
    setIsOpen(false)
  }

  const deleteProgress = (id: string) => {
    const updatedProgresses = savedProgresses.filter((p) => p.id !== id)
    localStorage.setItem("business-coach-saved-progresses", JSON.stringify(updatedProgresses))
    setSavedProgresses(updatedProgresses)
  }

  const exportProgress = (progress: SavedProgress) => {
    const dataStr = JSON.stringify(progress, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `business-coach-setup-${progress.name.replace(/\s+/g, "-").toLowerCase()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="flex items-center space-x-2">
        <Save className="w-4 h-4" />
        <span>Manage Progress</span>
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Manage Setup Progress</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Save your current progress or load a previously saved setup configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-6">
            {/* Save Current Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Save Current Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="Enter a name for this save..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={saveCurrentProgress}
                    disabled={!saveName.trim() || isSaving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSaving ? "Saving..." : "Save Progress"}
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  Current progress: Step {currentStep} of 6 ({Math.round((completedSteps.length / 6) * 100)}% complete)
                </div>
              </CardContent>
            </Card>

            {/* Saved Progresses */}
            {savedProgresses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Saved Progresses ({savedProgresses.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {savedProgresses.map((progress) => (
                      <div
                        key={progress.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{progress.name}</h3>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                progress.completionPercentage === 100
                                  ? "bg-green-100 text-green-700"
                                  : progress.completionPercentage >= 50
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {progress.completionPercentage}% Complete
                            </Badge>
                            {progress.completionPercentage === 100 && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Step {progress.step} of 6</span>
                            <span>•</span>
                            <span>{formatDate(progress.timestamp)}</span>
                            <span>•</span>
                            <span>{progress.data.businessInfo.companyName || "Unnamed Company"}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadProgress(progress)}
                            className="flex items-center space-x-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Load</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportProgress(progress)}
                            className="flex items-center space-x-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Export</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Saved Progress</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{progress.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteProgress(progress.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {savedProgresses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No saved progress found</p>
                <p className="text-sm">Save your current progress to continue later</p>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
