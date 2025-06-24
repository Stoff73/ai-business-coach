"use client"

import { useEffect, useRef, useCallback } from "react"

interface UseAutoSaveOptions {
  data: any
  onSave: () => Promise<void>
  delay?: number
  enabled?: boolean
}

export function useAutoSave({ data, onSave, delay = 3000, enabled = true }: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const previousDataRef = useRef<string>()

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      const currentDataString = JSON.stringify(data)
      if (currentDataString !== previousDataRef.current && enabled) {
        onSave()
        previousDataRef.current = currentDataString
      }
    }, delay)
  }, [data, onSave, delay, enabled])

  useEffect(() => {
    if (enabled) {
      debouncedSave()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [debouncedSave, enabled])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
}
