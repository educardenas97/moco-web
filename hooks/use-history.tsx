/**
 * Hook personalizado para gestionar el historial de consultas tributarias
 * Maneja la persistencia en localStorage, validación de datos y funciones CRUD
 */
"use client"

import { useState, useEffect } from "react"
import type { HistoryItem } from "@/types"
import { storage } from "@/lib/storage"

const STORAGE_KEY = "legal-query-history"
const MAX_HISTORY_ITEMS = 50 // Limitar el número de elementos en el historial

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar historial desde localStorage al inicializar el componente
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = storage.getItem<HistoryItem[]>(STORAGE_KEY, [])
        if (savedHistory && Array.isArray(savedHistory)) {
          // Validar que los elementos tengan la estructura correcta
          const validHistory = savedHistory.filter(item => 
            item.id && 
            item.query && 
            item.response && 
            item.timestamp && 
            typeof item.timestamp === 'number'
          )
          setHistory(validHistory.slice(0, MAX_HISTORY_ITEMS))
        }
      } catch (error) {
        console.error("Failed to parse history from localStorage:", error)
        // Limpiar localStorage si hay datos corruptos
        storage.removeItem(STORAGE_KEY)
      } finally {
        setIsLoaded(true)
      }
    }

    loadHistory()
  }, [])

  // Guardar historial en localStorage cada vez que cambie (solo si ya se cargó)
  useEffect(() => {
    if (isLoaded) {
      if (history.length > 0) {
        const success = storage.setItem(STORAGE_KEY, history)
        if (!success) {
          console.warn('No se pudo guardar el historial - posible problema de espacio')
        }
      } else {
        // Si no hay historial, remover de localStorage
        storage.removeItem(STORAGE_KEY)
      }
    }
  }, [history, isLoaded])

  // Respaldo automático cada 10 elementos nuevos
  useEffect(() => {
    if (history.length > 0 && history.length % 10 === 0) {
      try {
        const backupKey = `${STORAGE_KEY}_backup_${Date.now()}`
        storage.setItem(backupKey, history.slice(0, 20)) // Solo los últimos 20
        
        // Limpiar backups antiguos (mantener solo los últimos 3)
        const allKeys = Object.keys(localStorage)
        const backupKeys = allKeys
          .filter(key => key.startsWith(`${STORAGE_KEY}_backup_`))
          .sort()
          .reverse()
        
        if (backupKeys.length > 3) {
          backupKeys.slice(3).forEach(key => localStorage.removeItem(key))
        }
      } catch (error) {
        console.warn('No se pudo crear respaldo automático:', error)
      }
    }
  }, [history.length])

  /**
   * Agrega una nueva consulta al historial
   * @param query - La consulta del usuario
   * @param response - La respuesta del sistema
   */
  const addToHistory = (query: string, response: any) => {
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID más único
      query: query.trim(),
      response,
      timestamp: Date.now(),
    }

    setHistory((prev) => {
      // Evitar duplicados basados en la consulta
      const filtered = prev.filter(item => 
        item.query.toLowerCase() !== query.toLowerCase().trim()
      )
      // Mantener solo los últimos MAX_HISTORY_ITEMS elementos
      const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      return newHistory
    })
  }

  /**
   * Elimina un elemento específico del historial
   * @param id - ID del elemento a eliminar
   */
  /**
   * Elimina un elemento específico del historial
   * @param id - ID del elemento a eliminar
   */
  const removeFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  /**
   * Limpia todo el historial
   */
  const clearHistory = () => {
    setHistory([])
  }

  /**
   * Obtiene estadísticas del historial
   * @returns Objeto con información estadística del historial
   */
  const getHistoryStats = () => ({
    total: history.length,
    isLoaded,
    lastQuery: history[0]?.timestamp ? new Date(history[0].timestamp) : null,
  })

  /**
   * Exporta el historial como archivo JSON
   * Genera un archivo descargable con todo el historial
   */
  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `historial-consultas-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryStats,
    exportHistory,
    isLoaded,
  }
}
