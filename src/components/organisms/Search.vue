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
import SearchIcon from '../icons/SearchIcon.vue'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const kind = computed(() => (route.query.kind as string) || '')
const term = computed(() => (route.query.term as string) || '')
const searchResults = ref<SearchResult[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const showSearchTools = ref(false)
const searchInput = ref('')
const searchCategory = ref('all')
const searchCategories = [
  { value: 'all', label: 'All' },
  { value: 'citation_id', label: 'Publications' },
  { value: 'citation_author_family_name', label: 'Citation Authors' },
  { value: 'model_author', label: 'Model Authors' },
]

onMounted(async () => {
  await loadResults()
  // Load categories if not already loaded.
  if (searchStore.categories.length === 0) {
    const validKinds = searchCategories.map((cat) => cat.value).filter((k) => k !== 'all')
    validKinds.push('cellml_keyword')

    if (kind.value && validKinds.includes(kind.value)) {
      await searchStore.fetchCategories([kind.value])
    } else {
      await searchStore.fetchCategories(validKinds)
    }
  }
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

const handleSearch = () => {
  const selectedKind = searchCategory.value
  const searchKind = selectedKind === 'all' ? '' : selectedKind
  let termMatch = null
  let searchTerm = searchInput.value.trim()
  if (searchTerm === '') return

  const searchCategoryObj = searchStore.categories.find((cat) => cat.kind === searchKind)

  if (searchCategoryObj) {
    termMatch = searchCategoryObj.kindInfo?.terms.find((term) => term.includes(searchTerm))
    if (termMatch) {
      searchTerm = termMatch
    }
  }

  router.push({ path: '/search', query: { kind: searchKind, term: searchTerm } })
}
</script>

<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent overflow-hidden">
    <div class="flex items-center justify-between w-full">
      <input
        type="search"
        v-model="searchInput"
        placeholder="Search..."
        class="flex-1 px-4 py-2 border-0 focus:ring-0 outline-none"
      />
      <div class="border-l border-gray-200 dark:border-gray-700">
        <select class="px-4 py-2 outline-none" v-model="searchCategory">
          <option v-for="category in searchCategories" :key="category.value" :value="category.value">
            {{ category.label }}
          </option>
        </select>
      </div>
      <button class="px-4 py-2 cursor-pointer" @click="handleSearch">
        <SearchIcon class="w-5 h-5" />
        <span class="sr-only">Search</span>
      </button>
    </div>
  </div>
  <div class="flex flex-col lg:flex-row gap-6 lg:mt-8">
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
