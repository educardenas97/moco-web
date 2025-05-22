"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface Source {
  metadata: {
    path: string
    description: string
    context: Record<string, any>
  }
  context: Record<string, any>
  score: number
  title: string
  content: string
}

interface LegalResponseProps {
  response: {
    error: string | null
    data: {
      answer: string
      sources: Source[]
    }
  }
}

export function LegalResponse({ response }: LegalResponseProps) {
  const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const toggleSource = (index: number) => {
    setExpandedSources((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  if (response.error) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardContent className="pt-6">
          <p className="text-destructive font-medium">{response.error}</p>
        </CardContent>
      </Card>
    )
  }

  const { answer, sources } = response.data

  return (
    <Card
      className={`shadow-md overflow-hidden transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      } animate-fadeInUp`}
    >
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="text-xl text-primary">Respuesta a tu consulta tributaria</CardTitle>
      </CardHeader>
      <Tabs defaultValue="answer" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
          <TabsTrigger value="answer">Respuesta</TabsTrigger>
          <TabsTrigger value="sources">Fuentes ({sources.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="answer" className="p-6">
          <div className="staggered-reveal">
            <MarkdownRenderer content={answer} />
          </div>
        </TabsContent>
        <TabsContent value="sources" className="p-0">
          <div className="divide-y staggered-reveal">
            {sources.map((source, index) => (
              <div key={index} className="p-4">
                <div className="flex items-start justify-between cursor-pointer" onClick={() => toggleSource(index)}>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">{source.title}</h3>
                      <p className="text-sm text-muted-foreground truncate max-w-[500px]">{source.metadata.path}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {(source.score * 100).toFixed(1)}% relevancia
                  </Badge>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    {expandedSources[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </div>

                {expandedSources[index] && (
                  <div className="mt-4 pl-8 pr-2 py-3 bg-muted/50 rounded-md text-sm animate-reveal">
                    <p className="whitespace-pre-wrap">{source.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
