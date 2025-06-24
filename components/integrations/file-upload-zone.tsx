"use client"

import React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  X,
  Eye,
  Download,
  BarChart3,
  Brain,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadProgress: number
  analysisStatus: "pending" | "analyzing" | "completed" | "error"
  insights?: {
    summary: string
    keyPoints: string[]
    recommendations: string[]
    dataExtracted?: any
  }
}

const supportedFileTypes = {
  documents: [".pdf", ".doc", ".docx", ".txt", ".csv", ".xlsx", ".pptx"],
  images: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"],
  videos: [".mp4", ".avi", ".mov", ".wmv", ".flv"],
  audio: [".mp3", ".wav", ".aac", ".flac"],
  archives: [".zip", ".rar", ".7z", ".tar"],
}

export function FileUploadZone() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }, [])

  const handleFiles = async (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      analysisStatus: "pending",
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Simulate upload and analysis
    for (const file of newFiles) {
      await simulateUpload(file.id)
      await simulateAnalysis(file.id)
    }
  }

  const simulateUpload = async (fileId: string) => {
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setUploadedFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, uploadProgress: progress } : file)),
      )
    }
  }

  const simulateAnalysis = async (fileId: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) => (file.id === fileId ? { ...file, analysisStatus: "analyzing" } : file)),
    )

    // Simulate analysis time
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockInsights = {
      summary: "This document contains important business metrics and financial data for Q4 analysis.",
      keyPoints: [
        "Revenue increased by 15% compared to previous quarter",
        "Customer acquisition cost decreased by 8%",
        "Monthly recurring revenue shows strong growth trend",
        "Operational efficiency improved across all departments",
      ],
      recommendations: [
        "Focus marketing spend on high-performing channels",
        "Implement customer retention strategies",
        "Scale successful operational processes",
        "Consider expanding to new market segments",
      ],
      dataExtracted: {
        revenue: "$124,500",
        customers: "2,847",
        conversionRate: "3.24%",
        growthRate: "18.7%",
      },
    }

    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, analysisStatus: "completed", insights: mockInsights } : file,
      ),
    )
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
    if (selectedFile?.id === fileId) {
      setSelectedFile(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split(".").pop()
    if (supportedFileTypes.documents.some((ext) => ext.includes(extension || ""))) return FileText
    if (supportedFileTypes.images.some((ext) => ext.includes(extension || ""))) return ImageIcon
    if (supportedFileTypes.videos.some((ext) => ext.includes(extension || ""))) return Video
    if (supportedFileTypes.audio.some((ext) => ext.includes(extension || ""))) return Music
    if (supportedFileTypes.archives.some((ext) => ext.includes(extension || ""))) return Archive
    return FileText
  }

  const getStatusIcon = (status: UploadedFile["analysisStatus"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-gray-500" />
      case "analyzing":
        return <Brain className="w-4 h-4 text-blue-500 animate-pulse" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <span>AI File Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Files for AI Analysis</h3>
            <p className="text-gray-600 mb-4">Drag and drop files here, or click to select files from your computer</p>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
            />
            <label htmlFor="file-upload">
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <span>Choose Files</span>
              </Button>
            </label>
            <div className="mt-4 text-sm text-gray-500">
              <p>Supported formats:</p>
              <p>Documents: PDF, Word, Excel, PowerPoint, CSV, TXT</p>
              <p>Media: Images, Videos, Audio files</p>
              <p>Maximum file size: 100MB per file</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Uploaded Files ({uploadedFiles.length})</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUploadedFiles([])}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {uploadedFiles.map((file) => {
                  const FileIcon = getFileIcon(file.name)
                  return (
                    <div
                      key={file.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedFile?.id === file.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(file.analysisStatus)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFile(file.id)
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {file.uploadProgress < 100 && (
                        <div className="mt-2">
                          <Progress value={file.uploadProgress} className="h-1" />
                        </div>
                      )}

                      {file.analysisStatus === "analyzing" && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-blue-600">Analyzing with AI...</span>
                          </div>
                        </div>
                      )}

                      {file.analysisStatus === "completed" && (
                        <div className="mt-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            Analysis Complete
                          </Badge>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* File Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span>AI Analysis Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {React.createElement(getFileIcon(selectedFile.name), {
                      className: "w-6 h-6 text-gray-500",
                    })}
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>

                  {selectedFile.analysisStatus === "completed" && selectedFile.insights ? (
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="insights">Key Points</TabsTrigger>
                        <TabsTrigger value="recommendations">Actions</TabsTrigger>
                      </TabsList>

                      <TabsContent value="summary" className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">AI Summary</h4>
                          <p className="text-sm text-gray-700">{selectedFile.insights.summary}</p>
                        </div>
                        {selectedFile.insights.dataExtracted && (
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(selectedFile.insights.dataExtracted).map(([key, value]) => (
                              <div key={key} className="p-2 bg-blue-50 rounded border border-blue-200">
                                <p className="text-xs text-blue-600 font-medium">
                                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                </p>
                                <p className="text-sm font-semibold text-blue-900">{value as string}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="insights" className="space-y-3">
                        <h4 className="font-medium text-gray-900">Key Insights</h4>
                        <ul className="space-y-2">
                          {selectedFile.insights.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>

                      <TabsContent value="recommendations" className="space-y-3">
                        <h4 className="font-medium text-gray-900">AI Recommendations</h4>
                        <div className="space-y-2">
                          {selectedFile.insights.recommendations.map((rec, index) => (
                            <div key={index} className="p-3 bg-green-50 rounded border border-green-200">
                              <p className="text-sm text-green-800">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : selectedFile.analysisStatus === "analyzing" ? (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
                      <p className="text-gray-600">AI is analyzing your file...</p>
                      <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
                    </div>
                  ) : selectedFile.analysisStatus === "pending" ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">File uploaded, waiting for analysis...</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                      <p className="text-red-600">Analysis failed</p>
                      <p className="text-sm text-gray-500 mt-1">Please try uploading the file again</p>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Export Analysis
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a file to view analysis results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Analysis Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Analysis Capabilities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <FileText className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Document Analysis</h3>
              <p className="text-sm text-blue-700">
                Extract key insights, data points, and actionable recommendations from business documents.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <BarChart3 className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-green-900 mb-2">Data Extraction</h3>
              <p className="text-sm text-green-700">
                Automatically identify and extract metrics, KPIs, and financial data from spreadsheets and reports.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <ImageIcon className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-purple-900 mb-2">Visual Analysis</h3>
              <p className="text-sm text-purple-700">
                Analyze charts, graphs, and visual content to understand trends and patterns in your business data.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Brain className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-orange-900 mb-2">Smart Insights</h3>
              <p className="text-sm text-orange-700">
                Generate strategic recommendations and identify opportunities based on analyzed content.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
