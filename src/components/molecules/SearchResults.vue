<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TermButton from '@/components/atoms/TermButton.vue'
import ListContent from '@/components/molecules/ListContent.vue'
import ListItem from '@/components/molecules/ListItem.vue'
import type { SearchResult } from '@/types/search'
import { formatDate, formatNumber } from '@/utils/format'

interface Props {
  results: SearchResult[]
  isLoading: boolean
  error: string | null
  term: string
}

const props = defineProps<Props>()

const router = useRouter()

const handleKeywordClick = (kind: string, keyword: string) => {
  router.push({ path: '/search', query: { kind, term: keyword } })
}

const getExposureIdFromResourcePath = (resourcePath: string): string => {
  const match = resourcePath.match(/\/exposure\/(\d+)\//)
  if (match?.[1]) {
    return `#${match[1]}`
  }
  return ''
}

const resultsText = computed(() => {
  const resultsCount = props.results.length

  if (resultsCount === 0) {
    if (props.term.trim() === '') {
      return 'Perform a search to see results.'
    }
    return `No results for "${props.term}"`
  }

  if (resultsCount === 1) {
    return `1 result for "${props.term}"`
  }

  return `${formatNumber(resultsCount)} results for "${props.term}"`
})
</script>

<template>
  <div>
    <p class="text-xl font-bold mb-4" v-if="!isLoading">
      {{ resultsText }}
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
          v-for="(item, index) in results"
          :key="index"
          :title="item.data.description?.[0] || item.resource_path"
          :link="item.data.aliased_uri?.[0] || ''"
        >
          <p>
            <small>
              {{ getExposureIdFromResourcePath(item.resource_path) }}
              <span v-if="item.data.created_ts?.[0]">
                ·
                Created on {{ formatDate(Number(item.data.created_ts[0])) }}
              </span>
            </small>
          </p>
          <div v-if="item.data.cellml_keyword?.length" class="flex flex-wrap gap-2 mt-2">
            <TermButton
              v-for="keyword in item.data.cellml_keyword"
              :key="keyword"
              :term="keyword"
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
