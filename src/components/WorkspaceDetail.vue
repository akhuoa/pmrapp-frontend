<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import type { WorkspaceInfo } from '@/types/workspace'
// TODO: Remove this import when API is available
import { mockWorkspaceInfo } from '@/mocks/workspaceMockData'
import { workspaceService } from '@/services/workspaceService'
import FileIcon from '@/components/icons/FileIcon.vue'

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
  <div v-if="error" class="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 max-w-4xl mx-auto">
    <h3 class="font-semibold mb-2">Error loading workspace</h3>
    <p class="text-sm">{{ error }}</p>

    <!-- TODO: Remove this section when API is available -->
    <div class="mt-4 pt-4 border-t border-red-300">
      <p class="text-sm text-gray-700 mb-3">
        <strong>Temporary Solution:</strong> The API is currently unavailable. You can load sample data for testing purposes.
        This is fixed sample data for a specific workspace alias. Regardless of which workspace URL you visit,
        the same mock data will be loaded. This feature will be removed once the API is ready.
      </p>
      <button
        @click="loadMockData"
        :disabled="isLoadingMock"
        class="bg-[#830a28] hover:bg-[#d11241] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
      >
        {{ isLoadingMock ? 'Loading...' : 'Load Mock Data (Temporary)' }}
      </button>
    </div>
  </div>

  <div v-else-if="workspaceInfo">
    <h1 class="text-4xl font-bold mb-6">
      {{ workspaceInfo.workspace.description || alias }}
    </h1>
    <p class="text-gray-600 mb-4">Git Repository URI: {{ workspaceInfo.workspace.url }}</p>

    <div class="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <h2 class="text-xl font-semibold mb-4">Files</h2>
      <ul class="space-y-2">
        <li v-for="entry in workspaceInfo.target.TreeInfo.entries" :key="entry.id">
          <RouterLink
            :to="`/workspace/${alias}/file/${workspaceInfo.commit.commit_id}/${entry.name}`"
            class="text-[#830a28] hover:text-[#d11241] transition-colors flex items-center gap-2"
          >
            <FileIcon class="text-gray-500" />
            {{ entry.name }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
