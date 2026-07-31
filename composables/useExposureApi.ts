import type { Exposure, ExposureFileInfo, ExposureInfo } from '@/types/exposure'
import { resolveHtmlPaths } from '@/utils/path'

export const useExposureApi = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl

  const listAliasedExposures = async (): Promise<Exposure[]> => {
    const data = await $fetch<any>('/api/exposures/list', {
      method: 'POST',
    })
    return data.inner
  }

  const getExposureInfo = async (alias: string): Promise<ExposureInfo> => {
    try {
      const data = await $fetch<any>('/api/exposures/info', {
        method: 'POST',
        body: { alias },
      })
      return data.inner
    } catch (error: any) {
      if (error.response?.status === 404 || error.data?.includes('NotFound')) {
        throw new Error('Exposure not found')
      }
      throw new Error(`Request failed: ${error.response?.status || 500}`)
    }
  }

  const getExposureFileInfo = async (id: string, path: string): Promise<ExposureFileInfo> => {
    const data = await $fetch<any>('/api/exposures/file-info', {
      method: 'POST',
      body: { id, path },
    })
    return data.inner
  }

  const getExposureSafeHTML = async (
    exposureId: number,
    exposureFileId: number,
    viewKey: string,
    path: string,
    routePath: string,
  ): Promise<string> => {
    const apiURL = `${apiBaseUrl}/api/exposure/safe_html/${exposureId}/${exposureFileId}/${viewKey}/${path}`
    const response = await $fetch<string>(apiURL, {
      responseType: 'text',
    })
    return resolveHtmlPaths(response, apiBaseUrl, routePath)
  }

  const getExposureRawContent = async (
    exposureId: number,
    exposureFileId: number,
    viewKey: string,
    path: string,
  ): Promise<string> => {
    const apiURL = `${apiBaseUrl}/api/exposure/${exposureId}/${exposureFileId}/${viewKey}/${path}`
    return await $fetch<string>(apiURL, {
      responseType: 'text',
    })
  }

  return {
    listAliasedExposures,
    getExposureInfo,
    getExposureFileInfo,
    getExposureSafeHTML,
    getExposureRawContent,
  }
}
