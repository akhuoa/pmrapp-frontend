<script setup lang="ts" generic="T">
import ErrorBlock from './ErrorBlock.vue'

interface Props {
  items: T[]
  error: string | null
  errorTitle: string
  mockMessage: string
  isLoadingMock: boolean
  emptyMessage: string
}

defineProps<Props>()

const emit = defineEmits<{
  loadMock: []
}>()
</script>

<template>
  <ErrorBlock
    v-if="error"
    :title="errorTitle"
    :error="error"
    :mock-message="mockMessage"
    :is-loading-mock="isLoadingMock"
    @load-mock="emit('loadMock')"
  />

  <div v-else-if="items.length === 0" class="text-center box">
    {{ emptyMessage }}
  </div>

  <div v-else class="box">
    <slot name="item" />
  </div>
</template>

<style scoped>
@import '@/assets/box.css';
</style>
