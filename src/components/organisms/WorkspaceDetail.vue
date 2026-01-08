<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BackButton from '@/components/atoms/BackButton.vue'
import LoadingBox from '@/components/atoms/LoadingBox.vue'
import FileIcon from '@/components/icons/FileIcon.vue'
import DownloadIcon from '@/components/icons/DownloadIcon.vue'
import ErrorBlock from '@/components/molecules/ErrorBlock.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import { useBackNavigation } from '@/composables/useBackNavigation'
import { useWorkspaceStore } from '@/stores/workspace'
import type { WorkspaceInfo } from '@/types/workspace'
import { downloadWorkspaceFile } from '@/utils/download'

const props = defineProps<{
  alias: string
}>()

const workspaceStore = useWorkspaceStore()
const workspaceInfo = ref<WorkspaceInfo | null>(null)
const error = ref<string | null>(null)
const isLoading = ref(true)
const { goBack } = useBackNavigation('/workspaces')

const fileCountText = computed(() => {
  if (!workspaceInfo.value) return ''
  const count = workspaceInfo.value.target.TreeInfo.filecount
  return `${count} ${count === 1 ? 'file' : 'files'}`
})

const downloadFile = async (fileName: string) => {
  const alias = props.alias
  const commitId = workspaceInfo.value?.commit.commit_id
  if (!commitId) return
  await downloadWorkspaceFile(alias, commitId, fileName)
}

onMounted(async () => {
  try {
    workspaceInfo.value = await workspaceStore.getWorkspaceInfo(props.alias)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load workspace'
    console.error('Error loading workspace:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <BackButton
    label="Back to Workspaces"
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
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Git Repository URL:</span>
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
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Author:</span>
        <span class="ml-2">{{ workspaceInfo.commit.author }}</span>
      </div>
    </div>

    <div class="box p-0! overflow-hidden">
      <div class="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ fileCountText }}
        </span>
      </div>
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li
          v-for="entry in workspaceInfo.target.TreeInfo.entries"
          :key="entry.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div class="px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <FileIcon class="text-gray-500 dark:text-gray-400 flex-shrink-0 w-4 h-4" />
              <RouterLink
                :to="`/workspaces/${alias}/file/${workspaceInfo.commit.commit_id}/${entry.name}`"
                class="text-link font-medium truncate"
              >
                {{ entry.name }}
              </RouterLink>
            </div>
            <button
              @click.prevent="downloadFile(entry.name)"
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
