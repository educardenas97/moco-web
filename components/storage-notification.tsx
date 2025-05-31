"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStorage } from "@/hooks/use-storage"

interface StorageNotificationProps {
  onClearHistory?: () => void
}

/**
 * Muestra una notificación al usuario cuando el almacenamiento local está cerca de su
 * capacidad máxima o completamente lleno.
 *
 * La notificación cambia su apariencia y mensaje según el estado del almacenamiento:
 * - Amarillo (advertencia): si el almacenamiento está casi lleno.
 * - Rojo (error): si el almacenamiento está completamente lleno.
 *
 * El usuario puede descartar la notificación. Si se proporciona la función `onClearHistory`,
 * se muestra un botón para limpiar el historial, lo que también descarta la notificación.
 * La notificación se resetea (deja de estar descartada y puede volver a mostrarse)
 * si el almacenamiento deja de estar en un estado problemático (casi lleno) y luego
 * vuelve a estarlo.
 *
 * @param {object} props - Propiedades del componente.
 * @param {() => void} [props.onClearHistory] - Función opcional que se invoca cuando el usuario
 *                                             hace clic en el botón "Limpiar historial".
 *                                             Si se proporciona, se renderiza dicho botón.
 * @returns {JSX.Element | null} El componente de notificación o `null` si no se cumple la condición
 *                               para mostrarla (es decir, si el almacenamiento no está casi lleno
 *                               o si la notificación ha sido descartada por el usuario).
 */
export function StorageNotification({ onClearHistory }: StorageNotificationProps) {
  const { storageStats, isStorageNearFull, isStorageFull } = useStorage()
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    
    if (!isStorageNearFull) {
      setDismissed(false)
    }
  }, [isStorageNearFull])

  if (!isStorageNearFull || dismissed) {
    return null
  }

  const handleDismiss = () => {
    setDismissed(true)
  }

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border shadow-lg
      ${isStorageFull 
        ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
        : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
      }
      animate-in slide-in-from-right-5 duration-300
    `}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`h-5 w-5 mt-0.5 ${
          isStorageFull ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
        }`} />
        
        <div className="flex-1 space-y-2">
          <p className={`text-sm font-medium ${
            isStorageFull ? 'text-red-800 dark:text-red-200' : 'text-yellow-800 dark:text-yellow-200'
          }`}>
            {isStorageFull ? 'Almacenamiento lleno' : 'Almacenamiento casi lleno'}
          </p>
          
          <p className={`text-xs ${
            isStorageFull ? 'text-red-700 dark:text-red-300' : 'text-yellow-700 dark:text-yellow-300'
          }`}>
            {storageStats.percentage.toFixed(1)}% del espacio utilizado. 
            {isStorageFull 
              ? ' No se pueden guardar más consultas.'
              : ' Considera limpiar el historial.'
            }
          </p>
          
          {onClearHistory && (
            <Button 
              size="sm" 
              variant="outline"
              className={`text-xs h-7 ${
                isStorageFull 
                  ? 'border-red-300 hover:bg-red-100 dark:border-red-700 dark:hover:bg-red-900/30' 
                  : 'border-yellow-300 hover:bg-yellow-100 dark:border-yellow-700 dark:hover:bg-yellow-900/30'
              }`}
              onClick={() => {
                onClearHistory()
                handleDismiss()
              }}
            >
              Limpiar historial
            </Button>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-transparent"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </Button>
      </div>
    </div>
  )
}
