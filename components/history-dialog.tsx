"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Clock, X, Trash2 } from "lucide-react"
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
  history: HistoryItem[]
  onSelectQuery: (query: string) => void
  onRemoveItem: (id: string) => void
  onClearHistory: () => void
}

export function HistoryDialog({ history, onSelectQuery, onRemoveItem, onClearHistory }: HistoryDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSelectQuery = (query: string) => {
    onSelectQuery(query)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-full px-4 border-gray-300 hover:bg-gray-100 hover:text-primary transition-colors">
          <Clock size={16} />
          <span className="hidden sm:inline">Historial</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col rounded-xl shadow-xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-medium text-foreground">Historial de consultas tributarias</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {history.length} {history.length === 1 ? "consulta" : "consultas"} guardadas en este navegador
          </DialogDescription>
        </DialogHeader>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-medium text-lg mb-1">No hay consultas guardadas</h3>
            <p className="text-muted-foreground">
              Las consultas tributarias que realices se guardarán automáticamente aquí para tu referencia.
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1 max-h-[50vh] pr-4 mt-4">
            <div className="space-y-4 animate-reveal">
              {history.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-4 relative group hover:border-primary/30 hover:bg-gray-50/50 transition-all">
                  <div className="absolute right-2 top-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <X size={15} />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(item.timestamp), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                    </p>
                  </div>
                  <p className="font-medium line-clamp-2 mb-2">{item.query}</p>
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
        )}

        {history.length > 0 && (
          <DialogFooter className="mt-4">
            <Button variant="outline" size="sm" className="gap-1" onClick={onClearHistory}>
              <Trash2 size={14} />
              <span>Limpiar historial</span>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
