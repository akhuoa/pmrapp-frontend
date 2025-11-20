<script setup lang="ts">
import MockDataLoader from '../molecules/MockDataLoader.vue'

interface Props {
  title: string
  error: string
  mockMessage: string
  isLoadingMock: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  loadMock: []
}>()
</script>

<template>
  <div class="error-box">
    <h3 class="font-semibold mb-2 text-danger">{{ title }}</h3>
    <p class="text-sm">{{ error }}</p>

    <!-- TODO: Remove this section when API is available -->
    <MockDataLoader
      :message="mockMessage"
      :is-loading="isLoadingMock"
      @load="emit('loadMock')"
    />
  </div>
</template>

<style scoped>
@import '@/assets/error-box.css';
</style>
