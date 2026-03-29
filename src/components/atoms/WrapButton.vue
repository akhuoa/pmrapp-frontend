<script setup lang="ts">
import CopyIcon from '@/components/icons/CopyIcon.vue'

const props = defineProps<{
  text: string
  title?: string
  onClick?: () => void
}>()

const handleClick = () => {
  if (props.onClick) {
    props.onClick()
  }
}
</script>

<template>
  <button
    @click="handleClick"
    class="relative p-2 text-gray-500 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
    title="Wrap"
  >
    <CopyIcon class="w-4 h-4" />
  </button>
</template>
