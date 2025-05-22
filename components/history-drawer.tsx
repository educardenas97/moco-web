"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Clock, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { HistoryItem } from "@/types"

interface HistoryDrawerProps {
  history: HistoryItem[]
  onSelectQuery: (query: string) => void
  onRemoveItem: (id: string) => void
  onClearHistory: () => void
}

export function HistoryDrawer({ history, onSelectQuery, onRemoveItem, onClearHistory }: HistoryDrawerProps) {
  const [open, setOpen] = useState(false)

  const handleSelectQuery = (query: string) => {
    onSelectQuery(query)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Clock size={16} />
          <span className="hidden sm:inline">Historial</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-primary">Historial de consultas tributarias</SheetTitle>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {history.length} {history.length === 1 ? "consulta" : "consultas"} guardadas
            </p>
            {history.length > 0 && (
              <Button variant="outline" size="sm" className="gap-1" onClick={onClearHistory}>
                <Trash2 size={14} />
                <span>Limpiar historial</span>
              </Button>
            )}
          </div>
        </SheetHeader>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-medium text-lg mb-1">No hay consultas guardadas</h3>
            <p className="text-muted-foreground">
              Las consultas tributarias que realices se guardarán automáticamente aquí para tu referencia.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 relative group">
                  <div className="absolute right-2 top-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <X size={14} />
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
                    variant="secondary"
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
      </SheetContent>
    </Sheet>
  )
}
