<script setup lang="ts">
import type { MathMLFormatOptions } from '@/types/mathml'

interface Props {
  hasMathsData: boolean
  options: MathMLFormatOptions
}

const emit = defineEmits<{
  'update:options': [value: MathMLFormatOptions]
}>()

const props = defineProps<Props>()

const optionItems = [
  {
    key: 'digitGrouping',
    label: 'Digit Grouping',
  },
  {
    key: 'greekSymbols',
    label: 'Greek Symbols',
  },
  {
    key: 'subscripts',
    label: 'Subscripts',
  },
] as const

const containerClasses = [
  'sticky-container',
  'sticky top-20 left-0 right-0 px-4 py-3 z-20',
  'flex items-center justify-end gap-2',
  'border-b border-gray-200 dark:border-gray-700 rounded-t-lg',
  'bg-gray-50 dark:bg-gray-800',
]

const toggleOption = (key: keyof MathMLFormatOptions) => {
  const nextOptions = {
    ...props.options,
    [key]: !props.options[key],
  }

  emit('update:options', nextOptions)
}
</script>

<template>
  <div
    v-if="hasMathsData"
    :class="containerClasses"
  >
    <span class="text-sm font-semibold text-gray-500 dark:text-gray-400">Formatting:</span>
    <label
      v-for="option in optionItems"
      :key="option.key"
      class="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 select-none"
    >
      <input
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        :checked="options[option.key]"
        @change="toggleOption(option.key)"
      />
      <span>{{ option.label }}</span>
      <span
        class="inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        aria-hidden="true"
      >
        <span v-if="option.key === 'digitGrouping'">#,###</span>
        <span v-else-if="option.key === 'greekSymbols'">α β</span>
        <span v-else-if="option.key === 'subscripts'">x<sub class="text-[0.7em] leading-none">n</sub></span>
      </span>
    </label>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.sticky-container {
  container-type: scroll-state;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -1px;
    right: -1px;
    bottom: 0;
    background-color: transparent;
    z-index: -1;
  }
}

@container scroll-state(stuck: top) {
  .sticky-container::before {
    @apply bg-gray-200 dark:bg-gray-700 shadow-lg;
  }
}
</style>
