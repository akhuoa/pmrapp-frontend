<script setup lang="ts">
import { computed, ref } from 'vue';
import CopyButton from '@/components/atoms/CopyButton.vue';

const props = defineProps<{
  modelTitle: string
  publicationTitle: string
  pageTitle: string
  modelAuthor: string
  publicationAuthors: string[][]
  issued: string
  url: string
  dateAccessed: string
  description?: string
}>()

const includeOptionalDetails = ref(true)

const getFirstNonEmpty = (...values: string[]) => {
  return values.find((value) => value.trim().length > 0)?.trim() || ''
}

const ensureSentence = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
}

const formatAuthorForCitation = (authorParts: string[]) => {
  if (!authorParts.length) return ''

  const familyName = (authorParts[0] || '').trim()
  const givenNames = authorParts.slice(1).map((name) => name.trim()).filter(Boolean)
  const initials = givenNames.map((name) => `${name[0]?.toUpperCase() || ''}.`).join(' ')

  if (!familyName) return initials
  if (!initials) return familyName
  return `${familyName}, ${initials}`
}

const normalizeUrl = (url: string) => {
  const trimmed = url.trim()
  if (!trimmed) return ''

  try {
    const parsed = new URL(trimmed)
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString()
  } catch {
    return trimmed.split('#')[0]?.split('?')[0] || ''
  }
}

const title = computed(() => {
  return getFirstNonEmpty(props.modelTitle, props.publicationTitle, props.pageTitle)
})

const publicationAuthors = computed(() => {
  const authors = props.publicationAuthors
    .map((author) => formatAuthorForCitation(author))
    .filter(Boolean)

  if (authors.length === 0) return ''
  if (authors.length === 1) return authors[0] || ''
  if (authors.length === 2) return `${authors[0]}, & ${authors[1]}`
  // For 3+ authors: "Author1, Author2, & Author3"
  return `${authors.slice(0, -1).join(', ')}, & ${authors[authors.length - 1]}`
})

const year = computed(() => {
  const match = props.issued.match(/\b\d{4}\b/)
  return match?.[0] || ''
})

const citationText = computed(() => {
  const parts: string[] = []
  const authorsPart = publicationAuthors.value
  const yearPart = year.value

  if (authorsPart && yearPart) {
    parts.push(`${authorsPart} (${yearPart}).`)
  } else if (authorsPart) {
    parts.push(ensureSentence(authorsPart))
  } else if (yearPart) {
    parts.push(`(${yearPart}).`)
  }

  if (title.value) {
    parts.push(ensureSentence(title.value))
  }

  const cleanUrl = normalizeUrl(props.url)
  if (cleanUrl) {
    parts.push(ensureSentence(cleanUrl))
  }

  if (includeOptionalDetails.value) {
    if (props.dateAccessed.trim()) {
      parts.push(ensureSentence(`Accessed ${props.dateAccessed.trim()}`))
    }
    if (props.modelAuthor.trim()) {
      parts.push(ensureSentence(`CellML author(s): ${props.modelAuthor.trim()}`))
    }
  }

  return parts.join(' ')
})
</script>

<template>
  <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
  <p class="mb-4" v-if="description">{{ description }}</p>
  <div class="group relative">
    <code class="block text-sm! break-words m-0! p-4 pr-8 bg-gray-50 dark:bg-gray-800 rounded-md">
      {{ citationText }}
    </code>
    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <CopyButton
        :text="citationText"
        title="Copy citation"
      />
    </div>
  </div>
  <div class="mt-3">
    <label class="inline-flex items-center gap-2 text-sm cursor-pointer">
      <input
        v-model="includeOptionalDetails"
        type="checkbox"
      >
      Include date accessed and model authors in citation
    </label>
  </div>
</template>
