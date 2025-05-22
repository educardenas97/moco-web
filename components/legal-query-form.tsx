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
import { useHistory } from "@/hooks/use-history"
import type { LegalResponseData } from "@/types"
import { submitLegalQuery } from "@/app/actions"
import { FullPageLoader } from "@/components/full-page-loader"

export function LegalQueryForm() {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState<LegalResponseData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { history, addToHistory, removeFromHistory, clearHistory } = useHistory()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const { data, error: apiError } = await submitLegalQuery(query)

      if (apiError) {
        throw new Error(apiError)
      }

      if (data) {
        setResponse(data)
        // Save to history
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

      <Card className="p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-primary">Nueva consulta tributaria</h2>
          <HistoryDialog
            history={history}
            onSelectQuery={handleSelectFromHistory}
            onRemoveItem={removeFromHistory}
            onClearHistory={clearHistory}
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">          <Textarea
            placeholder="Escribe tu consulta sobre temas tributarios en Paraguay. Por ejemplo: ¿Cuáles son los requisitos para constituir una empresa en Paraguay?"
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
            className="min-h-[120px] resize-y border-primary/20 focus-visible:ring-primary"
            disabled={loading}
          />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground italic">Presiona Ctrl+Enter para enviar rápidamente</p>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white"
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size={16} /> Procesando
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={16} /> Enviar consulta
                </span>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <Card className="p-6 border-destructive bg-destructive/10">
          <p className="text-destructive font-medium">Error: {error}</p>
        </Card>
      )}

      {response && !loading && !error && <LegalResponse response={response} />}
    </div>
  )
}
