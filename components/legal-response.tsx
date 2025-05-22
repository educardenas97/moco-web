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
      <Card className="border-destructive bg-destructive/10 rounded-2xl shadow-lg overflow-hidden">
        <CardHeader className="border-b border-destructive/20 bg-destructive/5">
          <CardTitle className="text-destructive">Error en la consulta</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-destructive font-medium">{response.error}</p>
        </CardContent>
      </Card>
    )
  }

  const { answer, sources } = response.data

  return (
    <Card
      className={`shadow-lg border border-gray-200 rounded-2xl overflow-hidden transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      } animate-fadeInUp`}
    >
      <CardHeader className="bg-primary/5 border-b border-gray-100">
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <Badge className="bg-primary text-white py-1 px-3 text-xs font-medium rounded-full">Respuesta</Badge>
          Consulta Tributaria
        </CardTitle>
      </CardHeader>
      <Tabs defaultValue="answer" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b bg-gray-50/80">
          <TabsTrigger value="answer" className="data-[state=active]:bg-white data-[state=active]:text-primary">
            Respuesta
          </TabsTrigger>
          <TabsTrigger value="sources" className="data-[state=active]:bg-white data-[state=active]:text-primary">
            Fuentes ({sources.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="answer" className="p-6 md:p-8">
          <div className="staggered-reveal prose prose-headings:text-foreground prose-headings:font-medium prose-a:text-primary">
            <MarkdownRenderer content={answer} />
          </div>
        </TabsContent>
        <TabsContent value="sources" className="p-0">
          <div className="divide-y divide-gray-100 staggered-reveal">
            {sources.map((source, index) => (
              <div key={index} className="p-4 md:p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between cursor-pointer" onClick={() => toggleSource(index)}>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{source.title}</h3>
                      <p className="text-sm text-muted-foreground truncate max-w-[500px]">{source.metadata.path}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2 rounded-full border-gray-200">
                    {(source.score * 100).toFixed(1)}% relevancia
                  </Badge>
                  <Button variant="ghost" size="sm" className="ml-auto rounded-full hover:bg-primary/10">
                    {expandedSources[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </div>

                {expandedSources[index] && (
                  <div className="mt-4 p-4 bg-white border border-gray-100 rounded-xl text-sm animate-reveal shadow-sm">
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
