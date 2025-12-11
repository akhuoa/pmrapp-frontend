<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useExposureStore } from '@/stores/exposure'
import ActionButton from './atoms/ActionButton.vue'
import ExposureListItem from './molecules/ExposureListItem.vue'
import ItemList from './organisms/ItemList.vue'

const exposureStore = useExposureStore()

onMounted(async () => {
  await exposureStore.fetchExposures()
})

const handleRefresh = async () => {
  await exposureStore.fetchExposures(true)
}
</script>

<template>
  <div class="mb-4 flex justify-end">
    <ActionButton
      variant="secondary"
      size="sm"
      :disabled="exposureStore.isLoading"
      @click="handleRefresh"
      content-section="Exposure Listing"
    >
      {{ exposureStore.isLoading ? 'Refreshing...' : 'Refresh' }}
    </ActionButton>
  </div>

  <ItemList
    :items="exposureStore.exposures"
    :error="exposureStore.error"
    :is-loading="exposureStore.isLoading"
    error-title="Error loading exposures"
    empty-message="No exposures found."
  >
    <template #item>
      <ExposureListItem
        v-for="exposure in exposureStore.exposures"
        :key="exposure.alias"
        :exposure="exposure"
      />
    </template>
  </ItemList>
</template>
