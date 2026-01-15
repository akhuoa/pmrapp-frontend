<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted } from 'vue'
import ListItem from '@/components/molecules/ListItem.vue'
import Listing from '@/components/molecules/Listing.vue'
import { useExposureStore } from '@/stores/exposure'
import { formatDate } from '@/utils/format'

const emit = defineEmits<{
  updateFilteredCount: [filteredCount: number, totalCount: number, hasFilter: boolean]
}>()

const exposureStore = useExposureStore()

onMounted(async () => {
  await exposureStore.fetchExposures()
})

const handleRefresh = async () => {
  await exposureStore.fetchExposures(true)
}

const handleUpdateFilteredCount = (
  filteredCount: number,
  totalCount: number,
  hasFilter: boolean,
) => {
  emit('updateFilteredCount', filteredCount, totalCount, hasFilter)
}
</script>

<template>
  <Listing
    :items="exposureStore.exposures"
    :is-loading="exposureStore.isLoading"
    :error="exposureStore.error"
    content-section="Exposure Listing"
    error-title="Error loading exposures"
    empty-message="No exposures found."
    @refresh="handleRefresh"
    @update-filtered-count="handleUpdateFilteredCount"
  >
    <template #item="{ items }">
      <ListItem
        v-for="exposure in items"
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
  </Listing>
</template>
