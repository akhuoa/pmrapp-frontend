<script setup lang="ts">
import type { Exposure } from '@/types/exposure'

defineProps<{
  exposure: Exposure
}>()
</script>

<template>
  <div class="mb-4 pb-4 border-b border-gray-200 last:mb-0 last:pb-0 last:border-b-0">
    <RouterLink :to="`/exposure/${exposure.alias}`">
      <h3 class="inline-block text-lg font-semibold mb-2 text-link">
        Exposure {{ exposure.entity.id }}
      </h3>
    </RouterLink>
    <p class="text-sm">{{ exposure.entity.description }}</p>
  </div>
</template>

<style scoped>
@import '@/assets/text-link.css';
</style>
