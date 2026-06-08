<script setup lang="ts">
import { computed } from 'vue'
import { SEARCH_KIND_LABEL_MAP, SEARCH_KIND_LABEL_SINGULAR_MAP } from '@/constants/search'
import type { SearchFilter, SearchResult } from '@/types/search'
import { formatKindLabel, formatNumber, formatSearchKey, formatTermKey } from '@/utils/format'

interface Props {
  results: SearchResult[]
  isLoading: boolean
  error: string | null
  term: string
  query?: string
  filters?: SearchFilter[]
}

interface MessageGroup {
  kind: string
  terms: string[]
}

const props = defineProps<Props>()

const resultsCount = computed(() => props.results.length)

const hasResults = computed(() => resultsCount.value > 0)

const hasActiveSearch = computed(() => {
  return !!(props.query?.trim() || props.filters?.length || props.term.trim())
})

const activeFilters = computed(() => props.filters ?? [])

const groupedFilters = computed(() => {
  const groups = new Map<string, string[]>()
  for (const filter of activeFilters.value) {
    const terms = groups.get(filter.kind) ?? []
    terms.push(filter.term)
    groups.set(filter.kind, terms)
  }
  return Array.from(groups.entries()).map(([kind, terms]) => ({ kind, terms }))
})

const formatGroupLabel = (group: MessageGroup) => {
  const groupLabel =
    group.terms.length === 1
      ? SEARCH_KIND_LABEL_SINGULAR_MAP[group.kind] || group.kind
      : SEARCH_KIND_LABEL_MAP[group.kind] || group.kind
  return formatKindLabel(groupLabel)
}

const formatTerms = (terms: string[]) => {
  return terms
    .map((term, i) => {
      const comma = i < terms.length - 2 ? ', ' : ''
      const and = i === terms.length - 2 ? (terms.length > 2 ? ', and ' : ' and ') : ''
      return `${formatTermKey(term)}${comma}${and}`
    })
    .join('')
}

const formatFiltersHtml = computed(() => {
  return groupedFilters.value
    .map((group, i) => {
      const groupSeparator = i < groupedFilters.value.length - 2 ? ', ' : ''
      const groupAnd = i === groupedFilters.value.length - 2 ? (groupedFilters.value.length > 2 ? ', and ' : ' and ') : ''
      return `${formatGroupLabel(group)}: ${formatTerms(group.terms)}${groupSeparator}${groupAnd}`
    })
    .join('')
})

const messageNoSearch = 'Perform a search to see results.'

const messageNoResults = computed(() => {
  let message = 'No results for'

  if (props.query?.trim()) {
    message += ` ${formatSearchKey(props.query)}`
  }

  if (groupedFilters.value.length > 0) {
    message += props.query?.trim() ? ' with ' : ' '
    message += formatFiltersHtml.value
  }

  return message
})

const messageWithResults = computed(() => {
  const countText =
    resultsCount.value === 1 ? '1 result' : `${formatNumber(resultsCount.value)} results`
  let message = `<strong class="text-gray-700 dark:text-gray-200">${countText}</strong>`

  if (props.query?.trim()) {
    message += ` for ${formatSearchKey(props.query)}`
  }

  if (groupedFilters.value.length > 0) {
    message += props.query?.trim() ? ' with ' : ' for '
    message += formatFiltersHtml.value
  }

  return message
})
</script>

<template>
  <p class="mb-4 text-gray-500 dark:text-gray-400" v-if="!isLoading && !error">
    <template v-if="!hasResults && !hasActiveSearch">
      {{ messageNoSearch }}
    </template>

    <template v-else-if="!hasResults">
      <span v-html="messageNoResults"></span>
    </template>

    <template v-else>
      <span v-html="messageWithResults"></span>
    </template>
  </p>
</template>
