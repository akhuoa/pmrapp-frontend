<script setup lang="ts">
import ActionButton from '@/components/atoms/ActionButton.vue'
import DownloadIcon from '@/components/icons/DownloadIcon.vue'
import ExternalLinkIcon from '@/components/icons/ExternalLinkIcon.vue'
import FileIcon from '@/components/icons/FileIcon.vue'
import FolderIcon from '@/components/icons/FolderIcon.vue'
import GitIcon from '@/components/icons/GitIcon.vue'
import type { WorkspaceFileEntry } from '@/types/workspace'
import { isOpenCORFile } from '@/utils/file'

const props = defineProps<{
  entries: WorkspaceFileEntry[]
  alias: string
  commitId: string
  path?: string
  fileCountText: string
  buildOpenCorUrl: (filename: string) => string
}>()

const emit = defineEmits<{
  download: [filename: string]
}>()
</script>

<template>
  <div class="box p-0! overflow-hidden">
    <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <span class="text-gray-600 dark:text-gray-400">
        {{ fileCountText }}
      </span>
    </div>
    <ul class="divide-y divide-gray-200 dark:divide-gray-700">
      <li
        v-for="entry in props.entries"
        :key="entry.id"
        class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div class="px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <FolderIcon v-if="entry.kind === 'tree'" class="text-gray-500 dark:text-gray-400 flex-shrink-0 w-4 h-4" />
            <GitIcon v-else-if="entry.kind === 'commit'" class="text-gray-500 dark:text-gray-400 flex-shrink-0 w-4 h-4" />
            <FileIcon v-else class="text-gray-500 dark:text-gray-400 flex-shrink-0 w-4 h-4" />

            <RouterLink
              v-if="entry.kind === 'commit'"
              :to="`/workspaces/${entry.name}/file/${entry.id}`"
              class="text-link font-medium truncate"
            >
              {{ entry.name }}
            </RouterLink>
            <RouterLink
              v-else
              :to="`/workspaces/${props.alias}/file/${props.commitId}/${(props.path ? props.path + '/' : '') + entry.name}`"
              class="text-link font-medium truncate"
            >
              {{ entry.name }}
            </RouterLink>
          </div>
          <div class="flex items-center gap-2 ml-4 flex-shrink-0">
            <ActionButton
              v-if="entry.kind !== 'tree' && entry.kind !== 'commit' && isOpenCORFile(entry.name)"
              variant="icon"
              size="sm"
              :href="props.buildOpenCorUrl(entry.name)"
              target="_blank"
              rel="noopener noreferrer"
              content-section="Workspace Detail"
              tooltip="Open with OpenCOR's Web app"
              aria-label="Open with OpenCOR's Web app"
            >
              <ExternalLinkIcon class="w-4 h-4" />
              <span class="sr-only">Open {{ entry.name }} with OpenCOR's Web app</span>
            </ActionButton>
            <ActionButton
              v-if="entry.kind !== 'tree' && entry.kind !== 'commit'"
              variant="icon"
              size="sm"
              content-section="Workspace Detail"
              @click="emit('download', entry.name)"
              tooltip="Download"
              aria-label="Download"
            >
              <DownloadIcon class="w-4 h-4" />
              <span class="sr-only">Download {{ entry.name }}</span>
            </ActionButton>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
