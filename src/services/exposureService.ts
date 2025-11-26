import type { Exposure, ExposureInfo, ExposureFileInfo } from '@/types/exposure'

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

  async getExposureInfo(alias: string): Promise<ExposureInfo> {
    const formData = new URLSearchParams()
    formData.append('id[Aliased]', alias)

    const response = await fetch(`${API_BASE_URL}/api/get_exposure_info${API_SUFFIX}`, {
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

  async getExposureFileInfo(id: string, path: string): Promise<ExposureFileInfo> {
    const formData = new URLSearchParams()
    formData.append('id', id)
    formData.append('path', path)

    const response = await fetch(`${API_BASE_URL}/api/resolve_exposure_path${API_SUFFIX}`, {
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
