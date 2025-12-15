<script setup lang="ts">
import ActionButton from '../atoms/ActionButton.vue'
import RefreshIcon from '../icons/RefreshIcon.vue'

interface Props {
  searchQuery: string
  isLoading: boolean
  searchPlaceholder?: string
  contentSection: string
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'Filter by description...',
})

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  refresh: []
}>()

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:searchQuery', target.value)
}

const handleRefresh = () => {
  emit('refresh')
}
</script>

<template>
  <div class="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
    <div class="flex-1 w-full sm:w-auto">
      <input
        :value="searchQuery"
        type="search"
        :placeholder="searchPlaceholder"
        class="input-field w-full"
        @input="handleSearchInput"
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
