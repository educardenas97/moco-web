export interface Source {
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

export interface LegalResponseData {
  error: string | null
  data: {
    answer: string
    sources: Source[]
  }
}

export interface HistoryItem {
  id: string
  query: string
  response: LegalResponseData
  timestamp: number
}
