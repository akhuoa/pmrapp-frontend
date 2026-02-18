<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SearchField from '@/components/atoms/SearchField.vue'
import TermButton from '@/components/atoms/TermButton.vue'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import { useSearchStore } from '@/stores/search'

const props = defineProps<{
  initialTerm: string
  initialKind: string
}>()

const emit = defineEmits<{
  (e: 'search', searchKind: string, searchTerm: string): void
}>()

const searchStore = useSearchStore()

const searchInput = ref<string>(props.initialTerm)
const searchInputRef = ref<InstanceType<typeof SearchField> | null>(null)
const searchCategory = ref<string>(props.initialKind || 'citation_id')
const isSearchFocused = ref(false)
const wasSearchFocused = ref(false)
const searchCategories = [
  { value: 'citation_id', label: 'Publication references' },
  { value: 'citation_author_family_name', label: 'Publication authors' },
  { value: 'model_author', label: 'Model authors' },
  { value: 'cellml_keyword', label: 'CellML keywords' },
]
const categoriesError = ref<string | null>(null)

onMounted(async () => {
  const validKinds = searchCategories.map((cat) => cat.value)

  try {
    await searchStore.fetchCategories(validKinds)
  } catch (err) {
    categoriesError.value = 'Failed to fetch search categories.'
    console.error('Failed to fetch search categories:', err)
  }
})

const currentCategoryData = computed(() => {
  return searchStore.categories.find((cat) => cat.kind === searchCategory.value)
})

const isCategoryLoading = computed(() => {
  return currentCategoryData.value ? currentCategoryData.value.loading : searchStore.isLoading
})

const categoryTerms = computed(() => {
  return currentCategoryData.value?.kindInfo?.terms || []
})

const categoryTermsWithLowercase = computed(() => {
  return (
    categoryTerms.value?.map((term) => ({
      original: term,
      lowercase: term.toLowerCase(),
    })) || []
  )
})

const currentCategoryLabel = computed(() => {
  return (
    searchCategories.find((cat) => cat.value === searchCategory.value)?.label.toLowerCase() ||
    'options'
  )
})

const filteredSearchTerms = computed(() => {
  const searchTermValue = searchInput.value.trim().toLowerCase()
  if (!searchTermValue) return categoryTerms.value

  return categoryTermsWithLowercase.value
    .filter((term) => term.lowercase.includes(searchTermValue))
    .map((term) => term.original)
})

const handleSearch = () => {
  const searchKind = searchCategory.value
  const searchTerm = searchInput.value.trim()
  if (searchTerm === '') return

  // Blur the input to close the dropdown.
  searchInputRef.value?.inputRef?.blur()
  emit('search', searchKind, searchTerm)
}

const handleSearchTermClick = (term: string) => {
  const searchKind = searchCategory.value
  // Blur the input to close the dropdown.
  searchInputRef.value?.inputRef?.blur()
  emit('search', searchKind, term)
}

const handleCategoryChange = () => {
  if (wasSearchFocused.value) {
    searchInputRef.value?.focus()
  }
}

defineExpose({
  searchInputRef,
})
</script>

<template>
  <div
    class="lg:border lg:rounded-lg lg:transition-all relative"
    :class="isSearchFocused ? 'lg:ring-2 lg:ring-primary border-transparent' : 'lg:border-gray-200 lg:dark:border-gray-700'"
  >
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-0 w-full">
      <div
        class="border lg:border-l-0 lg:border-t-0 lg:border-b-0 rounded-lg lg:rounded-none border-gray-200 dark:border-gray-700 relative"
      >
        <ChevronDownIcon
          class="w-4 h-4 mx-4 absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none"
        />
        <select
          class="px-4 pr-12 py-2 outline-none appearance-none bg-transparent relative cursor-pointer"
          v-model="searchCategory"
          aria-label="Search category"
          @change="handleCategoryChange"
        >
          <option v-for="category in searchCategories" :key="category.value" :value="category.value">
            {{ category.label }}
          </option>
        </select>
      </div>
      <div
        class="border lg:border-0 rounded-lg transition-all relative flex items-center justify-between w-full"
        :class="isSearchFocused ? 'ring-2 lg:ring-0 ring-primary border-transparent' : 'border-gray-200 dark:border-gray-700'"
      >
        <SearchField
          ref="searchInputRef"
          v-model="searchInput"
          placeholder="Start typing to search..."
          aria-label="Search term"
          @focus="isSearchFocused = true; wasSearchFocused = true"
          @blur="isSearchFocused = false"
          @search="handleSearch"
        />
        <button
          type="button"
          class="px-4 py-2"
          aria-label="Search"
          @click="handleSearch"
        >
          <SearchIcon class="w-5 h-5" />
          <span class="sr-only">Search</span>
        </button>
      </div>
    </div>
    <div
      class="absolute top-full left-0 w-full z-40"
      v-if="isSearchFocused && searchInput.trim().length > 0"
      @mousedown.prevent
    >
      <div
        class="mt-2 box box-small flex flex-row gap-6"
      >
        <div class="hidden lg:block basis-3/12 xl:basis-2/12 h-64 border-r border-gray-200 dark:border-gray-700 pr-4 text-gray-600 dark:text-gray-400">
          <div class="text-sm leading-relaxed">
            Click on the available {{ currentCategoryLabel }} on the right to search.
          </div>
        </div>
        <div
          class="lg:basis-9/12 xl:basis-10/12 h-auto max-h-64 overflow-y-auto scrollbar-thin"
        >
          <div v-if="categoriesError" class="error-box">
            <p class="text-sm">
              {{ categoriesError }}
            </p>
          </div>
          <div v-else-if="isCategoryLoading">
            <p class="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
          <div v-else-if="!filteredSearchTerms?.length">
            <p class="text-gray-500 dark:text-gray-400">
              No matching {{ currentCategoryLabel }} found for {{ searchInput }}.
            </p>
          </div>
          <div v-else class="flex flex-row items-start justify-start flex-wrap gap-2">
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
  </div>
</template>

<style scoped>
@import '@/assets/box.css';
@import '@/assets/error-box.css';
</style>
