import type { Exposure, ExposureInfo } from '@/types/exposure'

export const exposureServiceMock = {
  async listAliased(): Promise<Exposure[]> {
    const response = await fetch('/pmrapp-frontend/mocks/exposures.json')
    if (!response.ok) {
      throw new Error('Failed to load mock exposures')
    }
    return await response.json()
  },

  async getExposureInfo(_alias: string): Promise<ExposureInfo> {
    const response = await fetch('/pmrapp-frontend/mocks/exposure-info.json')
    if (!response.ok) {
      throw new Error('Failed to load mock exposure info')
    }
    return await response.json()
  },
}
