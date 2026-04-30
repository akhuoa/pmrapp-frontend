<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BackButton from '@/components/atoms/BackButton.vue'
import CodeBlock from '@/components/atoms/CodeBlock.vue'
import CopyButton from '@/components/atoms/CopyButton.vue'
import LoadingBox from '@/components/atoms/LoadingBox.vue'
import WrapButton from '@/components/atoms/WrapButton.vue'
import CodeIcon from '@/components/icons/CodeIcon.vue'
import DownloadIcon from '@/components/icons/DownloadIcon.vue'
import ExternalLinkIcon from '@/components/icons/ExternalLinkIcon.vue'
import PreviewIcon from '@/components/icons/PreviewIcon.vue'
import ErrorBlock from '@/components/molecules/ErrorBlock.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import { useBackNavigation } from '@/composables/useBackNavigation'
import { getWorkspaceService } from '@/services'
import { downloadFileFromBlob } from '@/utils/download'
import {
  isCodeFile,
  isImageFile,
  isMarkdownFile,
  isOpenCORFile,
  isPdfFile,
  isSvgFile,
} from '@/utils/file'
import { renderMarkdown } from '@/utils/markdown'
import ActionButton from '../atoms/ActionButton.vue'

// Files with size above this threshold are not rendered in the preview to prevent browser freeze.
const MAX_PREVIEW_FILE_SIZE_BYTES = 500 * 1024 // ~500 KB

const props = defineProps<{
  alias: string
  commitId: string
  path: string
}>()

const fileContent = ref<string>('')
const fileBlob = ref<Blob>(new Blob())
const fileBlobUrl = ref<string>('')
const fileSizeBytes = ref(0)
const workspaceURL = ref<string>('')
const isOpenCORURLLoading = ref(false)
const error = ref<string | null>(null)
const isLoading = ref(true)
const showCode = ref(false)
const codeBlockRef = ref<InstanceType<typeof CodeBlock> | null>(null)

// Extract filename from full path for download purposes.
const filename = computed(() => {
  const lastSlash = props.path.lastIndexOf('/')
  return lastSlash === -1 ? props.path : props.path.substring(lastSlash + 1)
})

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
const isPDF = computed(() => isPdfFile(props.path))
const isSvg = computed(() => isSvgFile(props.path))
const isMarkdown = computed(() => isMarkdownFile(props.path))
const isCode = computed(() => isCodeFile(props.path))
const isOpenCOR = computed(() => isOpenCORFile(props.path))
const canShowOpenCORButton = computed(
  () => isOpenCOR.value && !isOpenCORURLLoading.value && !!openCORFileURL.value,
)

const openCORFileURL = computed(() => {
  if (!workspaceURL.value) return ''

  const rawFileURL = `${workspaceURL.value}rawfile/${props.commitId}/${props.path}`
  const opencorLink = `opencor://openFile/${rawFileURL}`
  return `//opencor.ws/app/?${opencorLink}`
})

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

// Fast guard: avoid rendering very large payloads in the browser preview.
const isTooLargeForPreview = computed(() => fileSizeBytes.value > MAX_PREVIEW_FILE_SIZE_BYTES)

const downloadFile = () => {
  downloadFileFromBlob(fileBlob.value, filename.value)
}

const toggleCodeView = () => {
  showCode.value = !showCode.value
}

const toggleCodeWrap = () => {
  codeBlockRef.value?.toggleWrap()
}

const loadWorkspaceURLForOpenCOR = async () => {
  if (!isOpenCOR.value) return

  isOpenCORURLLoading.value = true
  try {
    const workspaceInfo = await getWorkspaceService().getWorkspaceInfo(
      props.alias,
      props.commitId,
      '',
    )
    workspaceURL.value = workspaceInfo.workspace.url
  } catch (workspaceErr) {
    console.error('Error loading workspace URL for OpenCOR link:', workspaceErr)
  } finally {
    isOpenCORURLLoading.value = false
  }
}

onMounted(async () => {
  // OpenCOR link data loads separately so file preview is not blocked.
  void loadWorkspaceURLForOpenCOR()

  try {
    const blob = await getWorkspaceService().getRawFileBlob(props.alias, props.commitId, props.path)
    fileBlob.value = blob
    fileSizeBytes.value = blob.size

    // Image-like previews use an object URL from the blob.
    if (isImage.value || isSvg.value || isPDF.value) {
      fileBlobUrl.value = URL.createObjectURL(blob)

      // For SVG, also get text content for code view.
      if (isSvg.value) {
        fileContent.value = await blob.text()
      }
    } else {
      // Skip text decode for oversized code-like previews; download remains available via blob.
      if (!isTooLargeForPreview.value || isMarkdown.value) {
        fileContent.value = await blob.text()
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load file.'
    console.error('Error loading file:', err)
  } finally {
    isLoading.value = false
  }
})

onBeforeUnmount(() => {
  // Revoke blob URL to prevent memory leaks.
  if (fileBlobUrl.value) {
    URL.revokeObjectURL(fileBlobUrl.value)
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

  <div v-else>
    <PageHeader :title="path" />

    <div class="box p-0! overflow-hidden">
      <div class="flex items-center justify-end px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <ActionButton
            v-if="canShowOpenCORButton"
            variant="secondary"
            size="sm"
            content-section="Workspace File Detail"
            :href="openCORFileURL"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Open with OpenCOR's Web app</span>
            <ExternalLinkIcon class="w-4 h-4" />
          </ActionButton>
          <button
            v-if="isSvg || isMarkdown"
            @click="toggleCodeView"
            class="flex items-center cursor-pointer gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <PreviewIcon class="w-4 h-4" v-if="showCode" />
            <CodeIcon class="w-4 h-4" v-else />
            {{ showCode ? 'Preview' : 'Code' }}
          </button>
          <WrapButton
            v-if="shouldShowAsText && !isTooLargeForPreview"
            :disabled="(isSvg || isMarkdown) ? !showCode : false"
            :active="codeBlockRef?.isWrapped"
            @click="toggleCodeWrap"
          />
          <CopyButton
            v-if="shouldShowAsText && !isTooLargeForPreview"
            :text="fileContent"
            title="Copy code"
          />
          <ActionButton
            variant="icon"
            content-section="Workspace File Detail"
            @click="downloadFile"
            tooltip="Download"
            :aria-label="'Download'"
          >
            <DownloadIcon class="w-4 h-4" />
            <span class="sr-only">Download</span>
          </ActionButton>
        </div>
      </div>

      <!-- SVG Rendered View -->
      <div v-if="isSvg && shouldShowPreview" class="flex justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded">
        <img :src="fileBlobUrl" :alt="path" class="max-w-full h-auto" />
      </div>

      <!-- Markdown Preview -->
      <div v-else-if="isMarkdown && shouldShowPreview" class="p-4">
        <div class="max-w-none" v-html="renderedMarkdown"></div>
      </div>

      <!-- Image View -->
      <div v-else-if="isImage && imageDataUrl" class="flex justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded">
        <img :src="imageDataUrl" :alt="path" class="max-w-full h-auto" />
      </div>

      <!-- PDF View -->
      <div v-else-if="isPDF" class="flex justify-center">
        <embed :src="fileBlobUrl" type="application/pdf" width="100%" height="800px" />
      </div>

      <!-- Code/Text View (Too Large) -->
      <div v-else-if="shouldShowAsText && isTooLargeForPreview" class="text-center py-8 text-gray-500 dark:text-gray-400">
        <p class="mb-4">This file is too large to preview in the browser.</p>
        <ActionButton
          variant="primary"
          size="lg"
          @click="downloadFile"
          content-section="Workspace File Detail"
        >
          <DownloadIcon class="w-4 h-4" />
          Download
        </ActionButton>
      </div>

      <!-- Code/Text View -->
      <div v-else-if="shouldShowAsText" class="relative">
        <CodeBlock
          ref="codeBlockRef"
          :code="fileContent"
          :filename="filename"
        />
      </div>

      <!-- Binary/Unknown File Type -->
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        <p class="mb-4">This file type cannot be displayed.</p>
        <ActionButton
          variant="primary"
          size="lg"
          @click="downloadFile"
          content-section="Workspace File Detail"
        >
          <DownloadIcon class="w-4 h-4" />
          Download
        </ActionButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/box.css';
</style>
