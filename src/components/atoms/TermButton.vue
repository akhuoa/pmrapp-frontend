<script setup lang="ts">
interface Props {
  term: string
  isLoading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <button
    class="px-3 py-1.5 bg-gray-100 cursor-pointer dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm transition-colors relative"
    :aria-label="`Search for ${term}`"
    @click="handleClick"
  >
    {{ term }}
    <span
      v-if="isLoading"
      class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100/75 dark:bg-gray-800/75 rounded-md text-sm"
    >
      <span class="sr-only">Loading...</span>
      <span class="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
    </span>
  </button>
</template>
