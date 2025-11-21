<script setup lang="ts">
import { USE_MOCK_DATA } from '@/services'
</script>

<template>
  <div
    v-if="USE_MOCK_DATA"
    class="bg-amber-100 dark:bg-amber-900/20 border-b border-amber-300 dark:border-amber-700 px-4 py-2 text-center text-sm text-amber-900 dark:text-amber-100"
  >
    <strong>⚠️ Mock Data Mode:</strong> You are viewing sample data for testing purposes.
    This is not real data from the API.
  </div>
</template>
