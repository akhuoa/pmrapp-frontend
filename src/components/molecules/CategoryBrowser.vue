<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSearchService } from '@/services'
import type { IndexKindResponse } from '@/types/search'

interface CategoryData {
  kind: string
  kindInfo: IndexKindResponse | null
  loading: boolean
  error: string | null
}

const searchService = getSearchService()
const categories = ref<CategoryData[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await searchService.getIndexes()
    categories.value = response.indexes.map((kind) => ({
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
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load categories'
  } finally {
    loading.value = false
  }
})

const handleTermClick = (kind: string, term: string) => {
  // TODO: Navigate to search results or handle term selection
  console.log('Selected:', { kind, term })
}
</script>

<template>
  <h2 class="text-3xl font-bold mb-6">Browse by Category</h2>

  <div v-if="loading" class="text-center py-8">
    <p class="text-gray-500 dark:text-gray-400">Loading categories...</p>
  </div>

  <div v-else-if="error" class="text-center py-8">
    <p class="text-red-600 dark:text-red-400">{{ error }}</p>
  </div>

  <div v-else class="space-y-6">
    <div
      v-for="category in categories"
      :key="category.kind"
      class="box p-6"
    >
      <h3 class="text-xl font-semibold mb-4">
        {{ category.kindInfo?.kind.description || category.kind }}
      </h3>

      <div v-if="category.loading" class="text-gray-500 dark:text-gray-400">
        Loading...
      </div>

      <div v-else-if="category.error" class="text-red-600 dark:text-red-400">
        {{ category.error }}
      </div>

      <div v-else-if="category.kindInfo" class="flex flex-wrap gap-2">
        <button
          v-for="term in category.kindInfo.terms.filter(t => t.trim())"
          :key="term"
          class="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm transition-colors"
          @click="handleTermClick(category.kind, term)"
        >
          {{ term }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/box.css';
</style>
