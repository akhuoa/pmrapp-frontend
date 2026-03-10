<script setup lang="ts" generic="T extends { alias: string; entity: { id: number; created_ts: number; description: string | null } }">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ListContent from '@/components/molecules/ListContent.vue'
import ListItem from '@/components/molecules/ListItem.vue'
import ListToolbar from '@/components/molecules/ListToolbar.vue'
import type { SortOption } from '@/types/common'
import { formatDate } from '@/utils/format'
import { normaliseSearchText } from '@/utils/search'
import { DEFAULT_SORT_OPTION, isValidSortOption, sortEntities } from '@/utils/sort'

interface Props<T> {
  items: T[]
  isLoading: boolean
  error: string | null
  errorTitle: string
  contentSection: string
  emptyMessage: string
  routeBase: string
  getTitle: (item: T) => string
}

const props = defineProps<Props<T>>()

const emit = defineEmits<{
  refresh: []
  updateFilteredCount: [filteredCount: number, totalCount: number, hasFilter: boolean]
}>()

const route = useRoute()
const router = useRouter()
const filterQuery = ref((route.query.filter as string) || '')
const sortQuery = route.query.sort
const initialSort: SortOption =
  typeof sortQuery === 'string' && isValidSortOption(sortQuery)
    ? sortQuery
    : DEFAULT_SORT_OPTION
const sortBy = ref<SortOption>(initialSort)

// Sync filter and sort with URL query parameters.
watch([filterQuery, sortBy], ([newFilter, newSort]) => {
  const query: Record<string, string> = {}
  const trimmedFilter = newFilter.trim()
  if (trimmedFilter) query.filter = trimmedFilter
  if (newSort !== DEFAULT_SORT_OPTION) query.sort = newSort
  router.replace({ query })
})

const handleRefresh = async () => {
  emit('refresh')
}

const filteredItems = computed(() => {
  let result = props.items

  // Filter by search query.
  if (filterQuery.value.trim()) {
    const normalisedQuery = normaliseSearchText(filterQuery.value.toLowerCase())
    const queryTokens = normalisedQuery.split(' ').filter((t) => t.length > 0)

    result = result.filter((item: T) => {
      const description = normaliseSearchText(item.entity.description?.toLowerCase() || '')
      const id = item.entity.id.toString()
      const matchesDescription = queryTokens.every((token) => description.includes(token))
      const matchesId = id.includes(filterQuery.value.trim())
      return matchesDescription || matchesId
    })
  }

  // Sort based on selected option.
  return sortEntities(result, sortBy.value)
})

watch(
  [filteredItems, () => props.items.length],
  () => {
    emit(
      'updateFilteredCount',
      filteredItems.value.length,
      props.items.length,
      !!filterQuery.value.trim(),
    )
  },
  { immediate: true },
)
</script>

<template>
  <ListToolbar
    v-model:filter-query="filterQuery"
    v-model:sort-by="sortBy"
    :is-loading="props.isLoading"
    :content-section="props.contentSection"
    @refresh="handleRefresh"
  />

  <ListContent
    :items="filteredItems"
    :error="props.error"
    :is-loading="props.isLoading"
    :error-title="props.errorTitle"
    :empty-message="props.emptyMessage"
  >
    <template #item>
      <ListItem
        v-for="item in filteredItems"
        :key="item.alias"
        :title="props.getTitle(item)"
        :link="`${props.routeBase}/${item.alias}`"
      >
        <p>
          <small>
            #{{ item.entity.id }} ·
            Created on {{ formatDate(item.entity.created_ts) }}
          </small>
        </p>
      </ListItem>
    </template>
  </ListContent>
</template>
