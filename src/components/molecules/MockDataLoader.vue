<script setup lang="ts">
defineProps<{
  message: string
  isLoading: boolean
}>()

defineEmits<{
  load: []
}>()
</script>

<template>
  <div class="mt-4 pt-4 border-t border-red-300">
    <p class="text-sm mb-3">
      <strong>Temporary Solution:</strong> The API is currently unavailable. You can load sample data for testing purposes.
      {{ message }}
      This feature will be removed once the API is ready.
    </p>
    <button
      @click="$emit('load')"
      :disabled="isLoading"
      class="button-primary"
    >
      {{ isLoading ? 'Loading...' : 'Load Mock Data (Temporary)' }}
    </button>
  </div>
</template>

<style scoped>
@import '@/assets/button.css';
</style>
