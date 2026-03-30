<script setup lang="ts">
import { computed, ref } from 'vue'
import Tooltip from '@/components/atoms/Tooltip.vue'
import WrapIcon from '@/components/icons/WrapIcon.vue'

const props = defineProps<{
  title?: string
  active?: boolean
}>()

const buttonRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)

const buttonTitle = computed(() => {
  if (props.title) return props.title
  return props.active ? 'Unwrap lines' : 'Wrap long lines'
})
</script>

<template>
  <button
    ref="buttonRef"
    :class="[
      'relative p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all',
      'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
      { 'bg-gray-200 dark:bg-gray-700': props.active }
    ]"
    :aria-label="buttonTitle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <WrapIcon class="w-4 h-4" />
    <Tooltip :visible="isHovered" :anchor-el="buttonRef">{{ buttonTitle }}</Tooltip>
  </button>
</template>
