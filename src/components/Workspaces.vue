<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import type { Workspace } from '@/types/workspace'
import { workspaceService } from '@/services/workspaceService'

const workspaces = ref<Workspace[]>([])
const error = ref<string | null>(null)

try {
  workspaces.value = await workspaceService.listAliasedWorkspaces()

  // sort by entity.description alphabetically
  workspaces.value.sort((a: Workspace, b: Workspace) => {
    return a.entity.description.localeCompare(b.entity.description)
  })
} catch (err) {
  error.value = err instanceof Error ? err.message : 'Failed to load workspaces'
  console.error('Error loading workspaces:', err)
}
</script>

<template>
  <div v-if="error" class="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
    <h3 class="font-semibold mb-2">Error loading workspaces</h3>
    <p class="text-sm">{{ error }}</p>
  </div>
  <div v-else-if="workspaces.length === 0" class="text-gray-500 text-center py-4">
    No workspaces found.
  </div>
  <div v-else>
    <div
      v-for="workspace in workspaces"
      :key="workspace.alias"
      class="mb-4 pb-4 border-b border-gray-200 last:mb-0 last:pb-0 last:border-b-0"
    >
      <RouterLink :to="`/workspace/${workspace.alias}`">
        <h3 class="inline-block text-lg font-semibold mb-2 text-[#830a28] hover:text-[#d11241] transition-colors">
          {{ workspace.entity.description }}
        </h3>
      </RouterLink>
      <p class="text-gray-600 text-sm">{{ workspace.entity.url }}</p>
    </div>
  </div>
</template>
