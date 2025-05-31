"use client"

import { useState, useEffect } from "react"
import { storage } from "@/lib/storage"

export function useStorage() {
  const [storageStats, setStorageStats] = useState({
    available: false,
    used: 0,
    total: 0,
    percentage: 0
  })

  const updateStats = () => {
    const stats = storage.getStorageStats()
    setStorageStats({
      available: stats.available,
      used: stats.used,
      total: stats.total,
      percentage: stats.percentage || 0
    })
  }

  useEffect(() => {
    updateStats()
    
    // Actualizar estadísticas cuando cambie el localStorage
    const handleStorageChange = () => {
      updateStats()
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return {
    storageStats,
    updateStats,
    isStorageAvailable: storageStats.available,
    isStorageFull: storageStats.percentage > 90,
    isStorageNearFull: storageStats.percentage > 80,
  }
}
