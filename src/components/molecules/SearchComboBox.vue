<script setup lang="ts">
import { computed, nextTick, onMounted, ref, type Component } from 'vue'
import Chip from '@/components/atoms/Chip.vue'
import CloseButton from '@/components/atoms/CloseButton.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import UserIcon from '@/components/icons/UserIcon.vue'
import CodeIcon from '@/components/icons/CodeIcon.vue'
import FileIcon from '@/components/icons/FileIcon.vue'
import { SEARCH_CATEGORIES, SEARCH_KIND_LABEL_SINGULAR_MAP } from '@/constants/search'
import { useSearchStore } from '@/stores/search'
import type { SearchFilter, SearchQueryRequest } from '@/types/search'

interface FilterChip {
  id: string
  kind: string
  term: string
  displayLabel: string
}

const props = withDefaults(
  defineProps<{
    initialQuery?: string
    initialFilters?: SearchFilter[]
    inOverlay?: boolean
  }>(),
  {
    initialQuery: '',
    initialFilters: () => [],
  },
)

const emit = defineEmits<{
  (e: 'querySearch', request: SearchQueryRequest): void
  (e: 'close'): void
}>()

const searchStore = useSearchStore()

// ---- Refs ----
const inputRef = ref<HTMLInputElement | null>(null)
const wrapperRef = ref<HTMLDivElement | null>(null)
const chips = ref<FilterChip[]>([])
const currentInput = ref('')
const showCategoryMenu = ref(false)
const selectedCategoryKind = ref<string | null>(null)
const showTermSuggestions = ref(false)
const termSuggestions = ref<string[]>([])
const activeSuggestionIndex = ref(-1)
const categoryMenuActiveIndex = ref(-1)
const isFocused = ref(false)

// ---- Computed ----
const hasValues = computed(() => {
  return chips.value.length > 0 || currentInput.value.trim().length > 0
})

const categoryPrefix = computed(() => {
  if (!selectedCategoryKind.value) return ''
  return SEARCH_KIND_LABEL_SINGULAR_MAP[selectedCategoryKind.value] || selectedCategoryKind.value
})

const categoryMenuItems = computed(() => SEARCH_CATEGORIES)

const showDropdown = computed(() => showCategoryMenu.value || showTermSuggestions.value)

const categoryIcons: Record<string, Component> = {
  citation_author_family_name: UserIcon,
  model_author: UserIcon,
  cellml_keyword: CodeIcon,
  citation_id: FileIcon,
}

// ---- Helpers ----
function getDisplayLabel(kind: string, term: string): string {
  const singularLabel = SEARCH_KIND_LABEL_SINGULAR_MAP[kind] || kind
  return `${singularLabel}: ${term}`
}

function generateChipId(): string {
  return `${Date.now()}:${Math.random().toString(36).slice(2, 8)}`
}

function focusInput() {
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// ---- Initialisation ----
function initialiseFromProps() {
  if (props.initialFilters.length > 0) {
    chips.value = props.initialFilters
      .filter((f) => f.kind && f.term)
      .map((f) => ({
        id: generateChipId(),
        kind: f.kind,
        term: f.term,
        displayLabel: getDisplayLabel(f.kind, f.term),
      }))
  }
  if (props.initialQuery) {
    currentInput.value = props.initialQuery
  }
}

onMounted(async () => {
  initialiseFromProps()

  // Pre-fetch categories for term suggestions
  try {
    const validKinds = SEARCH_CATEGORIES.map((c) => c.value)
    await searchStore.fetchCategories(validKinds)
  } catch (err) {
    console.error('Failed to fetch search categories:', err)
  }
})

// ---- Dropdown helpers ----
function filterTermSuggestions(inputText: string) {
  if (!selectedCategoryKind.value) {
    termSuggestions.value = []
    showTermSuggestions.value = false
    return
  }

  const category = searchStore.categories.find((c) => c.kind === selectedCategoryKind.value)
  const terms = (category?.kindInfo?.terms || []).filter((t) => t.trim().length > 0)

  if (!inputText.trim()) {
    termSuggestions.value = terms.slice(0, 50)
    showTermSuggestions.value = terms.length > 0
    activeSuggestionIndex.value = -1
    return
  }

  const filtered = terms
    .filter((t) => t.toLowerCase().includes(inputText.toLowerCase()))
    .slice(0, 50)

  termSuggestions.value = filtered
  showTermSuggestions.value = filtered.length > 0
  activeSuggestionIndex.value = -1
}

// ---- Category selection ----
function selectCategory(category: (typeof SEARCH_CATEGORIES)[number]) {
  selectedCategoryKind.value = category.value
  showCategoryMenu.value = false
  currentInput.value = ''
  termSuggestions.value = []
  showTermSuggestions.value = true
  activeSuggestionIndex.value = -1

  // Populate initial suggestions
  filterTermSuggestions('')

  focusInput()
}

function handleCategoryClick(category: (typeof SEARCH_CATEGORIES)[number]) {
  selectCategory(category)
}

function cancelCategorySelection() {
  selectedCategoryKind.value = null
  showTermSuggestions.value = false
  termSuggestions.value = []
  activeSuggestionIndex.value = -1
  focusInput()
}

// ---- Term selection ----
function selectTerm(term: string) {
  if (!selectedCategoryKind.value) return

  chips.value.push({
    id: generateChipId(),
    kind: selectedCategoryKind.value,
    term,
    displayLabel: getDisplayLabel(selectedCategoryKind.value, term),
  })

  selectedCategoryKind.value = null
  showTermSuggestions.value = false
  currentInput.value = ''
  termSuggestions.value = []
  activeSuggestionIndex.value = -1

  // Return to category menu so user can add another filter.
  showCategoryMenu.value = true
  categoryMenuActiveIndex.value = -1
  focusInput()
}

function removeChip(id: string) {
  chips.value = chips.value.filter((c) => c.id !== id)
  focusInput()
}

// ---- Clear ----
function clearAll() {
  chips.value = []
  currentInput.value = ''
  selectedCategoryKind.value = null
  showCategoryMenu.value = false
  showTermSuggestions.value = false
  termSuggestions.value = []
  focusInput()
}

// ---- Search ----
function executeSearch() {
  const queryText = currentInput.value.trim()
  const filters: SearchFilter[] = chips.value.map((c) => ({ kind: c.kind, term: c.term }))

  if (!queryText && filters.length === 0) {
    focusInput()
    return
  }

  inputRef.value?.blur()
  showCategoryMenu.value = false
  showTermSuggestions.value = false
  selectedCategoryKind.value = null

  const request: SearchQueryRequest = {
    query: queryText || undefined,
    filters: filters.length > 0 ? filters : undefined,
  }

  emit('querySearch', request)
}

// ---- Event handlers ----
function handleFocus() {
  isFocused.value = true
  if (!selectedCategoryKind.value && !showTermSuggestions.value) {
    showCategoryMenu.value = true
    categoryMenuActiveIndex.value = -1
  }
}

function handleBlur(event: FocusEvent) {
  const relatedTarget = event.relatedTarget as HTMLElement | null
  // Keep dropdown open if focus moves inside the wrapper (e.g. clicking a dropdown item)
  if (relatedTarget && wrapperRef.value?.contains(relatedTarget)) {
    return
  }
  isFocused.value = false
  showCategoryMenu.value = false
  showTermSuggestions.value = false
}

function handleInput(_event: Event) {
  const input = _event.target as HTMLInputElement
  currentInput.value = input.value

  if (selectedCategoryKind.value) {
    filterTermSuggestions(input.value)
  }
}

function handleKeydown(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement

  // ---- Escape ----
  if (event.key === 'Escape') {
    if (showTermSuggestions.value && selectedCategoryKind.value) {
      // Go back to category menu.
      cancelCategorySelection()
      showCategoryMenu.value = true
      categoryMenuActiveIndex.value = -1
      event.preventDefault()
      return
    }
    if (showCategoryMenu.value) {
      showCategoryMenu.value = false
      event.preventDefault()
      return
    }
    emit('close')
    return
  }

  // ---- Tab ----
  if (event.key === 'Tab' && showDropdown.value) {
    showCategoryMenu.value = false
    showTermSuggestions.value = false
    if (selectedCategoryKind.value) {
      selectedCategoryKind.value = null
    }
    return
  }

  // ---- Arrow navigation ----
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (showCategoryMenu.value) {
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      const items = categoryMenuItems.value
      const maxIndex = items.length - 1
      const nextIndex = categoryMenuActiveIndex.value + delta
      categoryMenuActiveIndex.value = nextIndex < 0 ? maxIndex : nextIndex > maxIndex ? 0 : nextIndex
      return
    }
    if (showTermSuggestions.value && termSuggestions.value.length > 0) {
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      const maxIndex = termSuggestions.value.length - 1
      const nextIndex = activeSuggestionIndex.value + delta
      activeSuggestionIndex.value = nextIndex < 0 ? maxIndex : nextIndex > maxIndex ? 0 : nextIndex
      return
    }
    return
  }

  // ---- Enter ----
  if (event.key === 'Enter') {
    if (showCategoryMenu.value && categoryMenuActiveIndex.value >= 0) {
      event.preventDefault()
      selectCategory(categoryMenuItems.value[categoryMenuActiveIndex.value])
      return
    }
    if (showTermSuggestions.value && activeSuggestionIndex.value >= 0) {
      event.preventDefault()
      selectTerm(termSuggestions.value[activeSuggestionIndex.value])
      return
    }
    if (showCategoryMenu.value) {
      showCategoryMenu.value = false
      event.preventDefault()
      return
    }
    if (showTermSuggestions.value && selectedCategoryKind.value) {
      event.preventDefault()
      const term = currentInput.value.trim()
      if (term && termSuggestions.value.some((t) => t.toLowerCase() === term.toLowerCase())) {
        // Exact match found in suggestions.
        selectTerm(term)
      } else if (term) {
        // No matching term — keep text as keyword query, cancel category.
        cancelCategorySelection()
        showCategoryMenu.value = true
        categoryMenuActiveIndex.value = -1
      } else {
        cancelCategorySelection()
        showCategoryMenu.value = true
        categoryMenuActiveIndex.value = -1
      }
      return
    }
    // Perform search
    event.preventDefault()
    executeSearch()
    return
  }

  // ---- Backspace ----
  if (event.key === 'Backspace') {
    // If cursor is at the very beginning and input is empty, remove last chip or cancel category
    if (input.selectionStart === 0 && input.selectionEnd === 0 && currentInput.value === '') {
      if (selectedCategoryKind.value) {
        cancelCategorySelection()
      } else if (chips.value.length > 0) {
        chips.value.pop()
      }
      event.preventDefault()
      return
    }
    return
  }


}

function handleCategoryMouseEnter(index: number) {
  categoryMenuActiveIndex.value = index
}

function handleTermMouseEnter(index: number) {
  activeSuggestionIndex.value = index
}
</script>

<template>
  <div ref="wrapperRef" class="relative">
    <!--
      Main search bar: chips + active category prefix + text input + clear button + search button
    -->
    <div
      class="flex items-center w-full border rounded-lg overflow-hidden transition-all bg-background"
      :class="isFocused ? 'ring-1 ring-primary border-primary' : 'border-gray-200 dark:border-gray-700'"
      @click="focusInput"
    >
      <!-- Chips + input area -->
      <div class="flex-1 flex items-center flex-wrap gap-1 px-3 py-1 min-h-[2.5rem]">
        <!-- Existing filter chips -->
        <Chip
          v-for="chip in chips"
          :key="chip.id"
          :label="chip.displayLabel"
          :removable="true"
          :on-remove="() => removeChip(chip.id)"
        />

        <!-- Active category prefix label (non-editable) -->
        <span
          v-if="selectedCategoryKind"
          class="text-sm font-medium text-gray-600 dark:text-gray-300 shrink-0 select-none"
        >
          {{ categoryPrefix }}:
        </span>

        <!-- Text input -->
        <input
          ref="inputRef"
          :value="currentInput"
          type="text"
          class="flex-1 min-w-[120px] outline-none border-none bg-transparent px-1 py-1 text-sm"
          :class="{ 'pl-0': selectedCategoryKind !== null || chips.length > 0 }"
          placeholder="Start typing to search..."
          @input="handleInput"
          @keydown="handleKeydown"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </div>

      <!-- Clear button -->
      <button
        v-if="hasValues"
        class="flex items-center justify-center px-2 py-1 shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
        aria-label="Clear search"
        type="button"
        @click.stop="clearAll"
      >
        <CloseButton class="w-4 h-4" />
      </button>

      <!-- Search button -->
      <button
        type="button"
        class="flex items-center justify-center px-4 py-3 shrink-0 border-l border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 cursor-pointer transition duration-200 ease-linear focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
        :class="hasValues ? '' : 'opacity-50 cursor-default'"
        :disabled="!hasValues"
        aria-label="Search"
        @click.stop="executeSearch"
      >
        <SearchIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Category menu dropdown (shown on focus) -->
    <div
      v-if="showCategoryMenu"
      class="absolute z-50 left-0 mt-1 w-80 min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      @mousedown.prevent="focusInput"
    >
      <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
        Filter by category
      </div>
      <div class="max-h-80 overflow-y-auto">
      <button
        v-for="(cat, index) in categoryMenuItems"
        :key="cat.value"
        type="button"
        class="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors cursor-pointer focus:outline-none"
        :class="categoryMenuActiveIndex === index ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-750'"
        @click="handleCategoryClick(cat)"
        @mouseenter="handleCategoryMouseEnter(index)"
      >
        <component :is="categoryIcons[cat.value]" class="w-4 h-4 shrink-0 text-gray-500 dark:text-gray-400" />
        <span class="font-medium text-gray-800 dark:text-gray-200">{{ cat.label }}</span>
      </button>
    </div>
    </div>

    <!-- Term suggestions dropdown (shown when typing a filter value) -->
    <div
      v-if="showTermSuggestions"
      class="absolute z-50 left-0 mt-1 w-80 min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      @mousedown.prevent="focusInput"
    >
      <div class="max-h-80 overflow-y-auto">
        <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
          {{ categoryPrefix }} suggestions
        </div>
        <div
          v-if="termSuggestions.length === 0"
          class="px-4 py-3 text-sm text-gray-400 dark:text-gray-500"
        >
          No matching terms found
        </div>
        <button
          v-for="(term, index) in termSuggestions"
          :key="term"
          type="button"
          class="w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer focus:outline-none truncate"
          :class="activeSuggestionIndex === index ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-750'"
          @click="selectTerm(term)"
          @mouseenter="handleTermMouseEnter(index)"
        >
          {{ term }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
</style>
