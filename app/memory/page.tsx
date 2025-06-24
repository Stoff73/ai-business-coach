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
  MessageSquare,
  Lightbulb,
  Target,
  Settings,
} from "lucide-react"
import { useMemory } from "@/hooks/use-memory"

export default function MemoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const {
    context,
    retrieveMemories,
    searchMemories,
    deleteMemory,
    getStats,
    exportMemories,
    importMemories,
    getContext,
  } = useMemory()

  const [memories, setMemories] = useState<any[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    await getContext()
    const allMemories = retrieveMemories({ limit: 100 })
    setMemories(allMemories)
    setStats(getStats())
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = searchMemories(searchQuery, { limit: 50 })
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleExport = () => {
    const data = exportMemories()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-coach-memories-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const data = e.target?.result as string
        const success = await importMemories(data)
        if (success) {
          loadData()
          alert("Memories imported successfully!")
        } else {
          alert("Failed to import memories")
        }
      }
      reader.readAsText(file)
    }
  }

  const filteredMemories = selectedType === "all" ? memories : memories.filter((m) => m.type === selectedType)

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "conversation":
        return MessageSquare
      case "insight":
        return Lightbulb
      case "task":
        return Target
      case "business_data":
        return BarChart3
      case "user_preference":
        return Settings
      default:
        return Brain
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Memory Dashboard</h1>
          <p className="text-gray-600">Manage your AI coach's persistent memory and insights</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Memories</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalEntries || 0}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversations</p>
                  <p className="text-2xl font-bold text-green-600">{stats.byType?.conversation || 0}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Insights</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.byType?.insight || 0}</p>
                </div>
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Storage Size</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.storageSize || "0 B"}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Memories</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Memory Browser</CardTitle>
                <div className="flex space-x-2">
                  {["all", "conversation", "insight", "task", "business_data", "user_preference"].map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                    >
                      {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredMemories.map((memory) => {
                    const Icon = getTypeIcon(memory.type)
                    return (
                      <div key={memory.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Icon className="w-5 h-5 text-gray-500 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="secondary">{memory.type}</Badge>
                                <Badge variant="outline">{memory.importance}</Badge>
                                <span className="text-xs text-gray-500">{formatDate(memory.timestamp)}</span>
                              </div>
                              <p className="text-sm text-gray-900 mb-2">
                                {typeof memory.content === "string"
                                  ? memory.content.slice(0, 200)
                                  : JSON.stringify(memory.content).slice(0, 200)}
                                ...
                              </p>
                              {memory.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {memory.tags.map((tag: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMemory(memory.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Memories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  <Input
                    placeholder="Search memories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Search Results ({searchResults.length})</h3>
                    {searchResults.map((memory) => {
                      const Icon = getTypeIcon(memory.type)
                      return (
                        <div key={memory.id} className="p-4 border rounded-lg">
                          <div className="flex items-start space-x-3">
                            <Icon className="w-5 h-5 text-gray-500 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="secondary">{memory.type}</Badge>
                                <span className="text-xs text-gray-500">{formatDate(memory.timestamp)}</span>
                              </div>
                              <p className="text-sm text-gray-900">
                                {typeof memory.content === "string" ? memory.content : JSON.stringify(memory.content)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Memory Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Button onClick={handleExport} className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export Memories</span>
                  </Button>

                  <div>
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-file" />
                    <Button asChild className="flex items-center space-x-2">
                      <label htmlFor="import-file">
                        <Upload className="w-4 h-4" />
                        <span>Import Memories</span>
                      </label>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Memory Statistics</h3>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p>Total Entries: {stats.totalEntries}</p>
                      <p>Storage Size: {stats.storageSize}</p>
                      {stats.oldestEntry && <p>Oldest: {formatDate(stats.oldestEntry)}</p>}
                      {stats.newestEntry && <p>Newest: {formatDate(stats.newestEntry)}</p>}
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Memory Health</h3>
                    <div className="space-y-1 text-sm text-green-700">
                      <p>System: Active</p>
                      <p>Auto-save: Enabled</p>
                      <p>Compression: Automatic</p>
                      <p>Privacy: Local Storage</p>
                    </div>
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
