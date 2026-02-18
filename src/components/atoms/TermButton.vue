<script setup lang="ts">
interface Props {
  term: string
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
    class="px-3 py-1.5 text-gray-600 bg-gray-100 cursor-pointer dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm transition-colors relative"
    :aria-label="`Search for ${term}`"
    @click="handleClick"
  >
    {{ term }}
  </button>
</template>
