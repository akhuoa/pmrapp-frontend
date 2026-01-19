<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useSearchStore } from '@/stores/search'
import { getSearchService } from '@/services'

const searchStore = useSearchStore()
const searchService = getSearchService()
const searchResults = ref<string[]>([])
const selectedTerm = ref<{ kind: string; term: string } | null>(null)
const termLoading = ref(false)
const categoryFilters = ref<Map<string, string>>(new Map())
const resultsSection = ref<HTMLElement | null>(null)

const termButtonClass = [
  "px-3",
  "py-1.5",
  "bg-gray-100",
  "cursor-pointer",
  "dark:bg-gray-800",
  "hover:bg-gray-200",
  "dark:hover:bg-gray-700",
  "rounded-md",
  "text-sm",
  "transition-colors",
  "relative",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
].join(' ')

const termLoadingClass = [
  'absolute',
  'top-0',
  'left-0',
  'w-full',
  'h-full',
  'flex',
  'items-center',
  'justify-center',
  'bg-white/75',
  'dark:bg-gray-900/75',
  'rounded-md',
  'text-sm'
].join(' ')

onMounted(async () => {
  await searchStore.fetchCategories()
})

const handleTermClick = async (kind: string, term: string) => {
  try {
    termLoading.value = true
    selectedTerm.value = { kind, term }
    searchResults.value = []

    const result = await searchService.searchIndexTerm(kind, term)

    if (result?.resource_paths && Array.isArray(result.resource_paths)) {
      searchResults.value = result.resource_paths
    }

    // Scroll to results section after updating.
    await nextTick()
    if (resultsSection.value) {
      resultsSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  } catch (err) {
    console.error('Failed to search term:', err)
  } finally {
    termLoading.value = false
  }
}

const getFilteredTerms = (terms: string[], kind: string): string[] => {
  const filter = categoryFilters.value.get(kind)?.toLowerCase() || ''
  return terms
    .filter(t => t.trim())
    .filter(t => filter === '' || t.toLowerCase().includes(filter))
}
</script>

<template>
  <h2 class="text-3xl font-bold mb-6">Browse by keyword</h2>

  <div v-if="searchStore.isLoading" class="text-center py-8">
    <p class="text-gray-500 dark:text-gray-400">Loading categories...</p>
  </div>

  <div v-else-if="searchStore.error" class="text-center py-8">
    <p class="text-red-600 dark:text-red-400">{{ searchStore.error }}</p>
  </div>

  <div v-else class="space-y-6">
    <div
      v-for="category in searchStore.categories"
      :key="category.kind"
      class="box p-6"
    >
      <div class="flex items-center justify-between mb-4 gap-4">
        <h3 class="text-xl font-semibold">
          {{ category.kindInfo?.kind.description || category.kind }}
        </h3>
        <input
          v-if="category.kindInfo"
          type="search"
          placeholder="Filter keywords..."
          class="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          :value="categoryFilters.get(category.kind) || ''"
          @input="categoryFilters.set(category.kind, ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div v-if="category.loading" class="text-gray-500 dark:text-gray-400">
        Loading...
      </div>

      <div v-else-if="category.error" class="text-red-600 dark:text-red-400">
        {{ category.error }}
      </div>

      <div v-else-if="category.kindInfo" class="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
        <button
          v-for="term in getFilteredTerms(category.kindInfo.terms, category.kind)"
          :key="term"
          :class="termButtonClass"
          :disabled="termLoading"
          @click="handleTermClick(category.kind, term)"
        >
          {{ term }}
          <span
            v-if="termLoading && selectedTerm?.term === term && selectedTerm?.kind === category.kind"
            :class="termLoadingClass"
          >
            <span class="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </span>
        </button>
      </div>
    </div>

    <div v-if="selectedTerm" ref="resultsSection" class="box p-6">
      <h3 class="text-xl font-semibold mb-4">
        Search Results for "{{ selectedTerm.term }}" in {{ selectedTerm.kind }}
      </h3>
      <div v-if="termLoading">
        <div class="text-gray-500 dark:text-gray-400">Searching...</div>
      </div>
      <div v-else-if="searchResults.length > 0" class="space-y-2">
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
