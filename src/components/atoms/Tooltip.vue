<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    anchorEl?: HTMLElement | null
    offset?: number
    visible: boolean
  }>(),
  {
    anchorEl: null,
    offset: 8,
  },
)

const tooltipTop = ref(0)
const tooltipLeft = ref(0)

const updatePosition = () => {
  if (!props.anchorEl) return

  const rect = props.anchorEl.getBoundingClientRect()
  tooltipTop.value = rect.top - props.offset
  tooltipLeft.value = rect.left + rect.width / 2
}

watch(
  () => props.visible,
  async (isVisible) => {
    if (isVisible) {
      await nextTick()
      updatePosition()
    }
  },
  { immediate: true },
)

watch(
  () => props.anchorEl,
  (anchor) => {
    if (props.visible && anchor) {
      updatePosition()
    }
  },
)

const handleViewportChange = () => {
  if (props.visible) {
    updatePosition()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleViewportChange, true)
  window.addEventListener('resize', handleViewportChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleViewportChange, true)
  window.removeEventListener('resize', handleViewportChange)
})
</script>

<template>
  <Teleport to="body">
    <span
      v-if="visible"
      class="fixed z-[9999] -translate-x-1/2 -translate-y-full bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none"
      :style="{ top: `${tooltipTop}px`, left: `${tooltipLeft}px` }"
    >
      <slot />
    </span>
  </Teleport>
</template>
