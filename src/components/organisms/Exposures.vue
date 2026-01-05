<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExposureStore } from '@/stores/exposure'
import ExposureListItem from '@/components/molecules/ExposureListItem.vue'
import ListToolbar from '@/components/molecules/ListToolbar.vue'
import ItemList from '@/components/organisms/ItemList.vue'

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
  if (!filterQuery.value.trim()) {
    return exposureStore.exposures
  }

  const query = filterQuery.value.toLowerCase()
  return exposureStore.exposures.filter((exposure) => {
    const description = exposure.entity.description?.toLowerCase() || ''
    return description.includes(query)
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

  <ItemList
    :items="filteredExposures"
    :error="exposureStore.error"
    :is-loading="exposureStore.isLoading"
    error-title="Error loading exposures"
    empty-message="No exposures found."
  >
    <template #item>
      <ExposureListItem
        v-for="exposure in filteredExposures"
        :key="exposure.alias"
        :exposure="exposure"
      />
    </template>
  </ItemList>
</template>
