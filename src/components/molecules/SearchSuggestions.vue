<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import SearchEnterHint from '@/components/atoms/SearchEnterHint.vue'
import TermButton from '@/components/atoms/TermButton.vue'
import { SEARCH_CATEGORIES } from '@/constants/search'
import { useSearchStore } from '@/stores/search'
import { isValidTerm } from '@/utils/search'
import { formatSearchKey } from '@/utils/format'

const props = defineProps<{
  isSuggestionsVisible: boolean
  inOverlay?: boolean
  searchInput: string
}>()

const emit = defineEmits<{
  (e: 'searchTermClick', kind: string, term: string): void
  (e: 'focusSearchInput'): void
  (e: 'escape'): void
}>()

const searchStore = useSearchStore()
const termsFilter = ref<string>('')
const formattedTermsFilter = computed(() => formatSearchKey(termsFilter.value))
const categoriesError = ref<string | null>(null)
const expandedCategoryKinds = ref<Record<string, boolean>>({})
const filterInputRef = ref<HTMLInputElement | null>(null)
const termButtonRefs = ref<InstanceType<typeof TermButton>[]>([])
const toggleButtonRefs = ref<(HTMLButtonElement | null)[]>([])
const MAX_TERMS_PER_CATEGORY = 10

const setTermButtonRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el) {
    termButtonRefs.value[index] = el as InstanceType<typeof TermButton>
  }
}

const setToggleButtonRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  toggleButtonRefs.value[index] = el as HTMLButtonElement | null
}

const filteredSearchTermsByCategory = computed(() => {
  const searchTermValue = termsFilter.value.trim().toLowerCase()
  const shouldFilterByInput = Boolean(searchTermValue)

  return SEARCH_CATEGORIES.map((category) => {
    const categoryData = searchStore.categories.find((cat) => cat.kind === category.value)
    const terms = categoryData?.kindInfo?.terms || []

    const filteredTerms = terms.filter((term) => {
      if (!isValidTerm(term)) return false
      if (!shouldFilterByInput) return true
      return term.toLowerCase().includes(searchTermValue)
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

const getTermIndexInFlattenedList = (groupIndex: number, termIndex: number): number => {
  const priorTermsCount = filteredSearchTermsByCategory.value
    .slice(0, groupIndex)
    .reduce((acc, group) => acc + group.terms.length, 0)

  return priorTermsCount + termIndex
}

const getGroupTermStartIndex = (groupIndex: number): number => {
  const priorTermsCount = filteredSearchTermsByCategory.value
    .slice(0, groupIndex)
    .reduce((acc, group) => acc + group.terms.length, 0)

  return priorTermsCount
}

onMounted(async () => {
  const validKinds = SEARCH_CATEGORIES.map((cat) => cat.value)

  try {
    await searchStore.fetchCategories(validKinds)
  } catch (err) {
    categoriesError.value = 'Failed to fetch search categories.'
    console.error('Failed to fetch search categories:', err)
  }
})

const isLoading = computed(
  () => searchStore.isLoading || searchStore.categories.some((cat) => cat.loading),
)

const handleToggleTerms = (kind: string) => {
  expandedCategoryKinds.value = {
    ...expandedCategoryKinds.value,
    [kind]: !expandedCategoryKinds.value[kind],
  }
}

const handleToggleTermsByKeyboard = async (kind: string, groupIndex: number) => {
  const wasExpanded = Boolean(expandedCategoryKinds.value[kind])
  handleToggleTerms(kind)
  await nextTick()

  if (!wasExpanded) {
    // Move focus to first newly revealed term after expanding from "... more".
    const firstRevealedIndex = getGroupTermStartIndex(groupIndex) + MAX_TERMS_PER_CATEGORY
    const revealedTerm = termButtonRefs.value[firstRevealedIndex]
    const revealedTermEl = (revealedTerm?.$el ?? revealedTerm) as HTMLElement | undefined
    revealedTermEl?.focus()
    return
  }

  const toggleEl = toggleButtonRefs.value[groupIndex]
  toggleEl?.focus()
}

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

const allSuggestionButtons = computed<HTMLElement[]>(() => {
  const buttons: HTMLElement[] = []
  let termOffset = 0

  filteredSearchTermsByCategory.value.forEach((group, groupIndex) => {
    const termEls = termButtonRefs.value
      .slice(termOffset, termOffset + group.terms.length)
      .map((ref) => (ref?.$el ?? ref) as HTMLElement | undefined)
      .filter(Boolean) as HTMLElement[]

    buttons.push(...termEls)
    termOffset += group.terms.length

    const toggleEl = toggleButtonRefs.value[groupIndex]
    if (group.totalCount > MAX_TERMS_PER_CATEGORY && toggleEl) {
      buttons.push(toggleEl)
    }
  })

  return buttons
})

const hasResults = computed(() => filteredSearchTermsByCategory.value.length > 0)

const focusSearchInput = () => {
  emit('focusSearchInput')
}

const handleEscape = () => {
  emit('escape')
}

const handleSuggestionButtonKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    handleEscape()
    return
  }

  if (event.key !== 'Tab') return
  if (!hasResults.value) return

  const buttons = allSuggestionButtons.value
  if (buttons.length === 0) return

  const activeIndex = buttons.indexOf(event.target as HTMLElement)
  if (activeIndex === -1) return

  event.preventDefault()

  if (event.shiftKey) {
    if (activeIndex === 0) {
      filterInputRef.value?.focus()
    } else {
      buttons[activeIndex - 1]?.focus()
    }
    return
  }

  if (activeIndex === buttons.length - 1) {
    focusSearchInput()
  } else {
    buttons[activeIndex + 1]?.focus()
  }
}

const handleFilterInputKeyDown = async (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    handleEscape()
    return
  }

  if (event.key !== 'Tab') return
  if (!hasResults.value) return

  if (event.shiftKey) {
    return
  }

  event.preventDefault()
  await nextTick()

  const buttons = allSuggestionButtons.value
  if (buttons.length === 0) return

  buttons[0]?.focus()
}

watch(
  () => props.searchInput,
  () => {
    expandedCategoryKinds.value = {}
    termsFilter.value = ''
  },
)

watch(filteredSearchTermsByCategory, () => {
  termButtonRefs.value = []
  toggleButtonRefs.value = []
})

const handleSearchTermClick = (kind: string, term: string) => {
  emit('searchTermClick', kind, term)
}
</script>

<template>
  <div
    v-if="isSuggestionsVisible"
    :class="`top-full left-0 w-full z-200 ${inOverlay ? '' : 'absolute'}`"
  >
    <div class="mt-2 box box-small overflow-hidden !shadow-none !p-0">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <input
          ref="filterInputRef"
          type="search"
          name="termsFilter"
          placeholder="Filter terms..."
          class="input-field input-field-sm"
          v-model="termsFilter"
          @keydown="handleFilterInputKeyDown"
        />
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
          No authors or keywords found for
          <span v-html="formattedTermsFilter"></span>.
          <SearchEnterHint :query="props.searchInput" />
        </p>
      </div>
      <div v-else class="max-h-96 bg-background overflow-y-auto scrollbar-thin">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            <SearchEnterHint :query="props.searchInput" :suffix="termTypeSuffix" />
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
                @keydown.tab.prevent="handleSuggestionButtonKeyDown($event)"
                @keydown.esc.prevent="handleEscape"
              >
                {{ categoryGroup.isExpanded ? 'Show less' : '... more' }}
              </button>
            </div>
            <div class="flex flex-row items-start justify-start flex-wrap gap-2">
              <TermButton
                v-for="(term, termIndex) in categoryGroup.terms"
                :key="term"
                :ref="(el) => setTermButtonRef(el, getTermIndexInFlattenedList(groupIndex, termIndex))"
                :term="term"
                @click="handleSearchTermClick(categoryGroup.kind, term)"
                @keydown.tab.prevent="handleSuggestionButtonKeyDown($event)"
                @keydown.esc.prevent="handleEscape"
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
@import '@/assets/input.css';

.result-group {
  @apply hover:bg-gray-50 dark:hover:bg-gray-900 border-b last:border-0 border-gray-200 dark:border-gray-700 p-4 transition-all group-hover/results:opacity-75 hover:!opacity-100;
}
</style>
