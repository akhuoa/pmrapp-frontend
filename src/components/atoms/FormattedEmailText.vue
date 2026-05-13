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
  const validEmailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
  const bracketedEmailRegex = /^(.*?)\s*<\s*([^<>@\s]+@[^<>\s]+)\s*>$/

  // Preferred format: "Author Name <author@email.com>".
  const authorEmailMatch = trimmedInput.match(bracketedEmailRegex)
  if (authorEmailMatch) {
    const authorName = authorEmailMatch[1].trim()
    const email = authorEmailMatch[2].trim()

    if (validEmailRegex.test(email)) {
      return [
        {
          value: authorName || email,
          email,
          isLinked: true,
        },
      ]
    }

    // For invalid bracketed emails (e.g. user@localhost), keep only the name.
    return [
      {
        value: authorName || input,
        email: '',
        isLinked: false,
      },
    ]
  }

  // Fallback for strings that still contain an email in another layout.
  const emailMatch = trimmedInput.match(validEmailRegex)
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
