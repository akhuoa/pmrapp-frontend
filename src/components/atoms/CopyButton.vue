<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import Tooltip from '@/components/atoms/Tooltip.vue'
import CopyIcon from '@/components/icons/CopyIcon.vue'

const props = defineProps<{
  text: string
  title?: string
}>()

const isCopied = ref(false)
const isHovered = ref(false)
const buttonRef = ref<HTMLElement | null>(null)
let copiedTimer: ReturnType<typeof setTimeout> | null = null

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    isCopied.value = true

    if (copiedTimer) {
      clearTimeout(copiedTimer)
    }

    copiedTimer = setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

onBeforeUnmount(() => {
  if (copiedTimer) {
    clearTimeout(copiedTimer)
  }
})
</script>

<template>
  <button
    ref="buttonRef"
    @click="handleCopy"
    class="relative p-2 text-gray-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
    :aria-label="isCopied ? 'Copied!' : (title || 'Copy')"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <CopyIcon class="w-4 h-4" />
    <Tooltip
      :visible="isHovered || isCopied"
      :anchor-el="buttonRef"
    >
      {{ isCopied ? 'Copied!' : (title || 'Copy') }}
    </Tooltip>
  </button>
</template>
