<script setup lang="ts">
import { computed } from 'vue'
import WrapIcon from '@/components/icons/WrapIcon.vue'

const props = defineProps<{
  title?: string
  active?: boolean
}>()

const buttonTitle = computed(() => {
  if (props.title) return props.title
  return props.active ? 'Unwrap lines' : 'Wrap long lines'
})
</script>

<template>
  <button
    :class="[
      'relative p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all',
      'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
      { 'bg-gray-200 dark:bg-gray-700': props.active }
    ]"
    :title="buttonTitle"
    :aria-label="buttonTitle"
  >
    <WrapIcon class="w-4 h-4" />
  </button>
</template>
