/**
 * Client for the server-side syntax-highlighting API endpoint.
 *
 * The backend runs `POST /api/highlight` which accepts `{ code, language }` and
 * returns `{ html }` containing the Prism-tokenised HTML fragment.  Offloading
 * the work to the server prevents the browser main thread from freezing on large
 * source files (e.g. complex CellML models).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface HighlightRequest {
  code: string
  language: string
}

export interface HighlightResponse {
  html: string
}

export const highlightService = {
  /**
   * Ask the server to syntax-highlight `code` for the given `language`.
   *
   * @throws When the network request fails or the server returns a non-2xx
   * status – the caller is responsible for falling back gracefully.
   */
  async highlight(code: string, language: string): Promise<string> {
    const request: HighlightRequest = { code, language }

    const response = await fetch(`${API_BASE_URL}/api/highlight`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Highlight service request failed: ${response.status}`)
    }

    const payload: HighlightResponse = await response.json()
    return payload.html
  },
}
