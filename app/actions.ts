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
    console.error("Error submitting legal query:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Ocurrió un error al procesar tu consulta",
    }
  }
}
