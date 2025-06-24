"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Search,
  Download,
  Upload,
  Trash2,
  BarChart3,
  Clock,
  Tag,
  MessageSquare,
  Lightbulb,
  CheckSquare,
  Database,
  Settings,
  Eye,
} from "lucide-react"
import { useMemory } from "@/hooks/use-memory"
import type { MemoryEntry } from "@/lib/memory/memory-manager"

export function MemoryDashboard() {
  const {
    isLoading,
    context,
    retrieveMemories,
    searchMemories,
    getContext,
    deleteMemory,
    getStats,
    exportMemories,
    importMemories,
  } = useMemory()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<MemoryEntry[]>([])
  const [selectedMemory, setSelectedMemory] = useState<MemoryEntry | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [filterType, setFilterType] = useState<string>("all")

  useEffect(() => {
    loadStats()
    loadContext()
  }, [])

  const loadStats = () => {
    const memoryStats = getStats()
    setStats(memoryStats)
  }

  const loadContext = async () => {
    await getContext()
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const results = searchMemories(searchQuery, {
      limit: 50,
      types: filterType !== "all" ? [filterType as any] : undefined,
    })
    setSearchResults(results)
  }

  const handleExport = () => {
    const data = exportMemories()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-coach-memory-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = e.target?.result as string
      const success = await importMemories(data)
      if (success) {
        loadStats()
        loadContext()
        alert("Memory imported successfully!")
      } else {
        alert("Failed to import memory data")
      }
    }
    reader.readAsText(file)
  }

  const handleDeleteMemory = async (id: string) => {
    if (confirm("Are you sure you want to delete this memory?")) {
      await deleteMemory(id)
      loadStats()
      if (selectedMemory?.id === id) {
        setSelectedMemory(null)
      }
      // Refresh search results if showing
      if (searchResults.length > 0) {
        handleSearch()
      }
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "conversation":
        return MessageSquare
      case "insight":
        return Lightbulb
      case "task":
        return CheckSquare
      case "business_data":
        return Database
      case "user_preference":
        return Settings
      default:
        return Brain
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "medium":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Memory Dashboard</h1>
          <p className="text-gray-600">Manage and explore your AI assistant's persistent memory</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="search">Search & Browse</TabsTrigger>
            <TabsTrigger value="context">Current Context</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {stats && (
              <>
                {/* Memory Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Memories</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
                        </div>
                        <Brain className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Storage Used</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.storageSize}</p>
                        </div>
                        <Database className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Critical Memories</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.byImportance.critical || 0}</p>
                        </div>
                        <Lightbulb className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Conversations</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.byType.conversation || 0}</p>
                        </div>
                        <MessageSquare className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Memory Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <span>Memory Types</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(stats.byType).map(([type, count]) => {
                          const Icon = getTypeIcon(type)
                          const percentage = ((count as number) / stats.totalEntries) * 100
                          return (
                            <div key={type} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Icon className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium capitalize">{type.replace("_", " ")}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="text-sm text-gray-600">{count}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Tag className="h-5 w-5 text-green-600" />
                        <span>Importance Levels</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(stats.byImportance).map(([importance, count]) => {
                          const percentage = ((count as number) / stats.totalEntries) * 100
                          return (
                            <div key={importance} className="flex items-center justify-between">
                              <Badge className={getImportanceColor(importance)}>{importance}</Badge>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="text-sm text-gray-600">{count}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Memory Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <span>Memory Timeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm font-medium text-blue-800">Oldest Memory</p>
                        <p className="text-xs text-blue-600">
                          {stats.oldestEntry ? formatDate(stats.oldestEntry) : "No memories yet"}
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded border border-green-200">
                        <p className="text-sm font-medium text-green-800">Latest Memory</p>
                        <p className="text-xs text-green-600">
                          {stats.newestEntry ? formatDate(stats.newestEntry) : "No memories yet"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Search & Browse Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  <span>Search Memories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-4">
                  <div className="flex-1">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search memories..."
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Types</option>
                    <option value="conversation">Conversations</option>
                    <option value="insight">Insights</option>
                    <option value="task">Tasks</option>
                    <option value="business_data">Business Data</option>
                    <option value="user_preference">Preferences</option>
                  </select>
                  <Button onClick={handleSearch} disabled={isLoading}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Search Results */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Search Results ({searchResults.length})</h3>
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {searchResults.map((memory) => {
                          const Icon = getTypeIcon(memory.type)
                          return (
                            <div
                              key={memory.id}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedMemory?.id === memory.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                              }`}
                              onClick={() => setSelectedMemory(memory)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-2 flex-1">
                                  <Icon className="h-4 w-4 text-gray-500 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <Badge className={getImportanceColor(memory.importance)}>
                                        {memory.importance}
                                      </Badge>
                                      <span className="text-xs text-gray-500">{memory.category}</span>
                                    </div>
                                    <p className="text-sm text-gray-900 truncate">
                                      {typeof memory.content === "string"
                                        ? memory.content
                                        : JSON.stringify(memory.content).substring(0, 100) + "..."}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{formatDate(memory.timestamp)}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteMemory(memory.id)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Memory Details */}
                    <div>
                      {selectedMemory ? (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Eye className="h-5 w-5 text-green-600" />
                              <span>Memory Details</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Type</p>
                                  <p className="text-sm text-gray-900 capitalize">
                                    {selectedMemory.type.replace("_", " ")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Category</p>
                                  <p className="text-sm text-gray-900">{selectedMemory.category}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Importance</p>
                                  <Badge className={getImportanceColor(selectedMemory.importance)}>
                                    {selectedMemory.importance}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Created</p>
                                  <p className="text-sm text-gray-900">{formatDate(selectedMemory.timestamp)}</p>
                                </div>
                              </div>

                              {selectedMemory.tags.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-600 mb-2">Tags</p>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedMemory.tags.map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div>
                                <p className="text-sm font-medium text-gray-600 mb-2">Content</p>
                                <div className="p-3 bg-gray-50 rounded border max-h-40 overflow-y-auto">
                                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                    {typeof selectedMemory.content === "string"
                                      ? selectedMemory.content
                                      : JSON.stringify(selectedMemory.content, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>Select a memory to view details</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Current Context Tab */}
          <TabsContent value="context" className="space-y-6">
            {context && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Conversations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {context.recentConversations.map((conv) => (
                        <div key={conv.id} className="p-2 border rounded text-sm">
                          <p className="text-gray-900 truncate">
                            {typeof conv.content === "string"
                              ? conv.content
                              : JSON.stringify(conv.content).substring(0, 100) + "..."}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(conv.timestamp)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {context.keyInsights.map((insight) => (
                        <div key={insight.id} className="p-2 border rounded text-sm">
                          <p className="text-gray-900 truncate">
                            {typeof insight.content === "string"
                              ? insight.content
                              : JSON.stringify(insight.content).substring(0, 100) + "..."}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(insight.timestamp)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(context.businessInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}:
                          </span>
                          <span className="text-sm text-gray-900">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Behavioral Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {context.patterns.commonTopics && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Common Topics</p>
                          <div className="flex flex-wrap gap-1">
                            {context.patterns.commonTopics.map((topic: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {context.patterns.timePatterns && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Activity Patterns</p>
                          <div className="text-sm text-gray-700">
                            {context.patterns.timePatterns.peakHour && (
                              <p>Peak Hour: {context.patterns.timePatterns.peakHour}:00</p>
                            )}
                            {context.patterns.timePatterns.peakDay !== null && (
                              <p>
                                Most Active Day:{" "}
                                {
                                  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
                                    context.patterns.timePatterns.peakDay
                                  ]
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span>Memory Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <Button onClick={handleExport} className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Export Memory</span>
                    </Button>

                    <div>
                      <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-memory" />
                      <label htmlFor="import-memory">
                        <Button asChild className="flex items-center space-x-2">
                          <span>
                            <Upload className="h-4 w-4" />
                            <span>Import Memory</span>
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
                    <h3 className="font-semibold text-yellow-800 mb-2">Memory Storage</h3>
                    <p className="text-sm text-yellow-700 mb-3">
                      Your AI's memory is stored locally in your browser. Export regularly to prevent data loss.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm text-yellow-700">
                        <strong>Storage Location:</strong> Browser Local Storage
                      </p>
                      <p className="text-sm text-yellow-700">
                        <strong>Auto-Save:</strong> Every 5 minutes
                      </p>
                      <p className="text-sm text-yellow-700">
                        <strong>Cleanup:</strong> Automatic (old, low-importance memories)
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">Privacy & Security</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• All memories are stored locally on your device</li>
                      <li>• No data is sent to external servers without your permission</li>
                      <li>• You have full control over your memory data</li>
                      <li>• Export/import allows you to backup and transfer memories</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
