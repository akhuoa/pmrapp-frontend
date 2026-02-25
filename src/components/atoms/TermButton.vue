<script setup lang="ts">
interface Props {
  term: string
  active?: boolean
}

const props = defineProps<Props>()

const buttonBaseClass = [
  'px-3',
  'py-1.5',
  'text-gray-600',
  'dark:text-gray-300',
  'rounded-md',
  'text-sm',
  'transition-colors',
  'relative',
  'focus:outline-none',
  'focus:bg-gray-300 dark:focus:bg-gray-600',
].join(' ')

const buttonActiveClass = 'bg-gray-300 dark:bg-gray-600 cursor-default'
const buttonInactiveClass = 'bg-gray-200 dark:bg-gray-800 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700'
const buttonClass = `${buttonBaseClass} ${props.active ? buttonActiveClass : buttonInactiveClass}`

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
