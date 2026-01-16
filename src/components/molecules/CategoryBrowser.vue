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
const searchResults = ref<string[]>([])
const selectedTerm = ref<{ kind: string; term: string } | null>(null)

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

const handleTermClick = async (kind: string, term: string) => {
  try {
    const result = await searchService.searchIndexTerm(kind, term)

    if (result?.resource_paths && Array.isArray(result.resource_paths)) {
      searchResults.value = result.resource_paths
      selectedTerm.value = { kind, term }
    } else {
      searchResults.value = []
      selectedTerm.value = { kind, term }
    }
  } catch (err) {
    console.error('Failed to search term:', err)
  }
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
          class="px-3 py-1.5 bg-gray-100 cursor-pointer dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm transition-colors"
          @click="handleTermClick(category.kind, term)"
        >
          {{ term }}
        </button>
      </div>
    </div>

    <div v-if="selectedTerm" class="box p-6">
      <h3 class="text-xl font-semibold mb-4">
        Search Results for "{{ selectedTerm.term }}" in {{ selectedTerm.kind }}
      </h3>
      <div v-if="searchResults.length > 0" class="space-y-2">
        <div
          v-for="(path, index) in searchResults"
          :key="index"
          class="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-md"
        >
          {{ path }}
        </div>
      </div>
      <div v-else class="text-gray-500 dark:text-gray-400">
        No results found.
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/box.css';
</style>
