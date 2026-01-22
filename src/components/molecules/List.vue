<script setup lang="ts" generic="T extends { alias: string; entity: { id: number; created_ts: number; description: string | null } }">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ListContent from '@/components/molecules/ListContent.vue'
import ListItem from '@/components/molecules/ListItem.vue'
import ListToolbar from '@/components/molecules/ListToolbar.vue'
import type { SortOption } from '@/types/common'
import { formatDate } from '@/utils/format'
import { DEFAULT_SORT_OPTION, sortEntities } from '@/utils/sort'

interface Props<T> {
  items: T[]
  isLoading: boolean
  error: string | null
  contentSection: string
  errorTitle: string
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
const sortBy = ref<SortOption>(DEFAULT_SORT_OPTION)

// Sync filter query with URL query parameter.
watch(filterQuery, (newValue) => {
  const query = newValue.trim() ? { filter: newValue } : {}
  router.replace({ query })
})

const handleRefresh = async () => {
  emit('refresh')
}

const filteredItems = computed(() => {
  let result = props.items

  // Filter by search query.
  if (filterQuery.value.trim()) {
    const query = filterQuery.value.toLowerCase()

    result = result.filter((item: T) => {
      const description = item.entity.description?.toLowerCase() || ''
      return description.includes(query)
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
    :is-loading="isLoading"
    :content-section="contentSection"
    @refresh="handleRefresh"
  />

  <ListContent
    :items="filteredItems"
    :error="error"
    :is-loading="isLoading"
    :error-title="errorTitle"
    :empty-message="emptyMessage"
  >
    <template #item>
      <ListItem
        v-for="item in filteredItems"
        :key="item.alias"
        :title="getTitle(item)"
        :link="`${routeBase}/${item.alias}`"
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
