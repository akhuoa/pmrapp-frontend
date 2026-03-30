<script setup lang="ts">
import WrapIcon from '@/components/icons/WrapIcon.vue'

const props = defineProps<{
  title?: string
}>()
</script>

<template>
  <button
    class="relative p-2 text-gray-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
    :title="props.title || 'Wrap'"
  >
    <WrapIcon class="w-4 h-4" />
  </button>
</template>
