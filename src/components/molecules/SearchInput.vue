<script setup lang="ts">
import {
  type ComponentPublicInstance,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchEnterHint from '@/components/atoms/SearchEnterHint.vue'
import SearchField from '@/components/atoms/SearchField.vue'
import TermButton from '@/components/atoms/TermButton.vue'
import { SEARCH_CATEGORIES } from '@/constants/search'
import { useExposureStore } from '@/stores/exposure'
import { useSearchStore } from '@/stores/search'
import { useWorkspaceStore } from '@/stores/workspace'
import type { SortableEntity } from '@/types/common'
import type { SearchFilter, SearchQueryRequest } from '@/types/search'
import { formatNumber } from '@/utils/format'
import { filterItemsByQuery, isValidTerm, normaliseSearchText } from '@/utils/search'
import CloseButton from '@/components/atoms/CloseButton.vue'

const props = withDefaults(defineProps<{
  initialTerm?: string
  initialKind?: string
  initialFilters?: SearchFilter[]
  inOverlay?: boolean
}>(), {
  initialTerm: '',
  initialKind: '',
  initialFilters: () => [],
})

const emit = defineEmits<{
  (e: 'search', searchKind: string, searchTerm: string): void
  (e: 'querySearch', request: SearchQueryRequest): void
  (e: 'close'): void
}>()

const router = useRouter()
const route = useRoute()
const searchStore = useSearchStore()
const exposureStore = useExposureStore()
const workspaceStore = useWorkspaceStore()

const MAX_TERMS_PER_CATEGORY = 10

const searchQueryInput = ref<string>(props.initialTerm ?? '')
const advancedSearchInput = ref<string>('')
const selectedFilters = ref<SearchFilter[]>([])

const getInitialFilters = (): SearchFilter[] => {
  if (props.initialFilters.length > 0) {
    return props.initialFilters
      .map((filter) => ({
        kind: filter.kind.trim(),
        term: filter.term.trim(),
      }))
      .filter((filter) => filter.kind && filter.term)
  }

  const initialKind = (props.initialKind ?? '').trim()
  const initialTerm = (props.initialTerm ?? '').trim()
  if (initialKind && initialTerm) {
    return [{ kind: initialKind, term: initialTerm }]
  }

  return []
}

selectedFilters.value = getInitialFilters()

watch(
  () => props.initialTerm,
  (newTerm) => {
    searchQueryInput.value = newTerm ?? ''
  },
)

watch(
  () => props.initialFilters,
  () => {
    selectedFilters.value = getInitialFilters()
  },
  { deep: true },
)

watch(
  () => props.initialKind,
  () => {
    if (props.initialFilters.length === 0) {
      selectedFilters.value = getInitialFilters()
    }
  },
)

const searchInputRef = ref<InstanceType<typeof SearchField> | null>(null)
const advancedSearchInputRef = ref<HTMLInputElement | null>(null)
const isSearchFocused = ref(false)
const isAdvancedOpen = ref(false)
const categoriesError = ref<string | null>(null)
const termButtonRefs = ref<InstanceType<typeof TermButton>[]>([])
const toggleButtonRefs = ref<(HTMLButtonElement | null)[]>([])
const exposuresButtonRef = ref<HTMLButtonElement | null>(null)
const workspacesButtonRef = ref<HTMLButtonElement | null>(null)
const expandedCategoryKinds = ref<Record<string, boolean>>({})

const setTermButtonRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el) {
    termButtonRefs.value[index] = el as InstanceType<typeof TermButton>
  }
}

const setToggleButtonRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  toggleButtonRefs.value[index] = el as HTMLButtonElement | null
}

// All focusable suggestion buttons in focus order: TermButtons first (rendered
// per category group), then each category toggle (if shown), then the
// Exposures button, then the Workspaces button.
const allSuggestionButtons = computed<HTMLElement[]>(() => {
  const groupedButtons: HTMLElement[] = []
  let termOffset = 0

  filteredSearchTermsByCategory.value.forEach((group, groupIndex) => {
    const groupTermEls = termButtonRefs.value
      .slice(termOffset, termOffset + group.terms.length)
      .map((ref) => ref?.$el ?? ref)
      .filter(Boolean) as HTMLElement[]
    groupedButtons.push(...groupTermEls)
    termOffset += group.terms.length

    const toggleEl = toggleButtonRefs.value[groupIndex]
    if (group.totalCount > MAX_TERMS_PER_CATEGORY && toggleEl) {
      groupedButtons.push(toggleEl)
    }
  })

  const extras: HTMLElement[] = []
  if (exposuresButtonRef.value) extras.push(exposuresButtonRef.value)
  if (workspacesButtonRef.value) extras.push(workspacesButtonRef.value)
  return [...groupedButtons, ...extras]
})

onMounted(async () => {
  const validKinds = SEARCH_CATEGORIES.map((cat) => cat.value)

  try {
    await searchStore.fetchCategories(validKinds)
  } catch (err) {
    categoriesError.value = 'Failed to fetch search categories.'
    console.error('Failed to fetch search categories:', err)
  }

  // Fetch exposures and workspaces silently so they are available for filtering.
  await Promise.all([exposureStore.fetchExposures(), workspaceStore.fetchWorkspaces()])
})

const isLoading = computed(() => {
  return searchStore.isLoading || searchStore.categories.some((cat) => cat.loading)
})

const kindLabelByValue: Record<string, string> = Object.fromEntries(
  SEARCH_CATEGORIES.map((category) => [category.value, category.labelSingular]),
)

const selectedFilterChips = computed(() =>
  selectedFilters.value.map((filter) => ({
    id: `${filter.kind}:${filter.term}`,
    label: `${kindLabelByValue[filter.kind] ?? filter.kind}: ${filter.term}`,
  })),
)

const hasFilter = (kind: string, term: string): boolean => {
  return selectedFilters.value.some(
    (filter) =>
      filter.kind === kind && filter.term.toLowerCase() === term.toLowerCase(),
  )
}

const filteredSearchTermsByCategory = computed(() => {
  const searchTermValue = advancedSearchInput.value.trim().toLowerCase()

  return SEARCH_CATEGORIES.map((category) => {
    const categoryData = searchStore.categories.find((cat) => cat.kind === category.value)
    const terms = categoryData?.kindInfo?.terms || []

    const availableTerms = terms.filter((term) => {
      return isValidTerm(term) && !hasFilter(category.value, term)
    })

    const filteredTerms = availableTerms.filter((term) => {
      return (
        !searchTermValue || term.toLowerCase().includes(searchTermValue)
      )
    })

    const totalCount = filteredTerms.length
    const isExpanded = Boolean(expandedCategoryKinds.value[category.value])

    return {
      kind: category.value,
      label: category.label,
      terms: isExpanded ? filteredTerms : filteredTerms.slice(0, MAX_TERMS_PER_CATEGORY),
      totalCount,
      isExpanded,
    }
  }).filter((group) => group.terms.length > 0)
})

const handleToggleTerms = (kind: string) => {
  expandedCategoryKinds.value = {
    ...expandedCategoryKinds.value,
    [kind]: !expandedCategoryKinds.value[kind],
  }
}

const getGroupTermStartIndex = (groupIndex: number): number => {
  return filteredSearchTermsByCategory.value
    .slice(0, groupIndex)
    .reduce((acc, group) => acc + group.terms.length, 0)
}

const handleToggleTermsByKeyboard = async (kind: string, groupIndex: number) => {
  const wasExpanded = Boolean(expandedCategoryKinds.value[kind])
  handleToggleTerms(kind)
  await nextTick()

  if (!wasExpanded) {
    // When expanding from "... more", move focus to the first newly-revealed term.
    const firstRevealedIndex = getGroupTermStartIndex(groupIndex) + MAX_TERMS_PER_CATEGORY
    const revealedTerm = termButtonRefs.value[firstRevealedIndex]
    const revealedTermEl = (revealedTerm?.$el ?? revealedTerm) as HTMLElement | undefined
    revealedTermEl?.focus()
    return
  }

  // When collapsing from "Show less", keep focus on the toggle so next Tab
  // advances to the next category's first term.
  const toggleEl = toggleButtonRefs.value[groupIndex]
  toggleEl?.focus()
}

const getMatchingCount = <T extends SortableEntity>(items: T[], query: string): number => {
  const normalisedQuery = normaliseSearchText(query)
  // Return 0 for empty or punctuation-only input.
  if (!normalisedQuery.trim()) return 0
  // Use the raw query for filtering so counts match list page behaviour.
  return filterItemsByQuery({ query, items }).length
}

const exposuresCount = computed(() =>
  getMatchingCount(exposureStore.exposures, searchQueryInput.value.trim()),
)

const workspacesCount = computed(() =>
  getMatchingCount(workspaceStore.workspaces, searchQueryInput.value.trim()),
)

// Build a human-readable label for the types of term results currently shown,
// e.g. "an author", "a keyword", or "an author or keyword or publication reference".
// Returns null when no term groups are present (only exposure/workspace counts are shown).
const availableTermTypeLabel = computed<string | null>(() => {
  const kinds = new Set(filteredSearchTermsByCategory.value.map((g) => g.kind))
  const parts: string[] = []
  if (kinds.has('citation_author_family_name') || kinds.has('model_author')) parts.push('author')
  if (kinds.has('cellml_keyword')) parts.push('keyword')
  if (kinds.has('citation_id')) parts.push('publication reference')
  if (parts.length === 0) return null
  const formatPart = (part: string): string => (part === 'author' ? 'an author' : `a ${part}`)
  if (parts.length === 1) return formatPart(parts[0])
  const last = parts.pop()
  return `${parts.map(formatPart).join(' or ')} or ${formatPart(last ?? '')}`
})

const termTypeSuffix = computed(() =>
  availableTermTypeLabel.value ? ` or select ${availableTermTypeLabel.value} below` : '',
)

const hasResults = computed(() => {
  return (
    filteredSearchTermsByCategory.value.length > 0 ||
    exposuresCount.value > 0 ||
    workspacesCount.value > 0
  )
})

const isSuggestionsVisible = computed(() => {
  return isAdvancedOpen.value
})

const handleQuerySearch = (queryOverride?: string) => {
  const searchQuery = (queryOverride ?? searchQueryInput.value).trim()
  const filters = selectedFilters.value.map((filter) => ({ ...filter }))

  if (!searchQuery && filters.length === 0) {
    searchInputRef?.value?.inputRef?.focus()
    return
  }

  searchInputRef.value?.inputRef?.blur()
  isSearchFocused.value = false
  isAdvancedOpen.value = false
  advancedSearchInput.value = ''
  const request: SearchQueryRequest = {
    query: searchQuery || undefined,
    filters: filters.length > 0 ? filters : undefined,
  }
  emit('querySearch', request)
}

const handleSearchTermClick = (kind: string, term: string) => {
  const normalisedKind = kind.trim()
  const normalisedTerm = term.trim()
  if (!normalisedKind || !normalisedTerm || hasFilter(normalisedKind, normalisedTerm)) {
    searchInputRef.value?.inputRef?.focus()
    isSearchFocused.value = true
    return
  }

  selectedFilters.value = [...selectedFilters.value, { kind: normalisedKind, term: normalisedTerm }]
  advancedSearchInput.value = ''

  // Keep focus on the advanced combobox input for quick multi-selection.
  advancedSearchInputRef.value?.focus()
}

const handleRemoveChip = (chipId: string) => {
  selectedFilters.value = selectedFilters.value.filter(
    (filter) => `${filter.kind}:${filter.term}` !== chipId,
  )
  advancedSearchInputRef.value?.focus()
}

const buildListQuery = (): Record<string, string> => {
  const query: Record<string, string> = { filter: searchQueryInput.value.trim() }
  const currentSort = route.query.sort
  if (typeof currentSort === 'string' && currentSort.trim()) {
    query.sort = currentSort
  }
  return query
}

const handleExposuresClick = () => {
  handleBackdropClick()
  if (props.inOverlay) {
    emit('close')
  }
  router.push({ name: 'exposures', query: buildListQuery() })
}

const handleWorkspacesClick = () => {
  handleBackdropClick()
  if (props.inOverlay) {
    emit('close')
  }
  router.push({ name: 'workspaces', query: buildListQuery() })
}

const handleBackdropClick = () => {
  isAdvancedOpen.value = false
  advancedSearchInput.value = ''
}

const toggleAdvancedSearch = async () => {
  isAdvancedOpen.value = !isAdvancedOpen.value
  if (isAdvancedOpen.value) {
    await nextTick()
    advancedSearchInputRef.value?.focus()
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isAdvancedOpen.value) {
    handleBackdropClick()
    return
  }

  if (event.key === 'Tab' && hasResults.value) {
    const buttonEls = allSuggestionButtons.value
    if (buttonEls.length === 0) return

    const activeIndex = buttonEls.indexOf(event.target as HTMLElement)
    if (activeIndex === -1) return

    const advancedInputEl = advancedSearchInputRef.value
    event.preventDefault()

    if (event.shiftKey) {
      if (activeIndex === 0) {
        // Shift+Tab on first suggestion button → go back to advanced input.
        advancedInputEl?.focus()
      } else {
        buttonEls[activeIndex - 1]?.focus()
      }
    } else {
      if (activeIndex === buttonEls.length - 1) {
        // Tab on last suggestion button → cycle back to advanced input.
        advancedInputEl?.focus()
      } else {
        buttonEls[activeIndex + 1]?.focus()
      }
    }
  }
}

const handleSearchInputKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    handleQuerySearch()
  }
}

// Handle Tab/Shift+Tab key to cycle focus between combobox input and term buttons.
const handleAdvancedInputKeyDown = async (event: KeyboardEvent) => {
  if (event.key === 'Backspace' && advancedSearchInput.value.length === 0 && selectedFilters.value.length > 0) {
    event.preventDefault()
    selectedFilters.value = selectedFilters.value.slice(0, -1)
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    const fallbackQuery = searchQueryInput.value.trim() ? undefined : advancedSearchInput.value.trim()
    handleQuerySearch(fallbackQuery)
    return
  }

  if (event.key === 'Tab' && hasResults.value) {
    event.preventDefault()
    await nextTick()
    const buttonEls = allSuggestionButtons.value
    if (event.shiftKey) {
      // Shift+Tab on advanced input → go to last suggestion button.
      const lastButton = buttonEls[buttonEls.length - 1]
      if (lastButton) {
        lastButton.focus()
      }
    } else {
      // Tab on advanced input → go to first suggestion button.
      const firstButton = buttonEls[0]
      if (firstButton) {
        firstButton.focus()
      }
    }
  }
}

watch(isAdvancedOpen, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeyDown)
  } else {
    document.removeEventListener('keydown', handleKeyDown)
  }
})

watch(() => advancedSearchInput.value, () => {
  expandedCategoryKinds.value = {}
})

watch(filteredSearchTermsByCategory, () => {
  termButtonRefs.value = []
  toggleButtonRefs.value = []
  exposuresButtonRef.value = null
  workspacesButtonRef.value = null
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

defineExpose({
  searchInputRef,
})
</script>

<template>
  <div :class="`relative ${(isSearchFocused || isAdvancedOpen) ? 'z-100' : ''}`">
    <!-- Backdrop overlay (only when not in SearchOverlay). -->
    <div
      v-if="isAdvancedOpen && !props.inOverlay"
      class="fixed inset-0 bg-gray-400/75 dark:bg-gray-900/75 z-30"
      @click="handleBackdropClick"
    ></div>
    <div class="flex items-center gap-2 relative z-40">
      <SearchField
        ref="searchInputRef"
        v-model="searchQueryInput"
        placeholder="Start typing to search..."
        aria-label="Search term"
        class="flex-1"
        input-class="flex-1 min-w-0 outline-none focus:ring-0 px-4 py-2 border rounded-lg"
        :with-search-button="true"
        @focus="isSearchFocused = true"
        @blur="isSearchFocused = false"
        @search="handleQuerySearch"
        @keydown="handleSearchInputKeyDown"
      />
      <button
        type="button"
        class="shrink-0 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm cursor-pointer bg-background hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        :aria-expanded="isAdvancedOpen"
        @click="toggleAdvancedSearch"
      >
        Advanced search<span v-if="selectedFilters.length > 0"> ({{ selectedFilters.length }})</span>
      </button>
    </div>
    <div
      v-if="isSuggestionsVisible"
      :class="`top-full left-0 w-full z-40 ${props.inOverlay ? '' : 'absolute'}`"
      @mousedown.prevent
    >
      <div class="mt-2 box box-small overflow-hidden !shadow-none !p-0">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Add structured filters in advanced search. Press Enter to search with filters and query text.
          </p>
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-background">
            <div class="flex flex-wrap items-center gap-2">
              <div
                v-for="chip in selectedFilterChips"
                :key="chip.id"
                class="inline-flex items-center gap-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2.5 py-1 text-xs"
              >
                <span>{{ chip.label }}</span>
                <CloseButton
                  @click="handleRemoveChip(chip.id)"
                  :aria-label="`Remove ${chip.label}`"
                />
              </div>
              <input
                ref="advancedSearchInputRef"
                v-model="advancedSearchInput"
                type="text"
                placeholder="Filter terms..."
                aria-label="Advanced search filter"
                class="flex-1 min-w-40 outline-none bg-transparent text-sm"
                @keydown="handleAdvancedInputKeyDown"
              />
            </div>
          </div>
        </div>
        <div v-if="categoriesError" class="error-box">
          <p class="text-sm">
            {{ categoriesError }}
          </p>
        </div>
        <div v-else-if="isLoading" class="p-4">
          <p class="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
        <div v-else-if="!hasResults" class="p-4">
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            No terms found for
            <span class="text-gray-700 dark:text-gray-200 font-semibold">"{{ advancedSearchInput }}"</span>.
            <SearchEnterHint :query="searchQueryInput" />
          </p>
        </div>
        <div v-else class="max-h-96 bg-background overflow-y-auto scrollbar-thin">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              <SearchEnterHint :query="searchQueryInput" :suffix="termTypeSuffix" />
            </p>
          </div>
          <div class="group/results">
            <div
              v-for="(categoryGroup, groupIndex) in filteredSearchTermsByCategory"
              :key="categoryGroup.kind"
              class="result-group"
            >
              <div class="mb-3 flex items-start justify-between gap-3">
                <h4 class="font-semibold text-gray-700 dark:text-gray-300">
                  {{ categoryGroup.label }}
                </h4>
                <button
                  v-if="categoryGroup.totalCount > MAX_TERMS_PER_CATEGORY"
                  type="button"
                  :ref="(el) => setToggleButtonRef(el, groupIndex)"
                  class="px-3 py-1 text-sm rounded-md transition-colors relative focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900 cursor-pointer text-primary hover:text-primary-hover bg-transparent"
                  :aria-expanded="categoryGroup.isExpanded"
                  @click="handleToggleTerms(categoryGroup.kind)"
                  @keydown.enter.prevent="handleToggleTermsByKeyboard(categoryGroup.kind, groupIndex)"
                >
                  {{ categoryGroup.isExpanded ? 'Show less' : '... more' }}
                </button>
              </div>
              <div class="flex flex-row items-start justify-start flex-wrap gap-2">
                <TermButton
                  v-for="(term, termIndex) in categoryGroup.terms"
                  :key="term"
                  :ref="(el) => setTermButtonRef(el, filteredSearchTermsByCategory.slice(0, groupIndex).reduce((acc, g) => acc + g.terms.length, 0) + termIndex)"
                  :term="term"
                  @click="handleSearchTermClick(categoryGroup.kind, term)"
                />
              </div>
            </div>
            <div
              v-if="exposuresCount > 0"
              class="result-group"
            >
              <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Exposures
              </h4>
              <button
                type="button"
                ref="exposuresButtonRef"
                class="cursor-pointer text-primary hover:text-primary-hover transition-colors"
                @click="handleExposuresClick"
              >
                See {{ formatNumber(exposuresCount) }} matching exposure{{ exposuresCount !== 1 ? 's' : '' }}
              </button>
            </div>
            <div
              v-if="workspacesCount > 0"
              class="result-group"
            >
              <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Workspaces
              </h4>
              <button
                type="button"
                ref="workspacesButtonRef"
                class="cursor-pointer text-primary hover:text-primary-hover transition-colors"
                @click="handleWorkspacesClick"
              >
                See {{ formatNumber(workspacesCount) }} matching workspace{{ workspacesCount !== 1 ? 's' : '' }}
              </button>
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

.result-group {
  @apply hover:bg-gray-50 dark:hover:bg-gray-900 border-b last:border-0 border-gray-200 dark:border-gray-700 p-4 transition-all group-hover/results:opacity-75 hover:!opacity-100;
}
</style>
