<script setup lang="ts">
import ActionButton from '@/components/atoms/ActionButton.vue'

interface Props {
  label?: string
  contentSection?: string
  onClick?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Back',
  contentSection: 'navigation',
})

const handleClick = () => {
  if (props.onClick) {
    props.onClick()
  }
}
</script>

<template>
  <div class="mb-4">
    <ActionButton
      variant="link"
      :content-section="contentSection"
      @click="handleClick"
    >
      &larr; {{ label }}
    </ActionButton>
  </div>
</template>
