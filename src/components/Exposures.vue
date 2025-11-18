<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import type { Exposure } from '@/types/exposure'
import { exposureService } from '@/services/exposureService'
// TODO: Remove this import when API is available
import { mockExposures } from '@/mocks/exposureMockData'

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
    await new Promise((resolve) => setTimeout(resolve, 200)) // Simulate API delay
    exposures.value = mockExposures
  } catch (err) {
    error.value = 'Failed to load mock data'
    console.error('Error loading mock data:', err)
  } finally {
    isLoadingMock.value = false
  }
}
</script>

<template>
  <div v-if="error" class="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
    <h3 class="font-semibold mb-2">Error loading exposures</h3>
    <p class="text-sm">{{ error }}</p>

    <!-- TODO: Remove this section when API is available -->
    <div class="mt-4 pt-4 border-t border-red-300">
      <p class="text-sm text-gray-700 mb-3">
        <strong>Temporary Solution:</strong> The API is currently unavailable. You can load sample data for testing purposes.
        This is fixed sample data for testing. This feature will be removed once the API is ready.
      </p>
      <button
        @click="loadMockData"
        :disabled="isLoadingMock"
        class="button-primary"
      >
        {{ isLoadingMock ? 'Loading...' : 'Load Mock Data (Temporary)' }}
      </button>
    </div>
  </div>

  <div v-else-if="exposures.length === 0" class="text-gray-500 text-center py-4">
    No exposures found.
  </div>

  <div v-else class="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
    <div
      v-for="exposure in exposures"
      :key="exposure.alias"
      class="mb-4 pb-4 border-b border-gray-200 last:mb-0 last:pb-0 last:border-b-0"
    >
      <RouterLink :to="`/exposure/${exposure.alias}`">
        <h3 class="inline-block text-lg font-semibold mb-2 text-[#cc0000] hover:text-[#830a28] transition-colors">
          Exposure {{ exposure.entity.id }}
        </h3>
      </RouterLink>
      <p class="text-gray-600 text-sm">{{ exposure.entity.description }}</p>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/button.css';
</style>
