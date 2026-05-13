<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  text: string
}>()

type Segment = {
  value: string
  email: string
  isLinked: boolean
}

const segments = computed<Segment[]>(() => {
  const input = props.text || ''
  if (!input) return []

  const trimmedInput = input.trim()
  const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/

  // Preferred format: "Author Name <author@email.com>".
  const authorEmailMatch = trimmedInput.match(
    /^(.*?)\s*<\s*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\s*>$/,
  )
  if (authorEmailMatch) {
    const authorName = authorEmailMatch[1].trim()
    const email = authorEmailMatch[2].trim()

    return [
      {
        value: authorName || email,
        email,
        isLinked: true,
      },
    ]
  }

  // Fallback for strings that still contain an email in another layout.
  const emailMatch = trimmedInput.match(emailRegex)
  if (emailMatch) {
    const email = emailMatch[0]
    const textWithoutEmail = trimmedInput.replace(email, '').replace(/[<>]/g, '').trim()

    return [
      {
        value: textWithoutEmail || email,
        email,
        isLinked: true,
      },
    ]
  }

  return [
    {
      value: input,
      email: '',
      isLinked: false,
    },
  ]
})
</script>

<template>
  <span>
    <template
      v-for="(segment, index) in segments"
      :key="`${index}-${segment.value}`"
    >
      <a
        v-if="segment.isLinked"
        :href="`mailto:${segment.email}`"
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
