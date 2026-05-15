<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ActionButton from '@/components/atoms/ActionButton.vue'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import type { MathMLFormatOptions } from '@/types/mathml'

interface Props {
  hasMathsData: boolean
  transformMaths: boolean
  options: MathMLFormatOptions
}

const emit = defineEmits<{
  'update:transformMaths': [value: boolean]
  'update:options': [value: MathMLFormatOptions]
}>()

const props = defineProps<Props>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLDivElement | null>(null)
const hasActiveFormatting = computed(
  () => props.transformMaths && Object.values(props.options).some(Boolean),
)
const formattingOptionsAriaLabel = computed(() =>
  hasActiveFormatting.value
    ? 'View math formatting options. Mathematics formatting is active.'
    : 'View math formatting options. Mathematics formatting is inactive.',
)

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
    key: 'subscript',
    label: 'Subscript',
  },
] as const

const toggleTransformMaths = () => {
  if (props.transformMaths) {
    emit('update:transformMaths', false)
    return
  }

  const hasEnabledOption = Object.values(props.options).some(Boolean)
  if (!hasEnabledOption) {
    emit('update:options', {
      subscript: true,
      digitGrouping: true,
      greekSymbols: true,
    })
  }

  emit('update:transformMaths', true)
}

const toggleOption = (key: keyof MathMLFormatOptions) => {
  const nextOptions = {
    ...props.options,
    [key]: !props.options[key],
  }

  emit('update:options', nextOptions)
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    v-if="hasMathsData"
    class="sticky top-24 z-30 flex justify-end mb-4"
  >
    <div class="relative inline-block" ref="dropdownRef">
      <ActionButton
        variant="secondary"
        customClasses="shadow-sm hover:shadow-none active:shadow-none"
        size="md"
        aria-haspopup="dialog"
        :aria-expanded="isOpen"
        aria-controls="math-format-options-panel"
        :aria-label="formattingOptionsAriaLabel"
        content-section="Exposure Detail - Mathematics"
        @click="isOpen = !isOpen"
      >
        <SettingsIcon class="w-4 h-4" />
        <span>Formatting</span>
        <ChevronDownIcon class="w-4 h-4" />
      </ActionButton>

      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          id="math-format-options-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Math formatting options"
          class="absolute top-full right-0 mt-2 w-80 rounded-md border border-gray-200 bg-white shadow-lg z-50 dark:border-gray-700 dark:bg-background"
        >
          <div class="p-3 space-y-3">
            <div class="flex items-center justify-between gap-4 rounded-md bg-gray-50 px-3 py-3 dark:bg-gray-800/70">
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Enable formatting</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Format mathematical expressions.</p>
              </div>
              <button
                type="button"
                role="switch"
                :aria-checked="transformMaths"
                class="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-background"
                :class="transformMaths ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'"
                @click="toggleTransformMaths"
              >
                <span class="sr-only">Enable formatting</span>
                <span
                  class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200"
                  :class="transformMaths ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>

            <div class="space-y-1">
              <label
                v-for="option in optionItems"
                :key="option.key"
                class="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors dark:text-gray-300"
                :class="transformMaths ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : 'cursor-not-allowed opacity-50'"
              >
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  :checked="options[option.key]"
                  :disabled="!transformMaths"
                  @change="toggleOption(option.key)"
                />
                <span class="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <span class="truncate">{{ option.label }}</span>
                  <span
                    class="inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    aria-hidden="true"
                  >
                    <span v-if="option.key === 'subscript'">x<sub class="text-[0.7em] leading-none">n</sub></span>
                    <span v-else-if="option.key === 'digitGrouping'">#,###</span>
                    <span v-else-if="option.key === 'greekSymbols'">α β</span>
                    <span v-else>10<sup class="text-[0.7em] leading-none">n</sup></span>
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </transition>

      <!-- Notification dot: shown when any option is enabled. -->
      <div
        class="pointer-events-none absolute top-0 right-0 -mt-1 -mr-1 block h-3 w-3 rounded-full bg-error"
        v-if="hasActiveFormatting"
        aria-hidden="true"
      ></div>
    </div>
  </div>
</template>
