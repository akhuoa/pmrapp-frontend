<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import type { Exposure } from '@/types/exposure'
import { exposureService } from '@/services/exposureService'
import ItemList from './organisms/ItemList.vue'
import ExposureListItem from './molecules/ExposureListItem.vue'

const exposures = ref<Exposure[]>([])
const error = ref<string | null>(null)
// TODO: Remove this state when API is available
const isLoadingMock = ref(false)

try {
  exposures.value = await exposureService.listAliased()
} catch (err) {
  error.value = err instanceof Error ? err.message : 'Failed to load exposures'
  console.error('Error loading exposures:', err)
}

// TODO: Remove this function when API is available
const loadMockData = async () => {
  isLoadingMock.value = true
  error.value = null

  try {
    const response = await fetch('/pmrapp-frontend/mocks/exposures.json')
    if (!response.ok) throw new Error('Failed to fetch mock data')
    exposures.value = await response.json()
  } catch (err) {
    error.value = 'Failed to load mock data'
    console.error('Error loading mock data:', err)
  } finally {
    isLoadingMock.value = false
  }
}
</script>

<template>
  <ItemList
    :items="exposures"
    :error="error"
    error-title="Error loading exposures"
    mock-message="This is fixed sample data for testing."
    :is-loading-mock="isLoadingMock"
    empty-message="No exposures found."
    @load-mock="loadMockData"
  >
    <template #item>
      <ExposureListItem
        v-for="exposure in exposures"
        :key="exposure.alias"
        :exposure="exposure"
      />
    </template>
  </ItemList>
</template>

<style scoped>
@import '@/assets/button.css';
</style>
