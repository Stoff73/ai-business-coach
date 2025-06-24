"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

interface UnsavedChangesWarningProps {
  hasUnsavedChanges: boolean
  onSave: () => Promise<void>
  onDiscard: () => void
}

export function UnsavedChangesWarning({ hasUnsavedChanges, onSave, onDiscard }: UnsavedChangesWarningProps) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  if (!hasUnsavedChanges) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-orange-900">Unsaved Changes</h3>
            <p className="text-xs text-orange-700 mt-1">
              Your progress will be automatically saved, or you can save manually.
            </p>
            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={onSave}
                className="text-xs bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
              >
                Save Now
              </button>
              <button onClick={onDiscard} className="text-xs text-orange-600 hover:text-orange-700">
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
