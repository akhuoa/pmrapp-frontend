<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TermButton from '@/components/atoms/TermButton.vue'
import ListContent from '@/components/molecules/ListContent.vue'
import ListItem from '@/components/molecules/ListItem.vue'
import FileIcon from '@/components/icons/FileIcon.vue'
import UserIcon from '@/components/icons/UserIcon.vue'
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
          <div>
            <small class="inline-flex items-center gap-1 flex-wrap">
              <span>
                #{{ getExposureIdFromResourcePath(item.resource_path) }}
                <span v-if="item.data.created_ts?.[0]">
                  ·
                  Created on {{ formatDate(Number(item.data.created_ts[0])) }}
                </span>
              </span>
            </small>
          </div>
          <div
            v-if="item.data.model_author?.length"
            class="mt-1 flex items-center gap-1 text-gray-600 dark:text-gray-400"
          >
            <UserIcon class="w-3.5 h-3.5 flex-shrink-0" />
            <small>{{ item.data.model_author.join(', ') }}</small>
          </div>
          <div
            v-if="item.data.citation_author_family_name?.length || item.data.citation_id?.length"
            class="mt-1 text-gray-600 dark:text-gray-400 flex items-center gap-1"
          >
            <FileIcon class="w-3.5 h-3.5 flex-shrink-0" />
            <small>
              <span v-if="item.data.citation_author_family_name?.length">
                {{ item.data.citation_author_family_name.join(', ') }}
              </span>
              <span v-if="item.data.citation_author_family_name?.length && item.data.citation_id?.length"> · </span>
              <span v-if="item.data.citation_id?.length">
                {{ item.data.citation_id.join(', ') }}
              </span>
            </small>
          </div>
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
