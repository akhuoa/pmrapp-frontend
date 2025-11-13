<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import type { WorkspaceInfo } from '@/types/workspace'
import { workspaceService } from '@/services/workspaceService'

const props = defineProps<{
  alias: string
}>()

const workspaceInfo = ref<WorkspaceInfo | null>(null)
const error = ref<string | null>(null)

try {
  workspaceInfo.value = await workspaceService.getWorkspaceInfo(props.alias)
} catch (err) {
  error.value = err instanceof Error ? err.message : 'Failed to load workspace'
  console.error('Error loading workspace:', err)
}
</script>

<template>
  <div v-if="error" class="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
    <h3 class="font-semibold mb-2">Error loading workspace</h3>
    <p class="text-sm">{{ error }}</p>
  </div>

  <div v-else-if="workspaceInfo">
    <h1 class="text-4xl font-bold mb-6">
      {{ workspaceInfo.workspace.description || alias }}
    </h1>

    <div class="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <p class="text-gray-600 mb-4">{{ workspaceInfo.workspace.url }}</p>
      <p class="text-sm text-gray-500">Files: {{ workspaceInfo.target.TreeInfo.filecount }}</p>
    </div>
  </div>
</template>
