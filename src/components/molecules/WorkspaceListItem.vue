<script setup lang="ts">
import type { Workspace } from '@/types/workspace'

defineProps<{
  workspace: Workspace
}>()
</script>

<template>
  <div class="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:mb-0 last:pb-0 last:border-b-0">
    <RouterLink :to="`/workspace/${workspace.alias}`">
      <h3 class="inline-block text-lg font-semibold mb-2 text-link">
        {{ workspace.entity.description }}
      </h3>
    </RouterLink>
    <p class="text-sm">{{ workspace.entity.url }}</p>
  </div>
</template>

<style scoped>
@import '@/assets/text-link.css';
</style>
