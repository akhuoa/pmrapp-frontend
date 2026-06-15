<script setup lang="ts">
import { computed, ref } from 'vue'
import CopyButton from '@/components/atoms/CopyButton.vue'
import { ensureSentence, normaliseUrl } from '@/utils/citation'
import { formatAccessDate } from '@/utils/format'

const props = defineProps<{
  modelTitle: string
  pageTitle: string
  modelAuthor: string
  url: string
  dateAccessed: Date
}>()

const includeOptionalDetails = ref(true)

const modelName = computed(() => {
  const titleToUse = props.modelTitle || props.pageTitle
  return ensureSentence(titleToUse)
})

const modelExposureURL = computed(() => {
  return normaliseUrl(props.url)
})

const formattedModelAuthor = computed(() => {
  if (props.modelAuthor.trim()) {
    return `CellML author(s): ${props.modelAuthor.trim()}`
  }
  return ''
})

const formattedAccessDate = computed(() => {
  if (includeOptionalDetails.value && props.dateAccessed) {
    const formattedDate = formatAccessDate(props.dateAccessed)
    if (formattedDate) {
      return formattedDate
    }
  }
  return ''
})

const citationTextClipboard = computed(() => {
  const parts: string[] = []

  if (modelName.value) {
    parts.push(modelName.value)
  }

  if (modelExposureURL.value) {
    parts.push(modelExposureURL.value)
  }

  if (formattedAccessDate.value) {
    parts.push(formattedAccessDate.value)
  }

  if (formattedModelAuthor.value) {
    parts.push(formattedModelAuthor.value)
  }

  return parts.join(' ')
})
</script>

<template>
  <div class="group relative">
    <code class="block text-sm! m-0! p-4 pr-8 bg-gray-50 dark:bg-gray-900 rounded-md">
      <div>
        <span v-if="modelName">{{ modelName }}</span>
        <a
          v-if="modelExposureURL"
          :href="modelExposureURL"
          target="_blank"
          rel="noopener noreferrer"
          class="text-link break-all"
        >&nbsp;{{ modelExposureURL }}</a>
      </div>
      <div v-if="formattedAccessDate">{{ formattedAccessDate }}</div>
      <div>{{ formattedModelAuthor }}</div>
    </code>
    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <CopyButton
        :text="citationTextClipboard"
        title="Copy citation"
      />
    </div>
  </div>
  <div class="mt-3 text-right">
    <label class="inline-flex items-center gap-2 text-sm cursor-pointer">
      <input
        v-model="includeOptionalDetails"
        type="checkbox"
      >
      Include date accessed in citation.
    </label>
  </div>
</template>

<style scoped>
@import '@/assets/text-link.css';
</style>
