<script setup lang="ts">
import { ref } from 'vue'
import CopyIcon from '@/components/icons/CopyIcon.vue'

const props = defineProps<{
  text: string
  title?: string
}>()

const isCopied = ref(false)

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
    alert('Failed to copy to clipboard.')
  }
}
</script>

<template>
  <button
    @click="handleCopy"
    class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
    :title="isCopied ? 'Copied!' : (title || 'Copy')"
  >
    <CopyIcon class="w-4 h-4" />
    <span
      v-if="isCopied"
      class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
    >
      Copied!
    </span>
  </button>
</template>
