<script setup lang="ts" generic="T extends { entity: { id: number; description: string | null; created_ts: number } }">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ListContainer from '@/components/molecules/ListContainer.vue'
import ListToolbar from '@/components/molecules/ListToolbar.vue'
import type { SortOption } from '@/types/common'

interface Props {
  items: T[]
  isLoading: boolean
  error: string | null
  contentSection: string
  errorTitle: string
  emptyMessage: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updateFilteredCount: [filteredCount: number, totalCount: number, hasFilter: boolean]
  refresh: []
}>()

const route = useRoute()
const router = useRouter()
const filterQuery = ref((route.query.filter as string) || '')
const sortBy = ref<SortOption>('description')

onMounted(() => {
  emit('refresh')
})

// Sync filter query with URL query parameter.
watch(filterQuery, (newValue) => {
  const query = newValue.trim() ? { filter: newValue } : {}
  router.replace({ query })
})

const handleRefresh = () => {
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
  return [...result].sort((a: T, b: T) => {
    switch (sortBy.value) {
      case 'description': {
        const descA = a.entity.description
        const descB = b.entity.description

        if (descA === null && descB === null) return 0
        if (descA === null) return 1
        if (descB === null) return -1

        return descA.localeCompare(descB)
      }
      case 'id':
        return a.entity.id - b.entity.id
      case 'date-asc':
        return a.entity.created_ts - b.entity.created_ts
      case 'date-desc':
        return b.entity.created_ts - a.entity.created_ts
      default:
        return 0
    }
  })
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

  <ListContainer
    :items="filteredItems"
    :error="error"
    :is-loading="isLoading"
    :error-title="errorTitle"
    :empty-message="emptyMessage"
  >
    <template #item>
      <slot name="item" :items="filteredItems" />
    </template>
  </ListContainer>
</template>
