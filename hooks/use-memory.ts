"use client"

import { useState, useCallback } from "react"
import { memoryManager, type MemoryEntry, type MemoryContext } from "@/lib/memory/memory-manager"

export function useMemory() {
  const [context, setContext] = useState<MemoryContext | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const storeMemory = useCallback(async (entry: Omit<MemoryEntry, "id" | "timestamp">) => {
    try {
      return await memoryManager.store(entry)
    } catch (error) {
      console.error("Failed to store memory:", error)
      throw error
    }
  }, [])

  const retrieveMemories = useCallback((criteria: Parameters<typeof memoryManager.retrieve>[0]) => {
    try {
      return memoryManager.retrieve(criteria)
    } catch (error) {
      console.error("Failed to retrieve memories:", error)
      return []
    }
  }, [])

  const getContext = useCallback(async (sessionId?: string) => {
    setIsLoading(true)
    try {
      const memoryContext = await memoryManager.getConversationContext(sessionId)
      setContext(memoryContext)
      return memoryContext
    } catch (error) {
      console.error("Failed to get context:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchMemories = useCallback((query: string, options?: { limit?: number; types?: MemoryEntry["type"][] }) => {
    try {
      return memoryManager.search(query, options)
    } catch (error) {
      console.error("Failed to search memories:", error)
      return []
    }
  }, [])

  const updateMemory = useCallback(async (id: string, updates: Partial<MemoryEntry>) => {
    try {
      return await memoryManager.update(id, updates)
    } catch (error) {
      console.error("Failed to update memory:", error)
      return false
    }
  }, [])

  const deleteMemory = useCallback(async (id: string) => {
    try {
      return await memoryManager.delete(id)
    } catch (error) {
      console.error("Failed to delete memory:", error)
      return false
    }
  }, [])

  const getStats = useCallback(() => {
    try {
      return memoryManager.getStats()
    } catch (error) {
      console.error("Failed to get stats:", error)
      return {
        totalEntries: 0,
        byType: {},
        byImportance: {},
        storageSize: "0 B",
        oldestEntry: "",
        newestEntry: "",
      }
    }
  }, [])

  const exportMemories = useCallback(() => {
    try {
      return memoryManager.export()
    } catch (error) {
      console.error("Failed to export memories:", error)
      return ""
    }
  }, [])

  const importMemories = useCallback(async (data: string) => {
    try {
      return await memoryManager.import(data)
    } catch (error) {
      console.error("Failed to import memories:", error)
      return false
    }
  }, [])

  return {
    context,
    isLoading,
    storeMemory,
    retrieveMemories,
    getContext,
    searchMemories,
    updateMemory,
    deleteMemory,
    getStats,
    exportMemories,
    importMemories,
  }
}
