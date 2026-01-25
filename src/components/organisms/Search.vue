<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ActionButton from '@/components/atoms/ActionButton.vue'
import CloseButton from '@/components/atoms/CloseButton.vue'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
import KeywordBrowser from '@/components/molecules/KeywordBrowser.vue'
import SearchResults from '@/components/molecules/SearchResults.vue'
import { useSearchStore } from '@/stores/search'
import type { SearchResult } from '@/types/search'

const route = useRoute()
const searchStore = useSearchStore()

const kind = computed(() => (route.query.kind as string) || '')
const term = computed(() => (route.query.term as string) || '')
const searchResults = ref<SearchResult[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const showSearchTools = ref(false)

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
    // If no search parameters are provided, do not redirect.
    // Simply return without loading results to avoid confusing UX.
    return
  }

  // Reset search tools visibility.
  showSearchTools.value = false

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
  <div class="flex flex-col lg:flex-row gap-6 lg:mt-12">
    <aside class="w-full lg:w-80 flex-shrink-0 relative">
      <div class="lg:hidden">
        <ActionButton
          variant="secondary"
          size="md"
          content-section="Search Page - Show Search Tools Button"
          @click="showSearchTools = true"
        >
          Search Tools
          <ChevronDownIcon class="w-4 h-4 ml-2" />
        </ActionButton>
      </div>
      <div
        class="hidden absolute top-0 left-0 w-full lg:block lg:sticky lg:top-[97px] z-100"
        :class="{ 'block!': showSearchTools }"
      >
        <KeywordBrowser :in-sidebar="true" />
        <CloseButton @click="showSearchTools = false" class="lg:hidden absolute top-4 right-4" />
      </div>
    </aside>

    <main
      class="flex-1 min-w-0 relative lg:opacity-100 lg:pointer-events-auto"
      :class="{ 'opacity-10 pointer-events-none' : showSearchTools }"
    >
      <SearchResults
        :results="searchResults"
        :is-loading="isLoading"
        :error="error"
        :term="term"
      />
    </main>
  </div>
</template>
