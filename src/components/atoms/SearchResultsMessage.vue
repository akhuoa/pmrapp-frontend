<script setup lang="ts">
import { computed } from 'vue'
import { SEARCH_KIND_LABEL_MAP, SEARCH_KIND_LABEL_SINGULAR_MAP } from '@/constants/search'
import type { SearchFilter, SearchResult } from '@/types/search'
import { formatNumber } from '@/utils/format'

interface Props {
  results: SearchResult[]
  isLoading: boolean
  error: string | null
  term: string
  query?: string
  filters?: SearchFilter[]
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
</script>

<template>
  <p class="mb-4" v-if="!isLoading && !error">
    <template v-if="!hasResults && !hasActiveSearch">
      Perform a search to see results.
    </template>
    <template v-else-if="!hasResults">
      No results for
      <template v-if="query?.trim()"><strong>{{ query }}</strong></template>
      <template v-if="query?.trim() && groupedFilters.length"> with </template>
      <template v-for="(group, gi) in groupedFilters" :key="group.kind">
        <strong>{{ group.terms.length === 1 ? (SEARCH_KIND_LABEL_SINGULAR_MAP[group.kind] || group.kind) : (SEARCH_KIND_LABEL_MAP[group.kind] || group.kind) }}</strong>:
        <template v-for="(term, ti) in group.terms" :key="term">
          <strong>{{ term }}</strong>
          <template v-if="ti < group.terms.length - 2">, </template>
          <template v-else-if="ti === group.terms.length - 2"> and </template>
        </template>
        <template v-if="gi < groupedFilters.length - 2">, </template>
        <template v-else-if="gi === groupedFilters.length - 2"> and </template>
      </template>
    </template>
    <template v-else>
      <strong>{{ resultsCount === 1 ? '1 result' : `${formatNumber(resultsCount)} results` }}</strong>
      <template v-if="query?.trim()"> for <strong>{{ query }}</strong></template>
      <template v-if="query?.trim() && groupedFilters.length"> with </template>
      <template v-else-if="!query?.trim() && groupedFilters.length"> for </template>
      <template v-for="(group, gi) in groupedFilters" :key="group.kind">
        <strong>{{ group.terms.length === 1 ? (SEARCH_KIND_LABEL_SINGULAR_MAP[group.kind] || group.kind) : (SEARCH_KIND_LABEL_MAP[group.kind] || group.kind) }}</strong>:
        <template v-for="(term, ti) in group.terms" :key="term">
          <strong>{{ term }}</strong>
          <template v-if="ti < group.terms.length - 2">, </template>
          <template v-else-if="ti === group.terms.length - 2"> and </template>
        </template>
        <template v-if="gi < groupedFilters.length - 2">, </template>
        <template v-else-if="gi === groupedFilters.length - 2"> and </template>
      </template>
    </template>
  </p>
</template>
