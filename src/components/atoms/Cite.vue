<script setup lang="ts">
import { computed } from 'vue'
import CopyButton from '@/components/atoms/CopyButton.vue'
import { formatCitation, normaliseUrl, parseFullNameToAuthor } from '@/utils/citation'
import type { Author } from '@/types/citation';

const props = defineProps<{
  title: string
  modelAuthor: string
  authors?: Author[]
  url: string
  issued?: string
}>()

const modelExposureURL = computed(() => {
  return normaliseUrl(props.url)
})

const authors = computed(() => {
  const author = parseFullNameToAuthor(props.modelAuthor)
  return author ? [author] : []
})

const citation = computed(() => {
  return {
    title: props.title,
    authors: authors.value,
    issued: props.issued,
    url: modelExposureURL.value,
    publisher: 'Physiome Model Repository',
  }
})
</script>

<template>
  <div>
    <div>
      <div class="group relative">
        <div class="block text-sm! m-0! p-4 pr-8 bg-gray-50 dark:bg-gray-900 rounded-md break-words">
          {{ formatCitation(citation) }}
        </div>
        <div class="absolute -top-6 right-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <CopyButton
            :text="formatCitation(citation)"
            title="Copy citation"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/text-link.css';
</style>
