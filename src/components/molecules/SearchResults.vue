<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TermButton from '@/components/atoms/TermButton.vue'
import ListContent from '@/components/molecules/ListContent.vue'
import ListItem from '@/components/molecules/ListItem.vue'
import type { SearchResult } from '@/types/search'
import { getExposureIdFromResourcePath } from '@/utils/exposure'
import { formatDate, formatNumber } from '@/utils/format'
import { SEARCH_KIND_LABEL_MAP } from '@/constants/search'

interface Props {
  results: SearchResult[]
  isLoading: boolean
  error: string | null
  term: string
  kind: string
}

const props = defineProps<Props>()

const router = useRouter()

const handleKeywordClick = (kind: string, keyword: string) => {
  router.push({ path: '/search', query: { kind, term: keyword } })
}

const kindLabel = computed(() => {
  return SEARCH_KIND_LABEL_MAP[props.kind] || props.kind
})

const resultsCount = computed(() => props.results.length)

const hasResults = computed(() => resultsCount.value > 0)
</script>

<template>
  <div>
    <p class="mb-4" v-if="!isLoading && !error">
      <template v-if="!hasResults && term.trim() === ''">
        Perform a search to see results.
      </template>
      <template v-else-if="!hasResults">
        No results for <strong>"{{ term }}"</strong> in <strong>{{ kindLabel }}</strong>
      </template>
      <template v-else-if="resultsCount === 1">
        <strong>1 result</strong> for <strong>"{{ term }}"</strong> in <strong>{{ kindLabel }}</strong>
      </template>
      <template v-else>
        <strong>{{ formatNumber(resultsCount) }} results</strong> for <strong>"{{ term }}"</strong> in <strong>{{ kindLabel }}</strong>
      </template>
    </p>

    <ListContent
      :items="results"
      :error="error"
      :is-loading="isLoading"
      error-title="Error loading search results"
      empty-message="No results found."
    >
      <template #item>
        <ListItem
          v-for="item in results"
          :key="item.resource_path"
          :title="item.data.description?.[0] || item.resource_path"
          :link="item.data.aliased_uri?.[0] || ''"
        >
          <p>
            <small>
              #{{ getExposureIdFromResourcePath(item.resource_path) }}
              <span v-if="item.data.created_ts?.[0]">
                ·
                Created on {{ formatDate(Number(item.data.created_ts[0])) }}
              </span>
            </small>
          </p>
          <div v-if="item.data.cellml_keyword?.length" class="flex flex-wrap gap-2 mt-2">
            <TermButton
              v-for="keyword in item.data.cellml_keyword.filter(k => k.trim())"
              :key="keyword"
              :term="keyword"
              :active="kind === 'cellml_keyword' && term === keyword"
              @click="handleKeywordClick('cellml_keyword', keyword)"
            />
          </div>
        </ListItem>
      </template>
    </ListContent>
  </div>
</template>

<style scoped>
@import '@/assets/box.css';
</style>
