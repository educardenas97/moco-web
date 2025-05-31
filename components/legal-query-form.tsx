/**
 * Componente principal del formulario de consultas tributarias
 * Maneja la entrada del usuario, envío de consultas y visualización de respuestas
 */
"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { LegalResponse } from "@/components/legal-response"
import { Loader } from "@/components/loader"
import { HistoryDialog } from "@/components/history-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { StorageInfo } from "@/components/storage-info"
import { StorageNotification } from "@/components/storage-notification"
import { useHistory } from "@/hooks/use-history"
import type { LegalResponseData } from "@/types"
import { submitLegalQuery } from "@/app/actions"
import { FullPageLoader } from "@/components/full-page-loader"

export function LegalQueryForm() {
  // Estados del componente
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState<LegalResponseData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Hook personalizado para manejo del historial
  const { history, addToHistory, removeFromHistory, clearHistory, exportHistory, isLoaded } = useHistory()

  /**
   * Maneja el envío del formulario de consulta
   * @param e - Evento del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Enviar consulta al servidor
      const { data, error: apiError } = await submitLegalQuery(query)

      if (apiError) {
        throw new Error(apiError)
      }

      if (data) {
        setResponse(data)
        // Guardar en el historial
        addToHistory(query, data)
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Ocurrió un error al procesar tu consulta")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectFromHistory = (historicQuery: string) => {
    setQuery(historicQuery)
  }

  return (
    <div className="space-y-8">
      {loading && <FullPageLoader />}
      <StorageNotification onClearHistory={clearHistory} />

      <Card className="p-6 md:p-8 shadow-lg border-border rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-foreground">Nueva consulta tributaria</h2>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <StorageInfo onClearHistory={clearHistory} />
            <HistoryDialog
              history={history}
              onSelectQuery={handleSelectFromHistory}
              onRemoveItem={removeFromHistory}
              onClearHistory={clearHistory}
              onExportHistory={exportHistory}
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="legal-query" className="sr-only">Consulta tributaria</label>
            <Textarea
              id="legal-query"
              placeholder="¿Cuáles son los requisitos para constituir una empresa en Paraguay?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault();
                  if (query.trim()) {
                    handleSubmit(e);
                  }
                }
              }}
              className="min-h-[150px] resize-y border border-input rounded-xl focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 transition-all"
              disabled={loading}
              aria-label="Nueva consulta tributaria"
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Presiona <kbd className="px-2 py-0.5 text-xs bg-muted rounded">Ctrl+Enter</kbd> para enviar</p>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-5 py-2.5 rounded-full font-medium min-w-[150px] min-h-[44px]"
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size={18} /> Procesando
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send size={18} /> Enviar
                </span>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <Card className="p-6 md:p-8 border-destructive bg-destructive/5 rounded-2xl shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-destructive/10 rounded-full text-destructive">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-destructive mb-1">Error en la consulta</h3>
              <p className="text-destructive/90">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {response && !loading && !error && <LegalResponse response={response} />}
    </div>
  )
}
