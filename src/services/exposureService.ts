import type { Exposure } from '@/types/exposure'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_SUFFIX = import.meta.env.VITE_API_SUFFIX

export const exposureService = {
  async listAliased(): Promise<Exposure[]> {
    const response = await fetch(`${API_BASE_URL}/api/list_aliased${API_SUFFIX}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    const payload = await response.json()
    return payload.inner
  },
}
