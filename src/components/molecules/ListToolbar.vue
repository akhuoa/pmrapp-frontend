<script setup lang="ts">
import ActionButton from '@/components/atoms/ActionButton.vue'
import RefreshIcon from '@/components/icons/RefreshIcon.vue'

interface Props {
  filterQuery: string
  isLoading: boolean
  filterPlaceholder?: string
  contentSection: string
}

const props = withDefaults(defineProps<Props>(), {
  filterPlaceholder: 'Filter by description...',
})

const emit = defineEmits<{
  'update:filterQuery': [value: string]
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
    <div class="flex-1 w-full sm:w-auto">
      <input
        :value="filterQuery"
        type="search"
        :placeholder="filterPlaceholder"
        class="input-field w-full"
        @input="handleFilterInput"
      />
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
