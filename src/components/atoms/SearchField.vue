<script setup lang="ts">
import { ref } from 'vue'
import ArrowRightIcon from '../icons/ArrowRightIcon.vue'
import SearchIcon from '../icons/SearchIcon.vue'
import CloseButton from './CloseButton.vue'

interface Props {
  modelValue: string
  placeholder?: string
  ariaLabel?: string
  inputClass?: string
  withSearchButton?: boolean
  withAdvancedButton?: boolean
  advancedSearchActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  ariaLabel: 'Search',
  inputClass: '',
  withSearchButton: false,
  withAdvancedButton: false,
  advancedSearchActive: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keyup: [event: KeyboardEvent]
  'advanced-search': []
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

const handleAdvancedSearchClick = () => {
  emit('advanced-search')
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
  <div class="relative flex items-center " :class="{'overflow-hidden': props.withSearchButton}">
    <div class="relative flex items-center w-full">
      <input
        ref="inputRef"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        :class="inputClass"
        @input="handleInput"
        @keyup="handleKeyup"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div
        v-if="modelValue"
        class="flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer p-1"
        :class="props.withSearchButton ? '' : 'absolute right-2'"
      >
        <CloseButton
          @click="handleClear"
          aria-label="Clear search"
        />
      </div>
      <button
        v-if="props.withAdvancedButton"
        type="button"
        class="flex items-center justify-center p-2 text-primary cursor-pointer"
        aria-label="Advanced Search"
        @click="handleAdvancedSearchClick"
      >
        <span class="text-sm pr-1">Advanced</span>
        <ArrowRightIcon
          class="w-4 h-4"
          :style="{ transform: props.advancedSearchActive ? 'rotate(-90deg)' : 'rotate(90deg)' }"
        />
      </button>
    </div>
    <button
      v-if="props.withSearchButton"
      type="button"
      class="flex items-center justify-center p-3 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:bg-transparent"
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
