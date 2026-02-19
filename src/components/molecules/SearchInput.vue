<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SearchField from '@/components/atoms/SearchField.vue'
import TermButton from '@/components/atoms/TermButton.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import { useSearchStore } from '@/stores/search'
import { SEARCH_CATEGORIES } from '@/constants/search'

const props = defineProps<{
  initialTerm: string
  initialKind: string
  inOverlay?: boolean
}>()

const emit = defineEmits<(e: 'search', searchKind: string, searchTerm: string) => void>()

const searchStore = useSearchStore()

const searchInput = ref<string>(props.initialTerm)
const searchInputRef = ref<InstanceType<typeof SearchField> | null>(null)
const isSearchFocused = ref(false)
const categoriesError = ref<string | null>(null)

const searchButtonClass = [
  'px-3',
  'self-stretch',
  'cursor-pointer',
  'hover:bg-gray-200 dark:hover:bg-gray-700',
  'disabled:cursor-default',
  'transition-all',
  'border-l border-gray-200 dark:border-gray-700',
  'flex items-center'
].join(' ')

const searchButtonFocusedClass = [
  ...searchButtonClass.split(' '),
  'rounded-e-lg hover:ring-1 ring-gray-200 dark:ring-gray-700',
].join(' ')

onMounted(async () => {
  const validKinds = SEARCH_CATEGORIES.map((cat) => cat.value)

  try {
    await searchStore.fetchCategories(validKinds)
  } catch (err) {
    categoriesError.value = 'Failed to fetch search categories.'
    console.error('Failed to fetch search categories:', err)
  }
})

const isLoading = computed(() => {
  return searchStore.isLoading || searchStore.categories.some((cat) => cat.loading)
})

const filteredSearchTermsByCategory = computed(() => {
  const searchTermValue = searchInput.value.trim().toLowerCase()
  if (!searchTermValue) return []

  return SEARCH_CATEGORIES
    .map((category) => {
      const categoryData = searchStore.categories.find((cat) => cat.kind === category.value)
      const terms = categoryData?.kindInfo?.terms || []

      const filteredTerms = terms.filter((term) =>
        term.toLowerCase().includes(searchTermValue)
      )

      return {
        kind: category.value,
        label: category.label,
        terms: filteredTerms,
      }
    })
    .filter((group) => group.terms.length > 0)
})

const hasResults = computed(() => {
  return filteredSearchTermsByCategory.value.length > 0
})

const handleSearch = () => {
  const searchTerm = searchInput.value.trim()
  if (searchTerm === '') {
    searchInputRef?.value?.inputRef?.focus()
    return
  }

  // Use the first category kind that has matching results, or default to citation_id
  const firstCategoryWithResults = filteredSearchTermsByCategory.value[0]
  const searchKind = firstCategoryWithResults?.kind || 'citation_id'

  // Blur the input to close the dropdown.
  // searchInputRef.value?.inputRef?.blur()
  emit('search', searchKind, searchTerm)
}

const handleSearchTermClick = (kind: string, term: string) => {
  // Blur the input to close the dropdown.
  searchInputRef.value?.inputRef?.blur()
  emit('search', kind, term)
}

const handleBackdropClick = () => {
  // Blur the input to close the dropdown.
  searchInputRef.value?.inputRef?.blur()
}

defineExpose({
  searchInputRef,
})
</script>

<template>
  <div class="relative z-100">
    <!-- Backdrop overlay (only when not in SearchOverlay). -->
    <div
      v-if="isSearchFocused && searchInput.trim().length > 0 && !props.inOverlay"
      class="fixed inset-0 bg-gray-400/75 dark:bg-gray-900/75 z-30"
      @click="handleBackdropClick"
    ></div>
    <div
      class="flex items-center bg-background justify-between w-full border rounded-lg transition-all relative z-40"
      :class="isSearchFocused ? 'ring-2 ring-primary border-transparent' : 'border-gray-200 dark:border-gray-700 overflow-hidden'"
    >
      <SearchField
        ref="searchInputRef"
        v-model="searchInput"
        placeholder="Start typing to search..."
        aria-label="Search term"
        class="flex-1"
        input-class="flex-1 min-w-0 outline-none focus:ring-0 px-4 py-2"
        @focus="isSearchFocused = true"
        @blur="isSearchFocused = false"
        @search="handleSearch"
      />
      <button
        type="button"
        :class="isSearchFocused ? searchButtonFocusedClass : searchButtonClass"
        aria-label="Search"
        @click="handleSearch"
      >
        <SearchIcon class="w-5 h-5" />
        <span class="sr-only">Search</span>
      </button>
    </div>
    <div
      v-if="isSearchFocused && searchInput.trim().length > 0"
      :class="`top-full left-0 w-full z-40 ${props.inOverlay ? '' : 'absolute'}`"
      @mousedown.prevent
    >
      <div class="mt-2 box box-small overflow-hidden !shadow-none !p-0">
        <div v-if="categoriesError" class="error-box">
          <p class="text-sm">
            {{ categoriesError }}
          </p>
        </div>
        <div v-else-if="isLoading" class="p-4">
          <p class="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
        <div v-else-if="!hasResults" class="p-4">
          <p class="text-gray-500 dark:text-gray-400">
            No matching results found for "{{ searchInput }}".
          </p>
        </div>
        <div v-else class="max-h-96 overflow-y-auto scrollbar-thin group/results">
          <div
            v-for="categoryGroup in filteredSearchTermsByCategory"
            :key="categoryGroup.kind"
            class="hover:bg-gray-50 dark:hover:bg-gray-900 border-b last:border-0 border-gray-200 dark:border-gray-700 p-4 transition-all group-hover/results:opacity-75 hover:!opacity-100"
          >
            <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {{ categoryGroup.label }}
            </h4>
            <div class="flex flex-row items-start justify-start flex-wrap gap-2">
              <TermButton
                v-for="term in categoryGroup.terms"
                :key="term"
                :term="term"
                @click="handleSearchTermClick(categoryGroup.kind, term)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/box.css';
@import '@/assets/error-box.css';
</style>
