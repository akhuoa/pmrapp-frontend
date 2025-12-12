<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExposureStore } from '@/stores/exposure'
import ExposureListItem from './molecules/ExposureListItem.vue'
import ListToolbar from './molecules/ListToolbar.vue'
import ItemList from './organisms/ItemList.vue'

const exposureStore = useExposureStore()
const route = useRoute()
const router = useRouter()
const searchQuery = ref((route.query.search as string) || '')

onMounted(async () => {
  await exposureStore.fetchExposures()
})

// Sync search query with URL query parameter.
watch(searchQuery, (newValue) => {
  const query = newValue.trim() ? { search: newValue } : {}
  router.replace({ query })
})

const handleRefresh = async () => {
  await exposureStore.fetchExposures(true)
}

const filteredExposures = computed(() => {
  if (!searchQuery.value.trim()) {
    return exposureStore.exposures
  }

  const query = searchQuery.value.toLowerCase()
  return exposureStore.exposures.filter((exposure) => {
    const description = exposure.entity.description?.toLowerCase() || ''
    return description.includes(query)
  })
})
</script>

<template>
  <ListToolbar
    v-model:search-query="searchQuery"
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
