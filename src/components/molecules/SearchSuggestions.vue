<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import SearchEnterHint from '@/components/atoms/SearchEnterHint.vue'
import TermButton from '@/components/atoms/TermButton.vue'

type CategoryGroup = {
  kind: string
  label: string
  terms: string[]
  totalCount: number
  isExpanded: boolean
}

const props = defineProps<{
  isSuggestionsVisible: boolean
  inOverlay?: boolean
  categoriesError: string | null
  isLoading: boolean
  hasResults: boolean
  searchInput: string
  formattedSearchInput: string
  termTypeSuffix: string
  filteredSearchTermsByCategory: CategoryGroup[]
  maxTermsPerCategory: number
  setToggleButtonRef: (el: Element | ComponentPublicInstance | null, index: number) => void
  setTermButtonRef: (el: Element | ComponentPublicInstance | null, index: number) => void
}>()

const emit = defineEmits<{
  (e: 'toggleTerms', kind: string): void
  (e: 'toggleTermsByKeyboard', kind: string, groupIndex: number): void
  (e: 'searchTermClick', kind: string, term: string): void
}>()

const getTermIndexInFlattenedList = (groupIndex: number, termIndex: number): number => {
  const priorTermsCount = props.filteredSearchTermsByCategory
    .slice(0, groupIndex)
    .reduce((acc, group) => acc + group.terms.length, 0)

  return priorTermsCount + termIndex
}
</script>

<template>
  <div
    v-if="isSuggestionsVisible"
    :class="`top-full left-0 w-full z-200 ${inOverlay ? '' : 'absolute'}`"
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
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          No authors or keywords found for
          <span v-html="formattedSearchInput"></span>.
          <SearchEnterHint :query="searchInput" />
        </p>
      </div>
      <div v-else class="max-h-96 bg-background overflow-y-auto scrollbar-thin">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            <SearchEnterHint :query="searchInput" :suffix="termTypeSuffix" />
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
                v-if="categoryGroup.totalCount > maxTermsPerCategory"
                type="button"
                :ref="(el) => setToggleButtonRef(el, groupIndex)"
                class="px-3 py-1 text-sm rounded-md transition-colors relative focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900 cursor-pointer text-primary hover:text-primary-hover bg-transparent"
                :aria-expanded="categoryGroup.isExpanded"
                @click="emit('toggleTerms', categoryGroup.kind)"
                @keydown.enter.prevent="emit('toggleTermsByKeyboard', categoryGroup.kind, groupIndex)"
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
                @click="emit('searchTermClick', categoryGroup.kind, term)"
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

.result-group {
  @apply hover:bg-gray-50 dark:hover:bg-gray-900 border-b last:border-0 border-gray-200 dark:border-gray-700 p-4 transition-all group-hover/results:opacity-75 hover:!opacity-100;
}
</style>
