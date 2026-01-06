<script setup lang="ts">
import type { Exposure } from '@/types/exposure'
import { formatDate } from '@/utils/format'

defineProps<{
  exposure: Exposure
}>()
</script>

<template>
  <div class="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:mb-0 last:pb-0 last:border-b-0">
    <RouterLink :to="`/exposures/${exposure.alias}`">
      <h3 class="inline-block text-lg font-semibold text-link">
        {{ exposure.entity.description || `Exposure ${exposure.entity.id}` }}
      </h3>
    </RouterLink>
    <p>
      <small>
      #{{ exposure.entity.id }} ·
      created on {{ formatDate(exposure.entity.created_ts) }}
      </small>
    </p>
  </div>
</template>

<style scoped>
@import '@/assets/text-link.css';
</style>
