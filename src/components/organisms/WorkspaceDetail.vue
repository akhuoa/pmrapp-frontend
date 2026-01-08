<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '@/components/atoms/BackButton.vue'
import LoadingBox from '@/components/atoms/LoadingBox.vue'
import FileIcon from '@/components/icons/FileIcon.vue'
import FolderIcon from '@/components/icons/FolderIcon.vue'
import DownloadIcon from '@/components/icons/DownloadIcon.vue'
import ErrorBlock from '@/components/molecules/ErrorBlock.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import type { WorkspaceInfo } from '@/types/workspace'
import { downloadWorkspaceFile } from '@/utils/download'

const props = defineProps<{
  alias: string,
  commitId?: string,
  path?: string,
}>()

const router = useRouter()
const workspaceStore = useWorkspaceStore()
const workspaceInfo = ref<WorkspaceInfo | null>(null)
const error = ref<string | null>(null)
const isLoading = ref(true)

const backPath = computed(() => {
  if (!props.path) {
    // Root workspace - go to workspaces listing.
    return '/workspaces'
  }
  // Extract parent folder path.
  const lastSlash = props.path.lastIndexOf('/')
  if (lastSlash === -1) {
    // File/folder in root - go to root workspace
    return `/workspaces/${props.alias}`
  }
  // Go to parent folder.
  const parentPath = props.path.substring(0, lastSlash)
  return `/workspaces/${props.alias}/folder/${props.commitId}/${parentPath}`
})

const goBack = () => {
  const basePath = !props.path ? '/workspaces' : `/workspaces/${props.alias}`

  // Check browser history to preserve query state (search filters).
  if (
    window.history.state.back?.includes(basePath) &&
    !window.history.state.back?.includes(`${basePath}/`)
  ) {
    // Go back in browser history to preserve filters.
    router.back()
  } else {
    // Navigate to computed back path.
    router.push(backPath.value)
  }
}

const fileCountText = computed(() => {
  if (!workspaceInfo.value) return ''
  const count = workspaceInfo.value.target.TreeInfo.filecount
  return `${count} ${count === 1 ? 'file' : 'files'}`
})

const sortedEntries = computed(() => {
  if (!workspaceInfo.value) return []

  const entries = [...workspaceInfo.value.target.TreeInfo.entries]

  return entries.sort((a, b) => {
    // Folders first.
    if (a.kind === 'tree' && b.kind !== 'tree') return -1
    if (a.kind !== 'tree' && b.kind === 'tree') return 1

    // Both folders or both files - sort by name.
    // Dotfiles (starting with ".") come before other files.
    const aIsDotfile = a.name.startsWith('.')
    const bIsDotfile = b.name.startsWith('.')

    if (aIsDotfile && !bIsDotfile) return -1
    if (!aIsDotfile && bIsDotfile) return 1

    // Alphabetically (case-insensitive, but capitals before lowercase for same letter).
    return a.name.localeCompare(b.name, 'en', { numeric: true })
  })
})

const downloadFile = async (entry: any) => {
  const alias = props.alias
  const commitId = workspaceInfo.value?.commit.commit_id
  if (!commitId) return
  const filename = (props.path ? props.path + '/' : '') + entry.name
  await downloadWorkspaceFile(alias, commitId, filename)
}

const loadWorkspaceInfo = async () => {
  isLoading.value = true
  error.value = null

  try {
    const alias = props.alias
    const commitId = props.commitId || ''
    const path = props.path || ''
    workspaceInfo.value = await workspaceStore.getWorkspaceInfo(alias, commitId, path)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load workspace.'
    console.error('Error loading workspace:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadWorkspaceInfo)

// Watch for changes in props to reload data when navigating between folders.
watch(() => [props.alias, props.commitId, props.path], loadWorkspaceInfo)
</script>

<template>
  <BackButton
    label="Back"
    content-section="Workspace Detail"
    :on-click="goBack"
  />

  <ErrorBlock
    v-if="error"
    title="Error loading workspace"
    :error="error"
  />

  <LoadingBox v-else-if="isLoading" message="Loading workspace..." />

  <div v-else-if="workspaceInfo">
    <PageHeader
      :title="workspaceInfo.workspace.description || alias"
    />

    <div class="mb-6 space-y-2">
      <div>
        <span class="font-medium text-gray-600 dark:text-gray-400">Git Repository URL:</span>
        <a
          :href="workspaceInfo.workspace.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-link ml-2"
        >
          {{ workspaceInfo.workspace.url }}
        </a>
      </div>
      <div v-if="workspaceInfo.commit.author">
        <span class="font-medium text-gray-600 dark:text-gray-400">Author:</span>
        <span class="ml-2">{{ workspaceInfo.commit.author }}</span>
      </div>
    </div>

    <div class="box p-0! overflow-hidden">
      <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <span class="text-gray-600 dark:text-gray-400">
          {{ fileCountText }}
        </span>
      </div>
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li
          v-for="entry in sortedEntries"
          :key="entry.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div class="px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <FolderIcon v-if="entry.kind === 'tree'" class="text-gray-500 dark:text-gray-400 flex-shrink-0 w-4 h-4" />
              <FileIcon v-else class="text-gray-500 dark:text-gray-400 flex-shrink-0 w-4 h-4" />

              <RouterLink
                v-if="entry.kind === 'tree'"
                :to="`/workspaces/${props.alias}/folder/${workspaceInfo.commit.commit_id}/${(props.path ? props.path + '/' : '') + entry.name}`"
                class="text-link font-medium truncate"
              >
                {{ entry.name }}
              </RouterLink>
              <RouterLink
                v-else
                :to="`/workspaces/${props.alias}/file/${workspaceInfo.commit.commit_id}/${(props.path ? props.path + '/' : '') + entry.name}`"
                class="text-link font-medium truncate"
              >
                {{ entry.name }}
              </RouterLink>
            </div>
            <button
              v-if="entry.kind !== 'tree'"
              @click.prevent="downloadFile(entry)"
              class="ml-4 p-2 text-gray-500 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              :title="`Download ${entry.name}`"
            >
              <DownloadIcon class="w-4 h-4" />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/text-link.css';
@import '@/assets/box.css';
</style>
