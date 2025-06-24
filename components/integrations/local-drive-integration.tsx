"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { HardDrive, Folder, FileText, Shield, Zap, AlertTriangle, CheckCircle } from "lucide-react"

interface LocalDriveIntegrationProps {
  connected: boolean
  onToggle: () => void
}

export function LocalDriveIntegration({ connected, onToggle }: LocalDriveIntegrationProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])

  const handleConnect = async () => {
    if (connected) {
      onToggle()
      return
    }

    setIsConnecting(true)

    // Simulate connection process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setScanProgress(i)
    }

    setIsConnecting(false)
    onToggle()
  }

  const folders = [
    { name: "Documents", path: "/Documents", files: 245, size: "1.2 GB" },
    { name: "Downloads", path: "/Downloads", files: 89, size: "3.4 GB" },
    { name: "Desktop", path: "/Desktop", files: 34, size: "456 MB" },
    { name: "Business Files", path: "/Business", files: 156, size: "2.1 GB" },
  ]

  const toggleFolder = (folderPath: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderPath) ? prev.filter((p) => p !== folderPath) : [...prev, folderPath],
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HardDrive className="w-5 h-5 text-blue-600" />
          <span className="font-medium">Local Drive Access</span>
        </div>
        <Switch checked={connected} onCheckedChange={handleConnect} disabled={isConnecting} />
      </div>

      <p className="text-sm text-gray-600">
        Access and analyze files directly from your computer for instant business insights.
      </p>

      {isConnecting && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-blue-600">Scanning local drive...</span>
          </div>
          <Progress value={scanProgress} className="h-2" />
        </div>
      )}

      {connected && (
        <div className="space-y-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Connected to Local Drive</span>
            </div>
            <p className="text-xs text-green-700 mt-1">AI can now access and analyze files from selected folders</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Select Folders to Monitor</h4>
            {folders.map((folder) => (
              <div
                key={folder.path}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedFolders.includes(folder.path)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleFolder(folder.path)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Folder
                      className={`w-4 h-4 ${selectedFolders.includes(folder.path) ? "text-blue-600" : "text-gray-500"}`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{folder.name}</p>
                      <p className="text-xs text-gray-500">
                        {folder.files} files • {folder.size}
                      </p>
                    </div>
                  </div>
                  {selectedFolders.includes(folder.path) && <CheckCircle className="w-4 h-4 text-blue-600" />}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Privacy Protected</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Files are analyzed locally. No data leaves your device without permission.
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded border border-purple-200">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Real-time Analysis</span>
              </div>
              <p className="text-xs text-purple-700 mt-1">
                Get instant insights as you create and modify business documents.
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Scan Now
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Configure
            </Button>
          </div>
        </div>
      )}

      {!connected && (
        <div className="space-y-3">
          <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Permission Required</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Enable local drive access to analyze your business files with AI.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Features Available:</h4>
            <ul className="space-y-1">
              {[
                "Document content analysis",
                "Financial data extraction",
                "Trend identification",
                "Automated insights generation",
              ].map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
