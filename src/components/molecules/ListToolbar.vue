<script setup lang="ts">
import ActionButton from '@/components/atoms/ActionButton.vue'
import RefreshIcon from '@/components/icons/RefreshIcon.vue'
import SortDropdown from '@/components/molecules/SortDropdown.vue'
import type { SortOption } from '@/types/common'
import { SORT_OPTIONS_GROUPED, DEFAULT_SORT_OPTION } from '@/utils/sort'

interface Props {
  filterQuery: string
  isLoading: boolean
  filterPlaceholder?: string
  contentSection: string
  sortBy?: SortOption
}

const props = withDefaults(defineProps<Props>(), {
  filterPlaceholder: 'Filter by description...',
  sortBy: DEFAULT_SORT_OPTION,
})

const emit = defineEmits<{
  'update:filterQuery': [value: string]
  'update:sortBy': [value: SortOption]
  refresh: []
}>()

const handleFilterInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:filterQuery', target.value)
}

const handleRefresh = () => {
  emit('refresh')
}
</script>

<template>
  <div class="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
    <div class="flex-1 w-full sm:w-auto flex flex-col sm:flex-row gap-4">
      <input
        :value="filterQuery"
        type="search"
        :placeholder="filterPlaceholder"
        class="input-field w-full sm:flex-1"
        @input="handleFilterInput"
      />
      <div class="flex items-center gap-2">
        <SortDropdown
          :model-value="sortBy"
          :options="SORT_OPTIONS_GROUPED"
          @update:model-value="(value) => emit('update:sortBy', value)"
        />
      </div>
    </div>
    <ActionButton
      variant="secondary"
      size="lg"
      :disabled="isLoading"
      :content-section="contentSection"
      @click="handleRefresh"
    >
      <RefreshIcon />
      <span>{{ isLoading ? 'Refreshing...' : 'Refresh' }}</span>
    </ActionButton>
  </div>
</template>

<style scoped>
@import '@/assets/input.css';
</style>
