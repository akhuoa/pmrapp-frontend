<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BackButton from '@/components/atoms/BackButton.vue'
import CopyButton from '@/components/atoms/CopyButton.vue'
import LoadingBox from '@/components/atoms/LoadingBox.vue'
import CodeIcon from '@/components/icons/CodeIcon.vue'
import DownloadIcon from '@/components/icons/DownloadIcon.vue'
import ErrorBlock from '@/components/molecules/ErrorBlock.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import { useBackNavigation } from '@/composables/useBackNavigation'
import { getWorkspaceService } from '@/services'
import { downloadFileFromContent } from '@/utils/download'
import { isCodeFile, isImageFile, isMarkdownFile, isSvgFile } from '@/utils/file'
import { renderMarkdown } from '@/utils/markdown'
import ActionButton from '../atoms/ActionButton.vue'

const props = defineProps<{
  alias: string
  commitId: string
  path: string
}>()

const fileContent = ref<string>('')
const fileBlobUrl = ref<string>('')
const error = ref<string | null>(null)
const isLoading = ref(true)
const showCode = ref(false)

const backPath = computed(() => {
  const lastSlash = props.path.lastIndexOf('/')
  if (lastSlash === -1) {
    // File in root - go to root workspace.
    return `/workspaces/${props.alias}`
  }
  // Go to parent folder.
  const parentPath = props.path.substring(0, lastSlash)
  return `/workspaces/${props.alias}/file/${props.commitId}/${parentPath}`
})

const { goBack } = useBackNavigation(backPath.value)

const isImage = computed(() => isImageFile(props.path))
const isSvg = computed(() => isSvgFile(props.path))
const isMarkdown = computed(() => isMarkdownFile(props.path))
const isCode = computed(() => isCodeFile(props.path))

const shouldShowAsText = computed(() => {
  return isCode.value || (isSvg.value && showCode.value) || (isMarkdown.value && showCode.value)
})

const shouldShowPreview = computed(() => {
  return (isSvg.value || isMarkdown.value) && !showCode.value
})

const renderedMarkdown = computed(() => {
  if (!isMarkdown.value || !fileContent.value) return ''
  return renderMarkdown(fileContent.value)
})

const imageDataUrl = computed(() => {
  if (!isImage.value) return ''
  return fileBlobUrl.value
})

const downloadFile = () => {
  downloadFileFromContent(fileContent.value, props.path)
}

const toggleCodeView = () => {
  showCode.value = !showCode.value
}

onMounted(async () => {
  try {
    // Fetch images and SVGs as blobs.
    if (isImage.value || isSvg.value) {
      const blob = await getWorkspaceService().getRawFileBlob(
        props.alias,
        props.commitId,
        props.path,
      )
      fileBlobUrl.value = URL.createObjectURL(blob)

      // For SVG, also get text content for code view.
      if (isSvg.value) {
        fileContent.value = await blob.text()
      }
    } else {
      // Fetch text files as text.
      fileContent.value = await getWorkspaceService().getRawFile(
        props.alias,
        props.commitId,
        props.path,
      )
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load file.'
    console.error('Error loading file:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <BackButton
    label="Back"
    content-section="Workspace File Detail"
    :on-click="goBack"
  />

  <ErrorBlock
    v-if="error"
    title="Error loading file"
    :error="error"
  />

  <LoadingBox v-else-if="isLoading" message="Loading file..." />

  <div v-else-if="fileContent !== null">
    <PageHeader :title="path" />

    <div class="box p-0! overflow-hidden">
      <div class="flex items-center justify-end px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <button
            v-if="isSvg || isMarkdown"
            @click="toggleCodeView"
            class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            :title="showCode ? 'Show preview' : 'Show code'"
          >
            <CodeIcon class="w-4 h-4" />
            {{ showCode ? 'Preview' : 'Code' }}
          </button>
          <button
            @click="downloadFile"
            class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Download file"
          >
            <DownloadIcon class="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <!-- SVG Rendered View -->
      <div v-if="isSvg && shouldShowPreview" class="flex justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded">
        <img :src="fileBlobUrl" :alt="path" class="max-w-full h-auto" />
      </div>

      <!-- Markdown Preview -->
      <div v-else-if="isMarkdown && shouldShowPreview" class="p-8">
        <div class="max-w-none" v-html="renderedMarkdown"></div>
      </div>

      <!-- Image View -->
      <div v-else-if="isImage && imageDataUrl" class="flex justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded">
        <img :src="imageDataUrl" :alt="path" class="max-w-full h-auto" />
      </div>

      <!-- Code/Text View -->
      <div v-else-if="shouldShowAsText" class="relative">
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded overflow-x-auto text-sm"><code>{{ fileContent }}</code></pre>

        <div class="absolute top-2 right-2">
          <CopyButton :text="fileContent" title="Copy code" />
        </div>
      </div>

      <!-- Binary/Unknown File Type -->
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        <p class="mb-4">This file type cannot be displayed.</p>
        <ActionButton
          variant="primary"
          size="lg"
          @click="downloadFile"
          :download="true"
          content-section="Workspace File Detail"
        >
          <DownloadIcon class="w-4 h-4" />
          Download File
        </ActionButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/box.css';

pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}

code {
  font-family: inherit;
}
</style>
