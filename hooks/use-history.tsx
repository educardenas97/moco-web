"use client"

import { useState, useEffect } from "react"
import type { HistoryItem } from "@/types"

const STORAGE_KEY = "legal-query-history"

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  // Load history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY)
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Failed to parse history from localStorage:", error)
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  // Add a new item to history
  const addToHistory = (query: string, response: any) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      query,
      response,
      timestamp: Date.now(),
    }

    setHistory((prev) => [newItem, ...prev])
  }

  // Remove an item from history
  const removeFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  // Clear all history
  const clearHistory = () => {
    setHistory([])
  }

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  }
}
