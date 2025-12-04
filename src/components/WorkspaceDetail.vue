<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import FileIcon from '@/components/icons/FileIcon.vue'
import { getWorkspaceService } from '@/services'
import type { WorkspaceInfo } from '@/types/workspace'
import PageHeader from './molecules/PageHeader.vue'
import ErrorBlock from './organisms/ErrorBlock.vue'

const props = defineProps<{
  alias: string
}>()

const workspaceInfo = ref<WorkspaceInfo | null>(null)
const error = ref<string | null>(null)

try {
  workspaceInfo.value = await getWorkspaceService().getWorkspaceInfo(props.alias)
} catch (err) {
  error.value = err instanceof Error ? err.message : 'Failed to load workspace'
  console.error('Error loading workspace:', err)
}
</script>

<template>
  <ErrorBlock
    v-if="error"
    title="Error loading workspace"
    :error="error"
  />

  <div v-else-if="workspaceInfo">
    <PageHeader
      :title="workspaceInfo.workspace.description || alias"
      :description="`Git Repository URI: ${workspaceInfo.workspace.url}`"
    />

    <div class="box">
      <h2 class="text-xl font-semibold mb-4">Files</h2>
      <ul class="space-y-2">
        <li v-for="entry in workspaceInfo.target.TreeInfo.entries" :key="entry.id">
          <RouterLink
            :to="`/workspace/${alias}/file/${workspaceInfo.commit.commit_id}/${entry.name}`"
            class="text-link inline-flex items-center gap-2"
          >
            <FileIcon class="text-foreground" />
            {{ entry.name }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/text-link.css';
@import '@/assets/box.css';
</style>
