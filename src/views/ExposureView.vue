<script setup lang="ts">
import { computed } from 'vue'
import Exposures from '@/components/Exposures.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import { useExposureStore } from '@/stores/exposure'

const exposureStore = useExposureStore()

const description = computed(() => {
  if (exposureStore.error) {
    return 'Unable to load exposures. Please try refreshing.'
  }

  const count = exposureStore.exposures.length
  if (count === 0) {
    return 'No exposures found. Please try refreshing.'
  }

  return `Browse and explore ${count > 1 ? 'all ' : ''}${count} exposure${count > 1 ? 's' : ''}.`
})
</script>

<template>
  <PageHeader
    title="Exposure Listing"
    :description="description"
  />

  <Exposures />
</template>
