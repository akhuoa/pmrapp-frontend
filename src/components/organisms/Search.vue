<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchInput from '@/components/molecules/SearchInput.vue'
import SearchResults from '@/components/molecules/SearchResults.vue'
import SortDropdown from '@/components/molecules/SortDropdown.vue'
import { useGlobalStateStore } from '@/stores/globalState'
import { useSearchStore } from '@/stores/search'
import type { SortOption } from '@/types/common'
import type { SearchResult } from '@/types/search'
import { DEFAULT_SORT_OPTION, SORT_OPTIONS_GROUPED, isValidSortOption, sortSearchResults } from '@/utils/sort'

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

const sortQuery = route.query.sort
const initialSort: SortOption =
  typeof sortQuery === 'string' && isValidSortOption(sortQuery) ? sortQuery : DEFAULT_SORT_OPTION
const sortBy = ref<SortOption>(initialSort)

watch(
  () => globalState.isSearchFocusRequested,
  (isRequested) => {
    if (isRequested) {
      searchInputRef.value?.searchInputRef?.focus()
      globalState.consumeSearchFocus()
    }
  },
)

watch(
  () => route.query.sort,
  (newSort) => {
    const nextSort =
      typeof newSort === 'string' && isValidSortOption(newSort) ? newSort : DEFAULT_SORT_OPTION
    if (sortBy.value !== nextSort) {
      sortBy.value = nextSort
    }
  },
)

// Sync sort with URL query parameters whilst preserving the kind and term params.
watch(sortBy, (newSort) => {
  const query: Record<string, string> = {}
  if (kind.value) query.kind = kind.value
  if (term.value) query.term = term.value
  if (newSort !== DEFAULT_SORT_OPTION) query.sort = newSort
  router.replace({ query })
})

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

const sortedResults = computed(() => sortSearchResults(searchResults.value, sortBy.value))

const hasResults = computed(() => searchResults.value.length > 0)
</script>

<template>
  <SearchInput ref="searchInputRef" :initial-kind="kind" :initial-term="term" @search="handleSearch" />
  <div class="mt-8">
    <main class="flex-1 min-w-0 relative">
      <div v-if="hasResults || isLoading" class="mb-4 flex justify-end">
        <SortDropdown
          :model-value="sortBy"
          :options="SORT_OPTIONS_GROUPED"
          @update:model-value="(value) => (sortBy = value)"
        />
      </div>
      <SearchResults
        :results="sortedResults"
        :is-loading="isLoading"
        :error="resultsError"
        :term="term"
        :kind="kind"
      />
    </main>
  </div>
</template>
