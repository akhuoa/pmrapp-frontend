import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getExposureService } from '@/services'
import type { Exposure, ExposureInfo } from '@/types/exposure'

const CACHE_TTL = 30 * 60 * 1000 // 30 minutes in milliseconds

export const useExposureStore = defineStore('exposure', () => {
  const exposures = ref<Exposure[]>([])
  const exposureInfoCache = ref<Map<string, ExposureInfo>>(new Map())
  const lastFetchTime = ref<number | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isCacheValid = (): boolean => {
    if (!lastFetchTime.value) return false
    const now = Date.now()
    return now - lastFetchTime.value < CACHE_TTL
  }

  const fetchExposures = async (forceRefresh = false): Promise<void> => {
    // Use cache if valid and not forcing refresh.
    if (!forceRefresh && isCacheValid() && exposures.value.length > 0) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await getExposureService().listAliasedExposures()

      exposures.value = data
      lastFetchTime.value = Date.now()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load exposures'
      console.error('Error loading exposures:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getExposureInfo = async (alias: string): Promise<ExposureInfo> => {
    // Check cache first.
    if (exposureInfoCache.value.has(alias)) {
      return exposureInfoCache.value.get(alias)!
    }

    try {
      const info = await getExposureService().getExposureInfo(alias)
      exposureInfoCache.value.set(alias, info)
      return info
    } catch (err) {
      console.error(`Error loading exposure info for ${alias}:`, err)
      throw err
    }
  }

  const clearCache = (): void => {
    exposures.value = []
    exposureInfoCache.value.clear()
    lastFetchTime.value = null
    error.value = null
  }

  return {
    exposures,
    isLoading,
    error,
    lastFetchTime,
    fetchExposures,
    getExposureInfo,
    clearCache,
  }
})
