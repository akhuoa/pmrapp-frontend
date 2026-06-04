<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import SearchField from '@/components/atoms/SearchField.vue'
import SearchSuggestions from '@/components/molecules/SearchSuggestions.vue'

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

const searchInput = ref<string>(props.initialTerm)

watch(
  () => props.initialTerm,
  (newTerm) => {
    searchInput.value = newTerm
  },
)

const searchInputRef = ref<InstanceType<typeof SearchField> | null>(null)
const suggestionButtonRefs = ref<(HTMLElement | ComponentPublicInstance | null)[]>([])
const isSearchFocused = ref(false)
const showAdvancedSearch = ref(false)
const MAX_TERMS_PER_CATEGORY = 10

const setSuggestionButtonRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el) {
    suggestionButtonRefs.value[index] = el as HTMLElement | ComponentPublicInstance
  }
}

const allSuggestionButtons = computed<HTMLElement[]>(() => {
  return suggestionButtonRefs.value
    .map((ref) => {
      if (!ref) return undefined
      return (ref as any).$el ?? (ref as HTMLElement)
    })
    .filter(Boolean) as HTMLElement[]
})

const isSuggestionsVisible = computed(() => {
  if (!showAdvancedSearch.value) return false
  return props.inOverlay || showAdvancedSearch.value
})

const handleQuerySearch = () => {
  const searchQuery = searchInput.value.trim()
  if (!searchQuery) {
    searchInputRef?.value?.inputRef?.focus()
    return
  }

  searchInputRef.value?.inputRef?.blur()
  isSearchFocused.value = false
  showAdvancedSearch.value = false
  emit('querySearch', searchQuery)
}

const handleSearchTermClick = (kind: string, term: string) => {
  searchInputRef.value?.inputRef?.blur()
  isSearchFocused.value = false
  showAdvancedSearch.value = false
  emit('search', kind, term)
}

const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value
}

const handleBackdropClick = () => {
  searchInputRef.value?.inputRef?.blur()
  isSearchFocused.value = false
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && searchInput.value.trim().length > 0) {
    handleBackdropClick()
    return
  }

  if (event.key === 'Tab' && isSuggestionsVisible.value) {
    const buttonEls = allSuggestionButtons.value
    if (buttonEls.length === 0) return

    const activeIndex = buttonEls.indexOf(event.target as HTMLElement)
    if (activeIndex === -1) return

    const searchInputEl = searchInputRef.value?.inputRef
    event.preventDefault()

    if (event.shiftKey) {
      if (activeIndex === 0) {
        searchInputEl?.focus()
      } else {
        buttonEls[activeIndex - 1]?.focus()
      }
    } else {
      if (activeIndex === buttonEls.length - 1) {
        searchInputEl?.focus()
      } else {
        buttonEls[activeIndex + 1]?.focus()
      }
    }
  }
}

const handleSearchInputKeyDown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    handleQuerySearch()
    return
  }

  if (event.key === 'Tab' && isSuggestionsVisible.value) {
    event.preventDefault()
    await nextTick()
    const buttonEls = allSuggestionButtons.value
    if (event.shiftKey) {
      const lastButton = buttonEls[buttonEls.length - 1]
      if (lastButton) {
        lastButton.focus()
        isSearchFocused.value = true
      }
    } else {
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
    suggestionButtonRefs.value = []
  },
)

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
      v-if="((isSearchFocused && searchInput.trim().length > 0) || showAdvancedSearch) && !props.inOverlay"
      class="fixed inset-0 bg-gray-400/75 dark:bg-gray-900/75 z-100"
      @click="handleBackdropClick"
    ></div>
    <div
      class="flex items-center bg-background justify-between w-full border rounded-lg transition-all relative z-200 overflow-hidden"
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
        :with-advanced-button="true"
        :advanced-search-active="showAdvancedSearch"
        @focus="isSearchFocused = true"
        @blur="isSearchFocused = false"
        @search="handleQuerySearch"
        @keydown="handleSearchInputKeyDown"
        @advanced-search="toggleAdvancedSearch"
      />
    </div>
    <SearchSuggestions
      :is-suggestions-visible="isSuggestionsVisible"
      :in-overlay="props.inOverlay"
      :search-input="searchInput"
      :max-terms-per-category="MAX_TERMS_PER_CATEGORY"
      :set-suggestion-button-ref="setSuggestionButtonRef"
      @search-term-click="handleSearchTermClick"
    />
  </div>
</template>

