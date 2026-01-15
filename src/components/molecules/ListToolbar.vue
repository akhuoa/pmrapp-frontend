<script setup lang="ts">
import ActionButton from '@/components/atoms/ActionButton.vue'
import RefreshIcon from '@/components/icons/RefreshIcon.vue'

export type SortOption = 'alphabetical' | 'id' | 'date-asc' | 'date-desc'

interface Props {
  filterQuery: string
  isLoading: boolean
  filterPlaceholder?: string
  contentSection: string
  sortBy?: SortOption
}

const props = withDefaults(defineProps<Props>(), {
  filterPlaceholder: 'Filter by description...',
  sortBy: 'alphabetical',
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

const handleSortChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:sortBy', target.value as SortOption)
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
        <label for="sort-select" class="text-sm font-medium text-gray-700 whitespace-nowrap">
          Sort by:
        </label>
        <select
          id="sort-select"
          :value="sortBy"
          class="input-field w-full sm:w-auto h-[42px]"
          @change="handleSortChange"
        >
          <option value="alphabetical">Alphabetically</option>
          <option value="id">ID</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="date-desc">Date (Newest First)</option>
        </select>
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
