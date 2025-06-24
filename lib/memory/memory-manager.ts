"use client"

export interface MemoryEntry {
  id: string
  timestamp: string
  type: "conversation" | "insight" | "task" | "business_data" | "user_preference" | "context"
  category: string
  content: any
  importance: "low" | "medium" | "high" | "critical"
  tags: string[]
  userId?: string
  sessionId?: string
  expiresAt?: string
}

export interface MemoryContext {
  businessInfo: any
  recentConversations: MemoryEntry[]
  userPreferences: any
  keyInsights: MemoryEntry[]
  taskHistory: MemoryEntry[]
  patterns: any
}

export class MemoryManager {
  private static instance: MemoryManager
  private memoryStore: Map<string, MemoryEntry> = new Map()
  private indexStore: Map<string, Set<string>> = new Map()
  private maxMemorySize = 10000 // Maximum number of entries
  private compressionThreshold = 8000 // When to start compressing old memories

  private constructor() {
    this.loadFromLocalStorage()
    this.setupPeriodicSave()
    this.setupMemoryCleanup()
  }

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager()
    }
    return MemoryManager.instance
  }

  // Store a new memory entry
  async store(entry: Omit<MemoryEntry, "id" | "timestamp">): Promise<string> {
    const id = this.generateId()
    const memoryEntry: MemoryEntry = {
      ...entry,
      id,
      timestamp: new Date().toISOString(),
    }

    this.memoryStore.set(id, memoryEntry)
    this.updateIndexes(memoryEntry)

    // Trigger compression if needed
    if (this.memoryStore.size > this.compressionThreshold) {
      await this.compressOldMemories()
    }

    this.saveToLocalStorage()
    return id
  }

  // Retrieve memories by various criteria
  retrieve(criteria: {
    type?: MemoryEntry["type"]
    category?: string
    tags?: string[]
    importance?: MemoryEntry["importance"]
    limit?: number
    since?: string
  }): MemoryEntry[] {
    let results = Array.from(this.memoryStore.values())

    if (criteria.type) {
      results = results.filter((entry) => entry.type === criteria.type)
    }

    if (criteria.category) {
      results = results.filter((entry) => entry.category === criteria.category)
    }

    if (criteria.tags && criteria.tags.length > 0) {
      results = results.filter((entry) => criteria.tags!.some((tag) => entry.tags.includes(tag)))
    }

    if (criteria.importance) {
      results = results.filter((entry) => entry.importance === criteria.importance)
    }

    if (criteria.since) {
      results = results.filter((entry) => entry.timestamp >= criteria.since!)
    }

    // Sort by importance and recency
    results.sort((a, b) => {
      const importanceOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const importanceDiff = importanceOrder[b.importance] - importanceOrder[a.importance]
      if (importanceDiff !== 0) return importanceDiff
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    return results.slice(0, criteria.limit || 100)
  }

  // Get conversation context for AI
  async getConversationContext(sessionId?: string): Promise<MemoryContext> {
    const recentConversations = this.retrieve({
      type: "conversation",
      limit: 20,
      since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
    })

    const keyInsights = this.retrieve({
      type: "insight",
      importance: "high",
      limit: 10,
    })

    const businessInfo =
      this.retrieve({
        type: "business_data",
        category: "profile",
        limit: 1,
      })[0]?.content || {}

    const userPreferences = this.retrieve({
      type: "user_preference",
      limit: 10,
    }).reduce((acc, entry) => ({ ...acc, ...entry.content }), {})

    const taskHistory = this.retrieve({
      type: "task",
      limit: 15,
      since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
    })

    return {
      businessInfo,
      recentConversations,
      userPreferences,
      keyInsights,
      taskHistory,
      patterns: await this.analyzePatterns(),
    }
  }

  // Update existing memory
  async update(id: string, updates: Partial<MemoryEntry>): Promise<boolean> {
    const existing = this.memoryStore.get(id)
    if (!existing) return false

    const updated = { ...existing, ...updates, timestamp: new Date().toISOString() }
    this.memoryStore.set(id, updated)
    this.updateIndexes(updated)
    this.saveToLocalStorage()
    return true
  }

  // Delete memory
  async delete(id: string): Promise<boolean> {
    const deleted = this.memoryStore.delete(id)
    if (deleted) {
      this.removeFromIndexes(id)
      this.saveToLocalStorage()
    }
    return deleted
  }

  // Search memories with text matching
  search(query: string, options: { limit?: number; types?: MemoryEntry["type"][] } = {}): MemoryEntry[] {
    const searchTerms = query.toLowerCase().split(" ")
    let results = Array.from(this.memoryStore.values())

    if (options.types) {
      results = results.filter((entry) => options.types!.includes(entry.type))
    }

    results = results.filter((entry) => {
      const searchableText = JSON.stringify(entry.content).toLowerCase()
      return searchTerms.some(
        (term) => searchableText.includes(term) || entry.tags.some((tag) => tag.toLowerCase().includes(term)),
      )
    })

    results.sort((a, b) => {
      const aRelevance = this.calculateRelevance(a, searchTerms)
      const bRelevance = this.calculateRelevance(b, searchTerms)
      return bRelevance - aRelevance
    })

    return results.slice(0, options.limit || 50)
  }

  // Get memory statistics
  getStats(): {
    totalEntries: number
    byType: Record<string, number>
    byImportance: Record<string, number>
    storageSize: string
    oldestEntry: string
    newestEntry: string
  } {
    const entries = Array.from(this.memoryStore.values())
    const byType: Record<string, number> = {}
    const byImportance: Record<string, number> = {}

    entries.forEach((entry) => {
      byType[entry.type] = (byType[entry.type] || 0) + 1
      byImportance[entry.importance] = (byImportance[entry.importance] || 0) + 1
    })

    const timestamps = entries.map((e) => e.timestamp).sort()

    return {
      totalEntries: entries.length,
      byType,
      byImportance,
      storageSize: this.calculateStorageSize(),
      oldestEntry: timestamps[0] || "",
      newestEntry: timestamps[timestamps.length - 1] || "",
    }
  }

  // Export memories for backup
  export(): string {
    return JSON.stringify({
      memories: Array.from(this.memoryStore.entries()),
      indexes: Array.from(this.indexStore.entries()).map(([key, set]) => [key, Array.from(set)]),
      exportedAt: new Date().toISOString(),
    })
  }

  // Import memories from backup
  async import(data: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(data)

      // Clear existing data
      this.memoryStore.clear()
      this.indexStore.clear()

      // Import memories
      parsed.memories.forEach(([id, entry]: [string, MemoryEntry]) => {
        this.memoryStore.set(id, entry)
      })

      // Rebuild indexes
      this.memoryStore.forEach((entry) => this.updateIndexes(entry))

      this.saveToLocalStorage()
      return true
    } catch (error) {
      console.error("Failed to import memories:", error)
      return false
    }
  }

  // Private methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  }

  private updateIndexes(entry: MemoryEntry): void {
    // Index by type
    if (!this.indexStore.has(entry.type)) {
      this.indexStore.set(entry.type, new Set())
    }
    this.indexStore.get(entry.type)!.add(entry.id)

    // Index by category
    if (!this.indexStore.has(entry.category)) {
      this.indexStore.set(entry.category, new Set())
    }
    this.indexStore.get(entry.category)!.add(entry.id)

    // Index by tags
    entry.tags.forEach((tag) => {
      if (!this.indexStore.has(`tag:${tag}`)) {
        this.indexStore.set(`tag:${tag}`, new Set())
      }
      this.indexStore.get(`tag:${tag}`)!.add(entry.id)
    })
  }

  private removeFromIndexes(id: string): void {
    this.indexStore.forEach((set) => set.delete(id))
  }

  private calculateRelevance(entry: MemoryEntry, searchTerms: string[]): number {
    let relevance = 0
    const content = JSON.stringify(entry.content).toLowerCase()

    searchTerms.forEach((term) => {
      if (content.includes(term)) relevance += 1
      if (entry.tags.some((tag) => tag.toLowerCase().includes(term))) relevance += 2
    })

    // Boost recent and important entries
    const age = Date.now() - new Date(entry.timestamp).getTime()
    const ageFactor = Math.max(0, 1 - age / (30 * 24 * 60 * 60 * 1000)) // Decay over 30 days
    const importanceFactor = { critical: 4, high: 3, medium: 2, low: 1 }[entry.importance]

    return relevance * (1 + ageFactor + importanceFactor * 0.1)
  }

  private async compressOldMemories(): Promise<void> {
    const entries = Array.from(this.memoryStore.values())
    const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago

    const oldEntries = entries.filter(
      (entry) => new Date(entry.timestamp) < cutoffDate && entry.importance !== "critical",
    )

    // Remove least important old entries
    oldEntries
      .sort((a, b) => {
        const importanceOrder = { low: 1, medium: 2, high: 3, critical: 4 }
        return importanceOrder[a.importance] - importanceOrder[b.importance]
      })
      .slice(0, Math.max(0, this.memoryStore.size - this.maxMemorySize))
      .forEach((entry) => this.delete(entry.id))
  }

  private async analyzePatterns(): Promise<any> {
    const conversations = this.retrieve({ type: "conversation", limit: 100 })
    const tasks = this.retrieve({ type: "task", limit: 50 })

    return {
      commonTopics: this.extractCommonTopics(conversations),
      taskPatterns: this.analyzeTaskPatterns(tasks),
      timePatterns: this.analyzeTimePatterns([...conversations, ...tasks]),
      userBehavior: this.analyzeUserBehavior(conversations),
    }
  }

  private extractCommonTopics(conversations: MemoryEntry[]): string[] {
    const topics: Record<string, number> = {}

    conversations.forEach((conv) => {
      conv.tags.forEach((tag) => {
        topics[tag] = (topics[tag] || 0) + 1
      })
    })

    return Object.entries(topics)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([topic]) => topic)
  }

  private analyzeTaskPatterns(tasks: MemoryEntry[]): any {
    const patterns = {
      completionRate: 0,
      averageTimeToComplete: 0,
      commonCategories: [] as string[],
    }

    if (tasks.length === 0) return patterns

    const completed = tasks.filter((task) => task.content.status === "completed")
    patterns.completionRate = completed.length / tasks.length

    const categories: Record<string, number> = {}
    tasks.forEach((task) => {
      const category = task.category
      categories[category] = (categories[category] || 0) + 1
    })

    patterns.commonCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category)

    return patterns
  }

  private analyzeTimePatterns(entries: MemoryEntry[]): any {
    const hourCounts: Record<number, number> = {}
    const dayCounts: Record<number, number> = {}

    entries.forEach((entry) => {
      const date = new Date(entry.timestamp)
      const hour = date.getHours()
      const day = date.getDay()

      hourCounts[hour] = (hourCounts[hour] || 0) + 1
      dayCounts[day] = (dayCounts[day] || 0) + 1
    })

    const peakHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0]?.[0]

    const peakDay = Object.entries(dayCounts).sort(([, a], [, b]) => b - a)[0]?.[0]

    return {
      peakHour: peakHour ? Number.parseInt(peakHour) : null,
      peakDay: peakDay ? Number.parseInt(peakDay) : null,
      activityDistribution: { hourCounts, dayCounts },
    }
  }

  private analyzeUserBehavior(conversations: MemoryEntry[]): any {
    return {
      averageSessionLength: conversations.length > 0 ? conversations.length / 10 : 0,
      preferredTopics: this.extractCommonTopics(conversations).slice(0, 5),
      responsePatterns: "analytical", // This would be more sophisticated in practice
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem("ai-coach-memory")
      if (stored) {
        const data = JSON.parse(stored)

        // Load memories
        if (data.memories) {
          data.memories.forEach(([id, entry]: [string, MemoryEntry]) => {
            this.memoryStore.set(id, entry)
          })
        }

        // Rebuild indexes
        this.memoryStore.forEach((entry) => this.updateIndexes(entry))
      }
    } catch (error) {
      console.error("Failed to load memories from localStorage:", error)
    }
  }

  private saveToLocalStorage(): void {
    try {
      const data = {
        memories: Array.from(this.memoryStore.entries()),
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem("ai-coach-memory", JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save memories to localStorage:", error)
    }
  }

  private setupPeriodicSave(): void {
    // Save every 5 minutes
    setInterval(
      () => {
        this.saveToLocalStorage()
      },
      5 * 60 * 1000,
    )
  }

  private setupMemoryCleanup(): void {
    // Clean up expired memories every hour
    setInterval(
      () => {
        const now = new Date().toISOString()
        const expired = Array.from(this.memoryStore.values()).filter(
          (entry) => entry.expiresAt && entry.expiresAt < now,
        )

        expired.forEach((entry) => this.delete(entry.id))
      },
      60 * 60 * 1000,
    )
  }

  private calculateStorageSize(): string {
    const data = JSON.stringify(Array.from(this.memoryStore.entries()))
    const bytes = new Blob([data]).size

    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
}

export const memoryManager = MemoryManager.getInstance()
