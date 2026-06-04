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
import SearchField from '@/components/atoms/SearchField.vue'
import TermButton from '@/components/atoms/TermButton.vue'
import SearchSuggestions from '@/components/molecules/SearchSuggestions.vue'
import { SEARCH_CATEGORIES } from '@/constants/search'
import { useExposureStore } from '@/stores/exposure'
import { useSearchStore } from '@/stores/search'
import { useWorkspaceStore } from '@/stores/workspace'
import type { SortableEntity } from '@/types/common'
import { formatNumber, formatSearchKey } from '@/utils/format'
import { filterItemsByQuery, isValidTerm, normaliseSearchText } from '@/utils/search'

const props = defineProps<{
  initialTerm: string
  initialKind: string
  inOverlay?: boolean
}>()

const emit = defineEmits<{
  (e: 'search', searchKind: string, searchTerm: string): void
  (e: 'querySearch', query: string): void
  (e: 'close'): void
}>()

const router = useRouter()
const route = useRoute()
const searchStore = useSearchStore()
const exposureStore = useExposureStore()
const workspaceStore = useWorkspaceStore()

const MAX_TERMS_PER_CATEGORY = 10

const searchInput = ref<string>(props.initialTerm)

watch(
  () => props.initialTerm,
  (newTerm) => {
    searchInput.value = newTerm
  },
)
const searchInputRef = ref<InstanceType<typeof SearchField> | null>(null)
const isSearchFocused = ref(false)
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

const setExposuresButtonRef = (el: HTMLButtonElement | null) => {
  exposuresButtonRef.value = el
}

const setWorkspacesButtonRef = (el: HTMLButtonElement | null) => {
  workspacesButtonRef.value = el
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

const filteredSearchTermsByCategory = computed(() => {
  const searchTermValue = searchInput.value.trim().toLowerCase()
  if (!searchTermValue) return []

  return SEARCH_CATEGORIES.map((category) => {
    const categoryData = searchStore.categories.find((cat) => cat.kind === category.value)
    const terms = categoryData?.kindInfo?.terms || []

    const filteredTerms = terms.filter(
      (term) => isValidTerm(term) && term.toLowerCase().includes(searchTermValue),
    )

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
  getMatchingCount(exposureStore.exposures, searchInput.value.trim()),
)

const workspacesCount = computed(() =>
  getMatchingCount(workspaceStore.workspaces, searchInput.value.trim()),
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
  if (!searchInput.value.trim()) return false
  return props.inOverlay ? true : isSearchFocused.value
})

const formattedSearchInput = computed(() => formatSearchKey(searchInput.value))

const handleQuerySearch = () => {
  const searchQuery = searchInput.value.trim()
  if (!searchQuery) {
    searchInputRef?.value?.inputRef?.focus()
    return
  }

  searchInputRef.value?.inputRef?.blur()
  isSearchFocused.value = false
  emit('querySearch', searchQuery)
}

const handleSearchTermClick = (kind: string, term: string) => {
  // Blur the input to close the dropdown.
  searchInputRef.value?.inputRef?.blur()
  isSearchFocused.value = false
  emit('search', kind, term)
}

const buildListQuery = (): Record<string, string> => {
  const query: Record<string, string> = { filter: searchInput.value.trim() }
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
  // Blur the input to close the dropdown.
  searchInputRef.value?.inputRef?.blur()
  isSearchFocused.value = false
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && searchInput.value.trim().length > 0) {
    handleBackdropClick()
    return
  }

  if (event.key === 'Tab' && hasResults.value) {
    const buttonEls = allSuggestionButtons.value
    if (buttonEls.length === 0) return

    const activeIndex = buttonEls.indexOf(event.target as HTMLElement)
    if (activeIndex === -1) return

    const searchInputEl = searchInputRef.value?.inputRef
    event.preventDefault()

    if (event.shiftKey) {
      if (activeIndex === 0) {
        // Shift+Tab on first suggestion button → go back to search input.
        searchInputEl?.focus()
      } else {
        buttonEls[activeIndex - 1]?.focus()
      }
    } else {
      if (activeIndex === buttonEls.length - 1) {
        // Tab on last suggestion button → cycle back to search input.
        searchInputEl?.focus()
      } else {
        buttonEls[activeIndex + 1]?.focus()
      }
    }
  }
}

// Handle Tab/Shift+Tab key to cycle focus between search input and term buttons.
const handleSearchInputKeyDown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    handleQuerySearch()
    return
  }

  if (event.key === 'Tab' && hasResults.value) {
    event.preventDefault()
    await nextTick()
    const buttonEls = allSuggestionButtons.value
    if (event.shiftKey) {
      // Shift+Tab on search input → go to last suggestion button.
      const lastButton = buttonEls[buttonEls.length - 1]
      if (lastButton) {
        lastButton.focus()
        isSearchFocused.value = true
      }
    } else {
      // Tab on search input → go to first suggestion button.
      const firstButton = buttonEls[0]
      if (firstButton) {
        firstButton.focus()
        isSearchFocused.value = true
      }
    }
  }
}

watch(isSearchFocused, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeyDown)
  } else {
    document.removeEventListener('keydown', handleKeyDown)
  }
})

watch(
  () => searchInput.value,
  () => {
    expandedCategoryKinds.value = {}
  },
)

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
  <div :class="`relative ${isSearchFocused ? 'z-100' : ''}`">
    <!-- Backdrop overlay (only when not in SearchOverlay). -->
    <div
      v-if="isSearchFocused && searchInput.trim().length > 0 && !props.inOverlay"
      class="fixed inset-0 bg-gray-400/75 dark:bg-gray-900/75 z-30"
      @click="handleBackdropClick"
    ></div>
    <div
      class="flex items-center bg-background justify-between w-full border rounded-lg transition-all relative z-40 overflow-hidden"
      :class="isSearchFocused ? 'ring-1 ring-primary border-primary' : 'border-gray-200 dark:border-gray-700'"
    >
      <SearchField
        ref="searchInputRef"
        v-model="searchInput"
        placeholder="Start typing to search..."
        aria-label="Search term"
        class="flex-1"
        input-class="flex-1 min-w-0 outline-none focus:ring-0 px-4 py-2"
        :with-search-button="true"
        @focus="isSearchFocused = true"
        @blur="isSearchFocused = false"
        @search="handleQuerySearch"
        @keydown="handleSearchInputKeyDown"
      />
    </div>
    <SearchSuggestions
      :is-suggestions-visible="isSuggestionsVisible"
      :in-overlay="props.inOverlay"
      :categories-error="categoriesError"
      :is-loading="isLoading"
      :has-results="hasResults"
      :search-input="searchInput"
      :formatted-search-input="formattedSearchInput"
      :term-type-suffix="termTypeSuffix"
      :filtered-search-terms-by-category="filteredSearchTermsByCategory"
      :max-terms-per-category="MAX_TERMS_PER_CATEGORY"
      :exposures-count="exposuresCount"
      :workspaces-count="workspacesCount"
      :set-toggle-button-ref="setToggleButtonRef"
      :set-term-button-ref="setTermButtonRef"
      :set-exposures-button-ref="setExposuresButtonRef"
      :set-workspaces-button-ref="setWorkspacesButtonRef"
      @toggle-terms="handleToggleTerms"
      @toggle-terms-by-keyboard="handleToggleTermsByKeyboard"
      @search-term-click="handleSearchTermClick"
      @exposures-click="handleExposuresClick"
      @workspaces-click="handleWorkspacesClick"
    />
  </div>
</template>

