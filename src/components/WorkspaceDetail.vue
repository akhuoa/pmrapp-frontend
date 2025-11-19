<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import type { WorkspaceInfo } from '@/types/workspace'
// TODO: Remove this import when API is available
import { mockWorkspaceInfo } from '@/mocks/workspaceMockData'
import { workspaceService } from '@/services/workspaceService'
import FileIcon from '@/components/icons/FileIcon.vue'
import PageHeader from './molecules/PageHeader.vue'
import MockDataLoader from './molecules/MockDataLoader.vue'

const props = defineProps<{
  alias: string
}>()

const workspaceInfo = ref<WorkspaceInfo | null>(null)
const error = ref<string | null>(null)
// TODO: Remove this state when API is available
const isLoadingMock = ref(false)

try {
  workspaceInfo.value = await workspaceService.getWorkspaceInfo(props.alias)
} catch (err) {
  error.value = err instanceof Error ? err.message : 'Failed to load workspace'
  console.error('Error loading workspace:', err)
}

// TODO: Remove this function when API is available
const loadMockData = async () => {
  isLoadingMock.value = true
  error.value = null

  try {
    await new Promise((resolve) => setTimeout(resolve, 200)) // Simulate API delay
    workspaceInfo.value = mockWorkspaceInfo
  } catch (err) {
    error.value = 'Failed to load mock data'
    console.error('Error loading mock data:', err)
  } finally {
    isLoadingMock.value = false
  }
}
</script>

<template>
  <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
    <h3 class="font-semibold mb-2 text-danger">Error loading workspace</h3>
    <p class="text-sm text-danger">{{ error }}</p>

    <!-- TODO: Remove this section when API is available -->
    <MockDataLoader
      message="This is fixed sample data for a specific workspace alias. Regardless of which workspace URL you visit, the same mock data will be loaded."
      :is-loading="isLoadingMock"
      @load="loadMockData"
    />
  </div>

  <div v-else-if="workspaceInfo">
    <PageHeader
      :title="workspaceInfo.workspace.description || alias"
      :description="`Git Repository URI: ${workspaceInfo.workspace.url}`"
    />

    <div class="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <h2 class="text-xl font-semibold mb-4">Files</h2>
      <ul class="space-y-2">
        <li v-for="entry in workspaceInfo.target.TreeInfo.entries" :key="entry.id">
          <RouterLink
            :to="`/workspace/${alias}/file/${workspaceInfo.commit.commit_id}/${entry.name}`"
            class="text-link inline-flex items-center gap-2"
          >
            <FileIcon class="text-muted" />
            {{ entry.name }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/button.css';
@import '@/assets/text-link.css';
</style>
