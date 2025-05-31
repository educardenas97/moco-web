/**
 * Componente de diálogo para mostrar el historial de consultas tributarias
 * Permite ver, seleccionar y gestionar las consultas previas del usuario
 */
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Clock, X, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { HistoryItem } from "@/types"

interface HistoryDialogProps {
  /** Lista de elementos del historial de consultas */
  history: HistoryItem[]
  /** Función para seleccionar una consulta del historial */
  onSelectQuery: (query: string) => void
  /** Función para eliminar un elemento del historial */
  onRemoveItem: (id: string) => void
  /** Función para limpiar todo el historial */
  onClearHistory: () => void
  /** Función opcional para exportar el historial */
  onExportHistory?: () => void
}

export function HistoryDialog({ history, onSelectQuery, onRemoveItem, onClearHistory, onExportHistory }: HistoryDialogProps) {
  // Estado para controlar si el diálogo está abierto o cerrado
  const [open, setOpen] = useState(false)

  /**
   * Maneja la selección de una consulta del historial
   * Ejecuta la función de callback y cierra el diálogo
   */
  const handleSelectQuery = (query: string) => {
    onSelectQuery(query)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Botón que activa el diálogo del historial */}
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-full px-4 border-border hover:bg-primary/10 hover:text-primary transition-colors">
          <Clock size={16} />
          <span className="hidden sm:inline font-medium">Historial</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md h-[85vh] flex flex-col rounded-xl shadow-xl">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-xl font-medium text-foreground">Historial de consultas tributarias</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {history.length} {history.length === 1 ? "consulta" : "consultas"} guardadas en este navegador
          </DialogDescription>
        </DialogHeader>

        {/* Mostrar mensaje cuando no hay consultas guardadas */}
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-medium text-lg mb-1">No hay consultas guardadas</h3>
            <p className="text-muted-foreground">
              Las consultas tributarias que realices se guardarán automáticamente aquí para tu referencia.
            </p>
          </div>
        ) : (
          /* Lista de consultas del historial */
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4 animate-reveal pb-4">
                {history.map((item) => (
                <div key={item.id} className="border border-border rounded-xl p-4 relative group hover:border-primary/30 hover:bg-primary/5 transition-all">
                  {/* Botón para eliminar elemento individual */}
                  <div className="absolute right-2 top-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <X size={15} />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                  {/* Fecha y hora de la consulta formateada en español */}
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(item.timestamp), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                    </p>
                  </div>
                  {/* Texto de la consulta truncado */}
                  <p className="font-medium line-clamp-2 mb-2">{item.query}</p>
                  {/* Botón para usar esta consulta */}
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleSelectQuery(item.query)}
                  >
                    Usar esta consulta
                  </Button>
                </div>
              ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Footer con acciones globales - solo se muestra si hay historial */}
        {history.length > 0 && (
          <DialogFooter className="flex-shrink-0 flex flex-col gap-2 sm:flex-row border-t pt-4 mt-4">
            <div className="flex gap-2 flex-1">
              {onExportHistory && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30" 
                  onClick={onExportHistory}
                >
                  <Download size={14} />
                  <span>Exportar</span>
                </Button>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" 
              onClick={onClearHistory}
            >
              <Trash2 size={14} />
              <span>Limpiar historial</span>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
