<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import type { Exposure } from '@/types/exposure'
import { exposureService } from '@/services/exposureService'

const exposures = ref<Exposure[]>([])
const error = ref<string | null>(null)

try {
  exposures.value = await exposureService.listAliased()
} catch (err) {
  error.value = err instanceof Error ? err.message : 'Failed to load exposures'
  console.error('Error loading exposures:', err)
}
</script>

<template>
  <div v-if="error" class="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
    <h3 class="font-semibold mb-2">Error loading exposures</h3>
    <p class="text-sm">{{ error }}</p>
  </div>
  <div v-else-if="exposures.length === 0" class="text-gray-500 text-center py-4">
    No exposures found.
  </div>
  <div v-else>
    <div
      v-for="exposure in exposures"
      :key="exposure.alias"
      class="mb-4 pb-4 border-b border-gray-200 last:mb-0 last:pb-0 last:border-b-0"
    >
      <h3 class="text-lg font-semibold mb-2">Exposure {{ exposure.entity.id }}</h3>
      <p class="text-gray-600 text-sm">{{ exposure.entity.description }}</p>
    </div>
  </div>
</template>
