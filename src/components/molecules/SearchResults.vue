<script setup lang="ts">
import { useRouter } from 'vue-router'
import ListContainer from '@/components/molecules/ListContainer.vue'
import ListItem from '@/components/molecules/ListItem.vue'
import type { SearchResult } from '@/types/search'
import { formatDate } from '@/utils/format'

interface Props {
  results: SearchResult[]
  isLoading: boolean
  error: string | null
  term: string
}

defineProps<Props>()

const router = useRouter()

const termButtonClass = [
  'px-3',
  'py-1.5',
  'bg-gray-100',
  'cursor-pointer',
  'dark:bg-gray-800',
  'hover:bg-gray-200',
  'dark:hover:bg-gray-700',
  'rounded-md',
  'text-sm',
  'transition-colors',
].join(' ')

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
</script>

<template>
  <div class="">
    <h2 class="text-2xl font-bold mb-4">
      Results for "{{ term }}"
    </h2>

    <ListContainer
      :items="results"
      :error="error"
      :is-loading="isLoading"
      error-title="Error loading search results"
      empty-message="No results found for this keyword."
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
            <button
              v-for="keyword in item.data.cellml_keyword"
              :key="keyword"
              :class="termButtonClass"
              @click="handleKeywordClick('cellml_keyword', keyword)"
            >
              {{ keyword }}
            </button>
          </div>
        </ListItem>
      </template>
    </ListContainer>
  </div>
</template>

<style scoped>
@import '@/assets/box.css';
</style>
