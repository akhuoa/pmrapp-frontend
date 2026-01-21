<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CategoryBrowser from '@/components/molecules/CategoryBrowser.vue'
import SearchResults from '@/components/molecules/SearchResults.vue'
import { useSearchStore } from '@/stores/search'
import type { SearchResult } from '@/types/search'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const kind = computed(() => (route.query.kind as string) || '')
const term = computed(() => (route.query.term as string) || '')
const searchResults = ref<SearchResult[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  await loadResults()
  // Ensure categories are loaded for the sidebar.
  await searchStore.fetchCategories()
})

// Watch for route param changes to reload results.
watch([kind, term], async () => {
  await loadResults()
})

const loadResults = async () => {
  if (!kind.value || !term.value) {
    router.push('/search')
    return
  }

  // Try to get cached results first.
  const cached = searchStore.getCachedResults(kind.value, term.value)
  if (cached) {
    searchResults.value = cached
    return
  }

  // Otherwise fetch new results.
  isLoading.value = true
  error.value = null
  searchResults.value = []

  try {
    searchResults.value = await searchStore.searchIndexTerm(kind.value, term.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load search results'
    console.error('Failed to load search results:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex gap-6">
    <!-- Left Sidebar -->
    <aside class="w-80 flex-shrink-0">
      <div class="sticky top-[97px]">
        <CategoryBrowser :inSidebar="true" />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 min-w-0">
      <SearchResults
        :results="searchResults"
        :is-loading="isLoading"
        :error="error"
        :term="term"
      />
    </main>
  </div>
</template>
