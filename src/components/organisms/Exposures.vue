<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ListContainer from '@/components/molecules/ListContainer.vue'
import ListItem from '@/components/molecules/ListItem.vue'
import ListToolbar from '@/components/molecules/ListToolbar.vue'
import { useExposureStore } from '@/stores/exposure'
import type { SortOption } from '@/types/common'
import type { Exposure } from '@/types/exposure'
import { formatDate } from '@/utils/format'
import { DEFAULT_SORT_OPTION, sortEntities } from '@/utils/sort'

const emit = defineEmits<{
  updateFilteredCount: [filteredCount: number, totalCount: number, hasFilter: boolean]
}>()

const exposureStore = useExposureStore()
const route = useRoute()
const router = useRouter()
const filterQuery = ref((route.query.filter as string) || '')
const sortBy = ref<SortOption>(DEFAULT_SORT_OPTION)

onMounted(async () => {
  await exposureStore.fetchExposures()
})

// Sync filter query with URL query parameter.
watch(filterQuery, (newValue) => {
  const query = newValue.trim() ? { filter: newValue } : {}
  router.replace({ query })
})

const handleRefresh = async () => {
  await exposureStore.fetchExposures(true)
}

const filteredExposures = computed(() => {
  let result = exposureStore.exposures

  // Filter by search query.
  if (filterQuery.value.trim()) {
    const query = filterQuery.value.toLowerCase()

    result = result.filter((exposure: Exposure) => {
      const description = exposure.entity.description?.toLowerCase() || ''
      return description.includes(query)
    })
  }

  // Sort based on selected option.
  return sortEntities(result, sortBy.value)
})

watch(
  [filteredExposures, () => exposureStore.exposures.length],
  () => {
    emit(
      'updateFilteredCount',
      filteredExposures.value.length,
      exposureStore.exposures.length,
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
    :is-loading="exposureStore.isLoading"
    content-section="Exposure Listing"
    @refresh="handleRefresh"
  />

  <ListContainer
    :items="filteredExposures"
    :error="exposureStore.error"
    :is-loading="exposureStore.isLoading"
    error-title="Error loading exposures"
    empty-message="No exposures found."
  >
    <template #item>
      <ListItem
        v-for="exposure in filteredExposures"
        :key="exposure.alias"
        :title="exposure.entity.description || `Exposure ${exposure.entity.id}`"
        :link="`/exposures/${exposure.alias}`"
      >
        <p>
          <small>
          #{{ exposure.entity.id }} ·
          Created on {{ formatDate(exposure.entity.created_ts) }}
          </small>
        </p>
      </ListItem>
    </template>
  </ListContainer>
</template>
