<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  text: string
}>()

type Segment = {
  value: string
  isEmail: boolean
}

const segments = computed<Segment[]>(() => {
  const input = props.text || ''
  if (!input) return []

  const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
  const result: Segment[] = []
  let lastIndex = 0

  for (const match of input.matchAll(emailRegex)) {
    const email = match[0]
    const startIndex = match.index ?? -1
    if (startIndex < 0) continue

    if (startIndex > lastIndex) {
      result.push({
        value: input.slice(lastIndex, startIndex),
        isEmail: false,
      })
    }

    result.push({
      value: email,
      isEmail: true,
    })

    lastIndex = startIndex + email.length
  }

  if (lastIndex < input.length) {
    result.push({
      value: input.slice(lastIndex),
      isEmail: false,
    })
  }

  if (result.length === 0) {
    result.push({
      value: input,
      isEmail: false,
    })
  }

  return result
})
</script>

<template>
  <span>
    <template
      v-for="(segment, index) in segments"
      :key="`${index}-${segment.value}`"
    >
      <a
        v-if="segment.isEmail"
        :href="`mailto:${segment.value}`"
        class="text-link"
      >
        {{ segment.value }}
      </a>
      <span v-else>{{ segment.value }}</span>
    </template>
  </span>
</template>

<style scoped>
@import '@/assets/text-link.css';
</style>
