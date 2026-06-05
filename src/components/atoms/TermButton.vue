<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  term: string
  active?: boolean
}

const props = defineProps<Props>()

const buttonBaseClass = [
  'px-3',
  'py-1.5',
  'rounded-md',
  'text-sm',
  'transition-colors',
  'relative',
  'focus:outline-none',
  'focus:bg-gray-300 dark:focus:bg-gray-600',
].join(' ')

const buttonActiveClass = 'text-white bg-gray-300 dark:bg-gray-600 cursor-default'
const buttonInactiveClass =
  'text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700'
const buttonClass = computed(
  () => `${buttonBaseClass} ${props.active ? buttonActiveClass : buttonInactiveClass}`,
)

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <button
    :class="buttonClass"
    :aria-label="`Search for ${term}`"
    @click="handleClick"
  >
    {{ term }}
  </button>
</template>
