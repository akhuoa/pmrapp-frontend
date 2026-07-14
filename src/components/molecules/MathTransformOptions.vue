<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Checkbox from '@/components/atoms/Checkbox.vue'
import Popover from '@/components/atoms/Popover.vue'
import { MATHML_FORMAT_OPTIONS } from '@/constants/mathml'
import { getMathFormatOptionsStorageService } from '@/services'
import type { MathMLFormatOptions } from '@/types/mathml'

interface Props {
  hasMathsData: boolean
  options: MathMLFormatOptions
}

const emit = defineEmits<{
  'update:options': [value: MathMLFormatOptions]
}>()

const props = defineProps<Props>()

const collapsed = ref(false)

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

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

onMounted(() => {
  const savedCollapsed = getMathFormatOptionsStorageService().loadCollapsed()
  if (savedCollapsed !== null) {
    collapsed.value = savedCollapsed
  }
})

watch(collapsed, (value) => {
  getMathFormatOptionsStorageService().saveCollapsed(value)
})
</script>

<template>
  <div
    v-if="hasMathsData"
    :class="stickyContainer"
  >
    <div :class="stickyContainerInner">
      <!-- Collapse/expand toggle button -->
      <button
        class="shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
        :aria-label="collapsed ? 'Expand math toolbar' : 'Collapse math toolbar'"
        :title="collapsed ? 'Expand math toolbar' : 'Collapse math toolbar'"
        @click="toggleCollapsed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-4 h-4"
          :class="collapsed ? 'rotate-180' : ''"
          aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" clip-rule="evenodd" />
        </svg>
        <span class="sr-only">{{ collapsed ? 'Expand math toolbar' : 'Collapse math toolbar' }}</span>
      </button>

      <!-- Collapsed state -->
      <template v-if="collapsed">
        <div
          v-for="option in MATHML_FORMAT_OPTIONS"
          :key="option.key"
          class="flex items-center"
        >
          <span
            class="inline-flex shrink-0 items-center rounded-full border bg-white px-2 py-0.5 text-xs tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            :class="!!options[option.key] ? 'border-primary': 'border-gray-200 dark:border-gray-700'"
            aria-hidden="true"
          >
            <span v-html="option.preview" :class="!!options[option.key] ? 'text-primary' : ''"></span>
          </span>
        </div>
      </template>

      <!-- Expanded state -->
      <template v-else>
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
      </template>
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
