import type { Exposure, ExposureFileInfo, ExposureInfo } from '@/types/exposure'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const exposureService = {
  async listAliased(): Promise<Exposure[]> {
    const response = await fetch(`${API_BASE_URL}/api/list_aliased_exposures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    const payload = await response.json()
    return payload.inner
  },

  async getExposureInfo(alias: string): Promise<ExposureInfo> {
    const response = await fetch(`${API_BASE_URL}/api/get_exposure_info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        id: { Aliased: alias },
      }),
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    const payload = await response.json()
    return payload.inner
  },

  async getExposureFileInfo(id: string, path: string): Promise<ExposureFileInfo> {
    const formData = new URLSearchParams()
    formData.append('id', id)
    formData.append('path', path)

    const response = await fetch(`${API_BASE_URL}/api/resolve_exposure_path`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    const payload = await response.json()
    return payload.inner
  },
}
