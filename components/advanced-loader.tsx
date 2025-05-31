"use client"

import { useState, useEffect } from "react"
import { PropagateLoader } from "react-spinners"
import { FileText, Search } from "lucide-react"
import { fetchMediaFiles } from "@/app/actions"

/**
 * Representa un archivo de media de la API
 */
interface MediaItem {
  name: string
  size: number
  metadata: Record<string, any>
}

/**
 * Propiedades del componente AdvancedLoader
 */
interface AdvancedLoaderProps {
  isLoading: boolean
  mediaFiles?: MediaItem[]
}

/**
 * Componente de carga avanzado que muestra animación de búsqueda en documentos
 * Utiliza PropagateLoader y simula la búsqueda a través de archivos legales
 */
export function AdvancedLoader({ isLoading, mediaFiles: propMediaFiles }: AdvancedLoaderProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([])
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [processedFiles, setProcessedFiles] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  // Siempre obtener archivos desde la API
  useEffect(() => {
    if (isLoading) {
      setStartTime(Date.now())
      setProcessedFiles(0)
      
      if (propMediaFiles && propMediaFiles.length > 0) {
        // Usar archivos de media proporcionados desde la API
        const shuffled = [...propMediaFiles].sort(() => Math.random() - 0.5)
        setMediaFiles(shuffled)
        setTotalFiles(propMediaFiles.length)
        setApiError(null)
      } else if (mediaFiles.length === 0) {
        // Obtener datos exclusivamente desde la API
        fetchFiles()
      }
    } else {
      setStartTime(null)
      setProcessedFiles(0)
    }
  }, [isLoading, propMediaFiles])

  // Simular búsqueda a través de archivos
  useEffect(() => {
    if (isLoading && mediaFiles.length > 0) {
      setIsSearching(true)
      const interval = setInterval(() => {
        setCurrentFileIndex((prev) => (prev + 1) % mediaFiles.length)
      }, 450) // Cambiar archivo cada 450ms

      return () => clearInterval(interval)
    } else {
      setIsSearching(false)
    }
  }, [isLoading, mediaFiles.length])

  // Simulación de progreso por archivos procesados
  useEffect(() => {
    if (isLoading && startTime && totalFiles > 0) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const targetDuration = 19000 // 19 segundos
        const targetProgress = Math.min((elapsed / targetDuration), 1)
        const newProcessedFiles = Math.floor(targetProgress * totalFiles)
        
        setProcessedFiles(Math.min(newProcessedFiles, totalFiles))
        
        if (newProcessedFiles >= totalFiles) {
          clearInterval(interval)
        }
      }, 150) // Actualizar cada 100ms

      return () => clearInterval(interval)
    } else {
      setProcessedFiles(0)
    }
  }, [isLoading, startTime, totalFiles])

  const fetchFiles = async () => {
    setIsLoadingFiles(true)
    setApiError(null)
    
    try {
      const { data, error } = await fetchMediaFiles()
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Mezclar el array para que se vea más dinámico
        const shuffled = [...data].sort(() => Math.random() - 0.5)
        setMediaFiles(shuffled)
        setTotalFiles(data.length)
        setApiError(null)
      } else {
        console.error("Error al obtener archivos de media:", error)
        setApiError("No se pudieron cargar los documentos desde la API")
        setMediaFiles([])
        setTotalFiles(0)
      }
    } catch (error) {
      console.error("Error en fetchFiles:", error)
      setApiError("Error de conexión con la API")
      setMediaFiles([])
      setTotalFiles(0)
    } finally {
      setIsLoadingFiles(false)
    }
  }

  /**
   * Obtiene el nombre del archivo actual sin la extensión .pdf
   */
  const getCurrentFileName = () => {
    if (isLoadingFiles) return "Conectando con la API..."
    if (apiError) return "Error de conexión"
    if (mediaFiles.length === 0) return "Esperando datos de la API..."
    const file = mediaFiles[currentFileIndex]
    return file.name.replace(/\.pdf$/i, "") // Remover extensión .pdf
  }

  /**
   * Obtiene el tamaño del archivo actual formateado
   */
  const getFileSize = () => {
    if (isLoadingFiles || apiError || mediaFiles.length === 0) return ""
    const file = mediaFiles[currentFileIndex]
    const sizeInKB = Math.round(file.size / 1024)
    if (sizeInKB > 1024) {
      return `${(sizeInKB / 1024).toFixed(1)} MB`
    }
    return `${sizeInKB} KB`
  }

  if (!isLoading) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-card p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-lg mx-auto border border-border/50 backdrop-blur-sm">

        {/* Texto principal de carga */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-foreground mb-2">
            Procesando tu consulta tributaria
          </h3>
        </div>

        {/* Animación de búsqueda de archivos */}
        {isSearching && mediaFiles.length > 0 && !apiError && (
          <div className="w-full bg-gradient-to-r from-muted/30 to-muted/50 rounded-2xl p-6 border border-border/30 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/15 rounded-full relative">
                <Search className="h-5 w-5 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">
                  Analizando documento
                </p>
                <p className="text-sm font-medium text-foreground truncate leading-relaxed">
                  {getCurrentFileName()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getFileSize()}
                </p>
              </div>
            </div>
            
            {/* Indicador de progreso con gradiente */}
            <div className="relative">
              <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-75 ease-out rounded-full relative"
                  style={{ 
                    width: `${totalFiles > 0 ? (processedFiles / totalFiles) * 100 : 0}%` 
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{processedFiles}</span> de <span className="font-medium text-foreground">{totalFiles}</span> archivos
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-primary/60 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-primary/40 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1 h-1 bg-primary/20 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado de carga de la API */}
        {isLoadingFiles && (
          <div className="w-full bg-gradient-to-r from-muted/30 to-muted/50 rounded-2xl p-6 border border-border/30 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/15 rounded-full relative">
                <Search className="h-5 w-5 text-primary animate-spin" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">
                  Conectando con la API
                </p>
                <p className="text-sm font-medium text-foreground">
                  Obteniendo lista de documentos...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Estado de error de la API */}
        {apiError && !isLoadingFiles && (
          <div className="w-full bg-gradient-to-r from-destructive/10 to-destructive/20 rounded-2xl p-6 border border-destructive/30 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/15 rounded-full">
                <FileText className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">
                  Error de API
                </p>
                <p className="text-sm font-medium text-destructive">
                  {apiError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de carga */}
        <div className="mt-6 text-center">
          {apiError ? (
            <p className="text-xs text-destructive/75 leading-relaxed">
              No se puede procesar la consulta sin acceso a los documentos
            </p>
          ) : (
            <p className="text-xs text-muted-foreground opacity-75 leading-relaxed">
              Esto puede tomar un momento
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
