<script setup lang="ts">
import WrapIcon from '@/components/icons/WrapIcon.vue'

const props = defineProps<{
  title?: string
  active?: boolean
}>()
</script>

<template>
  <button
    :class="[
      'relative p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all',
      'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
      { 'bg-gray-200 dark:bg-gray-700': props.active }
    ]"
    :title="props.title || 'Wrap'"
    :aria-label="props.title || 'Wrap'"
  >
    <WrapIcon class="w-4 h-4" />
  </button>
</template>
