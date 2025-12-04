<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import { getExposureService } from '@/services'
import type { Exposure } from '@/types/exposure'
import ExposureListItem from './molecules/ExposureListItem.vue'
import ItemList from './organisms/ItemList.vue'

const exposures = ref<Exposure[]>([])
const error = ref<string | null>(null)

try {
  exposures.value = await getExposureService().listAliased()
} catch (err) {
  error.value = err instanceof Error ? err.message : 'Failed to load exposures'
  console.error('Error loading exposures:', err)
}
</script>

<template>
  <ItemList
    :items="exposures"
    :error="error"
    error-title="Error loading exposures"
    empty-message="No exposures found."
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
