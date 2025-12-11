<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useExposureStore } from '@/stores/exposure'
import ActionButton from './atoms/ActionButton.vue'
import ExposureListItem from './molecules/ExposureListItem.vue'
import ItemList from './organisms/ItemList.vue'
import RefreshIcon from './icons/RefreshIcon.vue'

const exposureStore = useExposureStore()
const searchQuery = ref('')

onMounted(async () => {
  await exposureStore.fetchExposures()
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
  <div class="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
    <div class="flex-1 w-full sm:w-auto">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by description..."
        class="input-field w-full"
      />
    </div>
    <ActionButton
      variant="secondary"
      size="lg"
      :disabled="exposureStore.isLoading"
      @click="handleRefresh"
      content-section="Exposure Listing"
    >
      <RefreshIcon />
      <span>{{ exposureStore.isLoading ? 'Refreshing...' : 'Refresh' }}</span>
    </ActionButton>
  </div>

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

<style scoped>
@import '@/assets/input.css';
</style>
