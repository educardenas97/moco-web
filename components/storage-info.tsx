"use client"

import { useState, useEffect } from "react"
import { HardDrive, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { storage } from "@/lib/storage"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"

interface StorageInfoProps {
  onClearHistory?: () => void
}

export function StorageInfo({ onClearHistory }: StorageInfoProps) {
  const [stats, setStats] = useState({
    available: false,
    used: 0,
    total: 0,
    percentage: 0
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      const storageStats = storage.getStorageStats()
      setStats(storageStats)
    }
  }, [open])

  if (!stats.available) {
    return null
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HardDrive size={16} />
          <span className="hidden sm:inline">Storage</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HardDrive size={20} />
            Información de Almacenamiento
          </DialogTitle>
          <DialogDescription>
            Estado del almacenamiento local del navegador
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Espacio utilizado:</span>
              <span>{formatBytes(stats.used)} / {formatBytes(stats.total)}</span>
            </div>
            <Progress value={stats.percentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stats.percentage.toFixed(1)}% del espacio disponible utilizado
            </p>
          </div>

          {stats.percentage > 80 && (
            <div className="p-3 border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ El almacenamiento está casi lleno. Considera limpiar el historial.
              </p>
            </div>
          )}

          {onClearHistory && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" 
              onClick={() => {
                onClearHistory()
                setOpen(false)
              }}
            >
              <Trash2 size={16} />
              Limpiar historial para liberar espacio
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
