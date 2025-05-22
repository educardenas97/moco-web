"use server"

import type { LegalResponseData } from "@/types"

export async function submitLegalQuery(
  query: string,
): Promise<{ data: LegalResponseData | null; error: string | null }> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_LEGAL_API_URL
    const apiToken = process.env.LEGAL_API_TOKEN

    if (!apiUrl) {
      throw new Error("API URL is not configured")
    }

    if (!apiToken) {
      throw new Error("API token is not configured")
    }

    const response = await fetch(`${apiUrl}/retrieval/legal-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    console.error("Error submitting legal query:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Ocurrió un error al procesar tu consulta",
    }
  }
}
