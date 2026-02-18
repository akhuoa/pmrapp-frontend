<script setup lang="ts">
interface Props {
  term: string
  active?: boolean
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
    class="px-3 py-1.5 text-gray-600 dark:text-gray-300 rounded-md text-sm transition-colors relative"
    :class="active
      ? 'bg-gray-300 dark:bg-gray-600 cursor-default'
      : 'bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700'"
    :aria-label="`Search for ${term}`"
    @click="handleClick"
  >
    {{ term }}
  </button>
</template>
