<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ListContainer from '@/components/molecules/ListContainer.vue'
import ListItem from '@/components/molecules/ListItem.vue'
import ListToolbar from '@/components/molecules/ListToolbar.vue'
import { useExposureStore } from '@/stores/exposure'
import { formatDate } from '@/utils/format'
import type { Exposure } from '@/types/exposure'

const emit = defineEmits<{
  updateFilteredCount: [filteredCount: number, totalCount: number, hasFilter: boolean]
}>()

const exposureStore = useExposureStore()
const route = useRoute()
const router = useRouter()
const filterQuery = ref((route.query.filter as string) || '')

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

  // Filter by search query
  if (filterQuery.value.trim()) {
    const query = filterQuery.value.toLowerCase()

    result = result.filter((exposure: Exposure) => {
      const description = exposure.entity.description?.toLowerCase() || ''
      return description.includes(query)
    })
  }

  // Sort by entity.description alphabetically (default).
  // If the description is null, move the item to the end of the sorted array.
  return [...result].sort((a: Exposure, b: Exposure) => {
    const descA = a.entity.description
    const descB = b.entity.description

    if (descA === null && descB === null) return 0
    if (descA === null) return 1
    if (descB === null) return -1

    return descA.localeCompare(descB)
  })
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
