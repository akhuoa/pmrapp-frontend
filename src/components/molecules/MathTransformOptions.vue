<script setup lang="ts">
import Checkbox from '@/components/atoms/Checkbox.vue'
import Popover from '@/components/atoms/Popover.vue'
import { MATHML_FORMAT_OPTIONS } from '@/constants/mathml'
import type { MathMLFormatOptions } from '@/types/mathml'

interface Props {
  hasMathsData: boolean
  options: MathMLFormatOptions
}

const emit = defineEmits<{
  'update:options': [value: MathMLFormatOptions]
}>()

const props = defineProps<Props>()

const stickyContainer = ['sticky-container', 'sticky top-20 left-0 right-0 p-4 z-20']

const stickyContainerInner = [
  'sticky-container-inner',
  'p-3 ml-auto w-fit text-sm flex items-center justify-end gap-4',
  'border border-gray-200 dark:border-gray-700 rounded-lg',
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
    :class="stickyContainer"
  >
    <div :class="stickyContainerInner">
      <span class="hidden md:inline font-semibold text-gray-500 dark:text-gray-400">Formatting:</span>
      <div
        v-for="option in MATHML_FORMAT_OPTIONS"
        :key="option.key"
        class="flex"
      >
        <Popover>
          <template #trigger>
            <Checkbox
              :model-value="!!options[option.key]"
              @update:model-value="toggleOption(option.key)"
            >
              <span class="flex items-center gap-1.5 text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <span class="text-xs sm:text-sm">{{ option.label }}</span>
                <span
                  class="hidden md:inline-flex shrink-0 items-center rounded-full border bg-white px-1.5 py-0.5 text-xs tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  :class="!!options[option.key] ? 'border-primary': 'border-gray-200 dark:border-gray-700'"
                  aria-hidden="true"
                >
                  <span v-html="option.preview" :class="!!options[option.key] ? 'text-primary' : ''"></span>
                </span>
              </span>
            </Checkbox>
          </template>
          <template #content>
            <p class="mb-3 text-gray-500 dark:text-gray-400">{{ option.description }}</p>
            <code
              class="block text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 p-2 text-center rounded"
              v-html="option.example"
            ></code>
          </template>
        </Popover>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

:deep(math mi) {
  @apply italic;
}

:deep(math + math) {
  @apply text-gray-700 dark:text-gray-300;
}

.sticky-container {
  container-type: scroll-state;
}

@container scroll-state(stuck: top) {
  .sticky-container-inner {
    @apply shadow-lg dark:shadow-gray-900;
  }
}
</style>
