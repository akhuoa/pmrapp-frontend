import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSearchService } from '@/services'
import type { IndexKindResponse } from '@/types/search'

const CACHE_TTL = 30 * 60 * 1000 // 30 minutes in milliseconds

export interface CategoryData {
  kind: string
  kindInfo: IndexKindResponse | null
  loading: boolean
  error: string | null
}

export const useSearchStore = defineStore('search', () => {
  const categories = ref<CategoryData[]>([])
  const lastFetchTime = ref<number | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isCacheValid = (): boolean => {
    if (!lastFetchTime.value) return false
    const now = Date.now()
    return now - lastFetchTime.value < CACHE_TTL
  }

  const fetchCategories = async (forceRefresh = false): Promise<void> => {
    // Use cache if valid and not forcing refresh.
    if (!forceRefresh && isCacheValid() && categories.value.length > 0) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const searchService = getSearchService()
      const response = await searchService.getIndexes()

      // Filter to only 'cellml_keyword'.
      categories.value = response.indexes.filter((kind) => kind.trim() === 'cellml_keyword').map((kind) => ({
        kind,
        kindInfo: null,
        loading: true,
        error: null,
      }))

      // Fetch data for each category.
      await Promise.all(
        categories.value.map(async (category) => {
          try {
            category.kindInfo = await searchService.getIndexKind(category.kind)
          } catch (err) {
            category.error = err instanceof Error ? err.message : 'Failed to load category'
          } finally {
            category.loading = false
          }
        })
      )

      lastFetchTime.value = Date.now()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load categories'
      console.error('Error loading categories:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const refreshCategories = async (): Promise<void> => {
    await fetchCategories(true)
  }

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    refreshCategories,
  }
})
