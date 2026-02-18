<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchInput from '@/components/molecules/SearchInput.vue'
import SearchResults from '@/components/molecules/SearchResults.vue'
import { useSearchStore } from '@/stores/search'
import type { SearchResult } from '@/types/search'
import { useGlobalStateStore } from '@/stores/globalState'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()
const globalState = useGlobalStateStore()

const kind = computed(() => (route.query.kind as string) || '')
const term = computed(() => (route.query.term as string) || '')
const searchResults = ref<SearchResult[]>([])
const isLoading = ref(false)
const resultsError = ref<string | null>(null)
const searchInputRef = ref<InstanceType<typeof SearchInput> | null>(null)

watch(
  () => globalState.isSearchFocusRequested,
  (isRequested) => {
    if (isRequested) {
      searchInputRef.value?.searchInputRef?.focus()
      globalState.consumeSearchFocus()
    }
  },
)

onMounted(async () => {
  await loadResults()
})

// Watch for route param changes to reload results.
watch([kind, term], async () => {
  await loadResults()
})

const loadResults = async () => {
  if (!kind.value || !term.value) {
    // If no search parameters are provided, do not redirect.
    // Simply return without loading results to avoid confusing UX.
    return
  }

  isLoading.value = true
  resultsError.value = null
  searchResults.value = []

  try {
    searchResults.value = await searchStore.searchIndexTerm(kind.value, term.value)
  } catch (err) {
    resultsError.value = err instanceof Error ? err.message : 'Failed to load search results'
    console.error('Failed to load search results:', err)
  } finally {
    isLoading.value = false
  }
}

const handleSearch = (searchKind: string, searchTerm: string) => {
  router.push({ path: '/search', query: { kind: searchKind, term: searchTerm } })
}
</script>

<template>
  <SearchInput ref="searchInputRef" :initial-kind="kind" :initial-term="term" @search="handleSearch" />
  <div class="mt-8">
    <main class="flex-1 min-w-0 relative">
      <SearchResults
        :results="searchResults"
        :is-loading="isLoading"
        :error="resultsError"
        :term="term"
      />
    </main>
  </div>
</template>
