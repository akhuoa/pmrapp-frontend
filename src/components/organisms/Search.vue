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
import SearchIcon from '@/components/icons/SearchIcon.vue'
import TermButton from '@/components/atoms/TermButton.vue'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const kind = computed(() => (route.query.kind as string) || '')
const term = computed(() => (route.query.term as string) || '')
const searchResults = ref<SearchResult[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const showSearchTools = ref(false)
const searchInput = ref<string>(term.value)
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchCategory = ref<string>(kind.value || 'all')
const isSearchFocused = ref(false)
const searchCategories = [
  { value: 'all', label: 'All' },
  { value: 'citation_id', label: 'Publications' },
  { value: 'citation_author_family_name', label: 'Citation Authors' },
  { value: 'model_author', label: 'Model Authors' },
  { value: 'cellml_keyword', label: 'CellML Keywords' },
]

onMounted(async () => {
  const validKinds = searchCategories.map((cat) => cat.value).filter((k) => k !== 'all')

  await loadResults()
  await searchStore.fetchCategories(validKinds)
})

// Watch for route param changes to reload results.
watch([kind, term], async () => {
  searchInput.value = term.value
  searchCategory.value = kind.value || 'all'

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

const filteredTerms = computed(() => {
  const categoryObj = searchStore.categories.find((cat) => cat.kind === (searchCategory.value === 'all' ? '' : searchCategory.value))
  if (categoryObj && categoryObj.kindInfo) {
    return searchStore.categories.find((cat) => cat.kind === categoryObj.kind)?.kindInfo?.terms
  }
  return []
})

const currentCategoryLabel = computed(() => {
  if (searchCategory.value === 'all') {
    return 'keywords'
  }
  return searchCategories.find((cat) => cat.value === searchCategory.value)?.label.toLowerCase() || 'options'
})

const filteredSearchTerms = computed(() => {
  return filteredTerms.value?.filter((t) => t.toLowerCase().includes(searchInput.value.toLowerCase()))
})

const handleSearch = () => {
  const selectedKind = searchCategory.value
  const searchKind = selectedKind === 'all' ? '' : selectedKind
  let termMatch = null
  let searchTerm = searchInput.value.trim()
  if (searchTerm === '') return

  const searchCategoryObj = searchStore.categories.find((cat) => cat.kind === searchKind)

  if (searchCategoryObj) {
    termMatch = searchCategoryObj.kindInfo?.terms.find((term) =>
      term.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (termMatch) {
      searchTerm = termMatch
    }
  }

  router.push({ path: '/search', query: { kind: searchKind, term: searchTerm } })
}

const handleSearchTermClick = (term: string) => {
  const selectedKind = searchCategory.value
  const searchKind = selectedKind === 'all' ? '' : selectedKind
  // Blur the input to close the dropdown.
  searchInputRef.value?.blur()
  router.push({ path: '/search', query: { kind: searchKind, term } })
}
</script>

<template>
  <div
    class="border rounded-lg transition-all relative"
    :class="isSearchFocused ? 'ring-2 ring-primary border-transparent' : 'border-gray-200 dark:border-gray-700'"
  >
    <div class="flex items-center justify-between w-full">
      <div class="border-r border-gray-200 dark:border-gray-700 relative">
        <ChevronDownIcon
          class="w-4 h-4 mx-4 absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none"
        />
        <select
          class="px-4 pr-12 py-2 outline-none appearance-none bg-transparent relative cursor-pointer"
          v-model="searchCategory"
        >
          <option v-for="category in searchCategories" :key="category.value" :value="category.value">
            {{ category.label }}
          </option>
        </select>
      </div>
      <input
        type="search"
        ref="searchInputRef"
        v-model="searchInput"
        placeholder="Search..."
        class="flex-1 px-4 py-2 border-0 focus:ring-0 outline-none"
        @focus="isSearchFocused = true"
        @blur="isSearchFocused = false"
      />
      <button class="px-4 py-2" @click="handleSearch">
        <SearchIcon class="w-5 h-5" />
        <span class="sr-only">Search</span>
      </button>
    </div>
    <div
      class="absolute top-full left-0 w-full z-200"
      v-if="isSearchFocused && searchInput.trim().length > 0"
      @mousedown.prevent
    >
      <div
        class="mt-2 box box-small flex flex-row gap-6"
      >
        <div class="basis-2/12 h-64 border-r border-gray-200 dark:border-gray-700 pr-4 text-gray-600 dark:text-gray-400">
          <div class="text-sm leading-relaxed">
            Click on the available {{ currentCategoryLabel }} on the right to search.
          </div>
        </div>
        <div
          class="basis-10/12 flex flex-row items-start justify-start flex-wrap gap-2 h-auto max-h-64 overflow-y-auto scrollbar-thin"
        >
          <div v-if="!filteredSearchTerms?.length">
            <p class="text-gray-500 dark:text-gray-400">
              No matching {{ currentCategoryLabel }} found for {{ searchInput }}.
            </p>
          </div>
          <TermButton
            v-for="filteredTerm in filteredSearchTerms"
            :key="filteredTerm"
            :term="filteredTerm"
            @click="handleSearchTermClick(filteredTerm)"
          />
        </div>
      </div>
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

<style scoped>
@import '@/assets/box.css';
</style>
