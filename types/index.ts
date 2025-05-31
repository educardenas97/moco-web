/**
 * Definiciones de tipos TypeScript para la aplicación de consultas tributarias
 * Este archivo centraliza todas las interfaces y tipos utilizados en la aplicación
 */

/** 
 * Representa una fuente de información legal citada en las respuestas
 */
export interface Source {
  /** Metadatos de la fuente */
  metadata: {
    /** Ruta o ubicación del documento fuente */
    path: string
    /** Descripción del contenido de la fuente */
    description: string
    /** Contexto adicional como artículos, leyes, etc. */
    context: Record<string, any>
  }
  /** Contexto específico donde se encontró la información */
  context: Record<string, any>
  /** Puntuación de relevancia de la fuente (0-1) */
  score: number
  /** Título o nombre de la fuente legal */
  title: string
  /** Contenido textual de la fuente */
  content: string
}

/**
 * Estructura de la respuesta del servicio de IA legal
 */
export interface LegalResponseData {
  /** Mensaje de error si algo falla */
  error: string | null
  /** Datos de la respuesta cuando es exitosa */
  data: {
    /** Respuesta generada por la IA sobre la consulta tributaria */
    answer: string
    /** Lista de fuentes legales que respaldan la respuesta */
    sources: Source[]
  }
}

/**
 * Elemento del historial de consultas del usuario
 * Se guarda localmente en el navegador
 */
export interface HistoryItem {
  /** Identificador único del elemento */
  id: string
  /** Consulta original del usuario */
  query: string
  /** Respuesta completa del sistema */
  response: LegalResponseData
  /** Timestamp de cuando se realizó la consulta */
  timestamp: number
}
