<script setup lang="ts">
import { ref } from 'vue'
import SearchIcon from '../icons/SearchIcon.vue'
import CloseButton from './CloseButton.vue'

interface Props {
  modelValue: string
  placeholder?: string
  ariaLabel?: string
  inputClass?: string
  withSearchButton?: boolean
  chips?: Array<{ id: string; label: string }>
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  ariaLabel: 'Search',
  inputClass: '',
  withSearchButton: false,
  chips: () => [],
})

const inputPaddingClass = props.withSearchButton ? 'pr-[5.5rem]!' : 'pr-[2.5rem]!'

const emit = defineEmits<{
  'update:modelValue': [value: string]
  removeChip: [chipId: string]
  search: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  keyup: [event: KeyboardEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleClear = () => {
  emit('update:modelValue', '')
  inputRef.value?.focus()
}

const handleSearchClick = () => {
  emit('search')
}

const handleRemoveChip = (chipId: string) => {
  emit('removeChip', chipId)
  inputRef.value?.focus()
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const handleKeyup = (event: KeyboardEvent) => {
  emit('keyup', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

defineExpose({
  inputRef,
  focus: () => inputRef.value?.focus(),
})
</script>

<template>
  <div class="relative flex items-center" :class="{'overflow-hidden': props.withSearchButton}">
    <div
      class="flex flex-1 flex-wrap items-center gap-2 pl-4"
      :class="[inputPaddingClass, inputClass]"
      @click="inputRef?.focus()"
    >
      <div
        v-for="chip in props.chips"
        :key="chip.id"
        class="inline-flex items-center gap-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2.5 text-xs"
      >
        <span class="truncate max-w-48">{{ chip.label }}</span>
        <CloseButton
          @click="handleRemoveChip(chip.id)"
          :aria-label="`Remove ${chip.label}`"
        />
      </div>
      <input
        ref="inputRef"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        class="flex-1 min-w-32 outline-none bg-transparent"
        @input="handleInput"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>
    <div
      v-if="modelValue"
      class="absolute flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer p-1"
      :class="props.withSearchButton ? 'right-12' : 'right-2'"
    >
      <CloseButton
        @click="handleClear"
        aria-label="Clear search"
      />
    </div>
    <button
      v-if="props.withSearchButton"
      type="button"
      class="absolute inset-y-0 right-0 flex items-center justify-center px-3 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:bg-transparent"
      aria-label="Search"
      :disabled="!modelValue"
      @click="handleSearchClick"
    >
      <SearchIcon class="w-4 h-4" />
    </button>
  </div>
</template>

<style scoped>
@import '@/assets/input.css';
</style>
