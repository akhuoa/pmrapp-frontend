<script setup lang="ts">
import { ref } from 'vue'
import { USE_MOCK_DATA } from '@/services'

const isVisible = ref(true)
</script>

<template>
  <div
    v-if="USE_MOCK_DATA && isVisible"
    class="bg-amber-100 dark:bg-amber-900/20 border-b border-amber-300 dark:border-amber-700 relative"
  >
    <div class="container mx-auto px-4 pr-10 lg:pr-4 py-2 flex items-center justify-center gap-2 text-sm text-amber-900 dark:text-amber-100">
      <span>⚠️</span>
      <span>
        The repository currently uses mock data while we are waiting for its API to become available.
      </span>
    </div>
    <button
      @click="isVisible = false"
      class="w-6 h-6 hover:opacity-70 transition-opacity absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
      aria-label="Close notification"
    >
      ✕
    </button>
  </div>
</template>
