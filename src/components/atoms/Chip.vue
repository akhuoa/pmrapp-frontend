<script setup lang="ts">
import CloseButton from '@/components/atoms/CloseButton.vue'

interface Props {
  label: string
  removable?: boolean
  onRemove?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  removable: false,
})

const handleRemoveChip = () => {
  if (props.onRemove) {
    props.onRemove()
  }
}
</script>

<template>
  <div
    class="inline-flex items-center gap-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-1 text-xs"
    :class="removable ? 'pl-2.5 pr-1' : 'px-2.5'"
  >
  <span class="truncate max-w-48">{{ label }}</span>
  <CloseButton
    v-if="removable"
    class="w-4 h-4 rounded-full p-0 hover:bg-gray-400 dark:hover:bg-gray-500"
    @click="handleRemoveChip"
    :aria-label="`Remove ${label}`"
  />
  </div>
</template>
