/**
 * Utilidades para manejo seguro de localStorage
 * Incluye compresión de datos y manejo de errores
 */

export class StorageManager {
  private static instance: StorageManager
  private readonly maxSizeBytes = 5 * 1024 * 1024 // 5MB límite recomendado para localStorage

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  /**
   * Verifica si localStorage está disponible
   */
  isAvailable(): boolean {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  /**
   * Obtiene un valor del localStorage con manejo seguro
   */
  getItem<T>(key: string, defaultValue: T | null = null): T | null {
    if (!this.isAvailable()) {
      console.warn('localStorage no está disponible')
      return defaultValue
    }

    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue
      
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Error al leer ${key} de localStorage:`, error)
      return defaultValue
    }
  }

  /**
   * Guarda un valor en localStorage con manejo seguro
   */
  setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage no está disponible')
      return false
    }

    try {
      const serialized = JSON.stringify(value)
      
      // Verificar tamaño antes de guardar
      if (this.getDataSize(serialized) > this.maxSizeBytes) {
        console.warn(`Datos demasiado grandes para localStorage: ${key}`)
        return false
      }

      localStorage.setItem(key, serialized)
      return true
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error)
      
      // Si es un error de cuota, intentar limpiar datos antiguos
      if (error instanceof DOMException && error.code === 22) {
        this.cleanup()
        try {
          localStorage.setItem(key, JSON.stringify(value))
          return true
        } catch {
          console.error('No se pudo guardar después de la limpieza')
          return false
        }
      }
      return false
    }
  }

  /**
   * Elimina un elemento del localStorage
   */
  removeItem(key: string): boolean {
    if (!this.isAvailable()) return false

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error al eliminar ${key} de localStorage:`, error)
      return false
    }
  }

  /**
   * Limpia elementos antiguos del localStorage
   */
  private cleanup(): void {
    try {
      const keys = Object.keys(localStorage)
      
      // Eliminar elementos que no sean del historial legal
      keys.forEach(key => {
        if (!key.startsWith('legal-')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Error durante la limpieza de localStorage:', error)
    }
  }

  /**
   * Calcula el tamaño de los datos en bytes
   */
  private getDataSize(data: string): number {
    return new Blob([data]).size
  }

  /**
   * Obtiene estadísticas del localStorage
   */
  getStorageStats(): { available: boolean; used: number; total: number; percentage: number } {
    if (!this.isAvailable()) {
      return { available: false, used: 0, total: 0, percentage: 0 }
    }

    try {
      let used = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length
        }
      }

      return {
        available: true,
        used,
        total: this.maxSizeBytes,
        percentage: (used / this.maxSizeBytes) * 100
      }
    } catch {
      return { available: false, used: 0, total: 0, percentage: 0 }
    }
  }
}

export const storage = StorageManager.getInstance()
