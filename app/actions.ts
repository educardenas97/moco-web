/**
 * Acciones del servidor para manejar consultas tributarias
 * Este archivo contiene las funciones que se ejecutan en el servidor
 * para procesar las consultas legales enviadas por los usuarios
 */
"use server"

import type { LegalResponseData } from "@/types"

/**
 * Envía una consulta tributaria al servicio de IA legal
 * @param query - La consulta tributaria del usuario
 * @returns Objeto con los datos de respuesta o error
 */
export async function submitLegalQuery(
  query: string,
): Promise<{ data: LegalResponseData | null; error: string | null }> {
  try {
    // Obtener configuración de API desde variables de entorno
    const apiUrl = process.env.NEXT_PUBLIC_LEGAL_API_URL
    const apiToken = process.env.LEGAL_API_TOKEN

    // Validar que la URL de la API esté configurada
    if (!apiUrl) {
      throw new Error("API URL is not configured")
    }

    // Validar que el token de API esté configurado
    if (!apiToken) {
      throw new Error("API token is not configured")
    }

    // Realizar petición HTTP al servicio de consultas legales
    const response = await fetch(`${apiUrl}/retrieval/legal-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ query }),
    })

    // Verificar que la respuesta sea exitosa
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    // Parsear y retornar la respuesta JSON
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    // Manejar errores y registrarlos en consola
    console.error("Error al enviar consulta legal:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Ocurrió un error al procesar tu consulta",
    }
  }
}

/**
 * Representa un archivo de media de la API
 */
interface MediaItem {
  name: string
  size: number
  metadata: Record<string, any>
}

/**
 * Estructura de respuesta de la API de media
 */
interface MediaResponse {
  error: string | null
  data: MediaItem[]
}

/**
 * Obtiene la lista de archivos de media del servicio
 * @returns Lista de archivos de media o error
 */
export async function fetchMediaFiles(): Promise<{ data: MediaItem[] | null; error: string | null }> {
  try {
    // Obtener configuración de API desde variables de entorno
    const apiUrl = process.env.NEXT_PUBLIC_LEGAL_API_URL
    const apiToken = process.env.LEGAL_API_TOKEN

    // Validar que la URL de la API esté configurada
    if (!apiUrl) {
      throw new Error("La URL de la API no está configurada")
    }

    // Validar que el token de API esté configurado
    if (!apiToken) {
      throw new Error("El token de la API no está configurado")
    }

    // Realizar petición HTTP al endpoint de media
    const response = await fetch(`${apiUrl}/media`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: "application/json",
      },
    })

    // Verificar que la respuesta sea exitosa
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    // Parsear y retornar la respuesta JSON
    const result: MediaResponse = await response.json()
    return { data: result.data, error: null }
  } catch (error) {
    // Manejar errores y registrarlos en consola
    console.error("Error fetching media files:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Error al obtener archivos de media",
    }
  }
}

/**
 * Envía una consulta tributaria y obtiene archivos de media en paralelo
 * @param query - La consulta tributaria del usuario
 * @returns Objeto con los datos de respuesta, archivos de media y errores
 */
export async function submitLegalQueryWithMedia(
  query: string,
): Promise<{ 
  queryData: LegalResponseData | null; 
  mediaData: MediaItem[] | null; 
  queryError: string | null;
  mediaError: string | null;
}> {
  try {
    // Ejecutar ambas llamadas en paralelo
    const [queryResult, mediaResult] = await Promise.allSettled([
      submitLegalQuery(query),
      fetchMediaFiles()
    ])

    // Extraer resultados de la consulta
    const queryData = queryResult.status === 'fulfilled' ? queryResult.value.data : null
    const queryError = queryResult.status === 'fulfilled' ? queryResult.value.error : 
                      queryResult.status === 'rejected' ? queryResult.reason?.message || "Error en consulta" : null

    // Extraer resultados de media
    const mediaData = mediaResult.status === 'fulfilled' ? mediaResult.value.data : null
    const mediaError = mediaResult.status === 'fulfilled' ? mediaResult.value.error :
                      mediaResult.status === 'rejected' ? mediaResult.reason?.message || "Error obteniendo archivos" : null

    return {
      queryData,
      mediaData,
      queryError,
      mediaError
    }
  } catch (error) {
    console.error("Error in submitLegalQueryWithMedia:", error)
    return {
      queryData: null,
      mediaData: null,
      queryError: error instanceof Error ? error.message : "Error al procesar la consulta",
      mediaError: "Error al obtener archivos de media"
    }
  }
}
