<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import type { Workspace } from '@/types/workspace'
// TODO: Remove this import when API is available
import { mockWorkspaces } from '@/mocks/workspaceMockData'
import { workspaceService } from '@/services/workspaceService'
import MockDataLoader from './molecules/MockDataLoader.vue'

const workspaces = ref<Workspace[]>([])
const error = ref<string | null>(null)
// TODO: Remove this state when API is available
const isLoadingMock = ref(false)

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

// TODO: Remove this function when API is available
const loadMockData = async () => {
  isLoadingMock.value = true
  error.value = null

  try {
    await new Promise((resolve) => setTimeout(resolve, 200)) // Simulate API delay
    workspaces.value = mockWorkspaces.sort((a: Workspace, b: Workspace) => {
      return a.entity.description.localeCompare(b.entity.description)
    })
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
    <h3 class="font-semibold mb-2 text-danger">Error loading workspaces</h3>
    <p class="text-sm text-danger">{{ error }}</p>

    <MockDataLoader
      message="This is fixed sample data for testing."
      :is-loading="isLoadingMock"
      @load="loadMockData"
    />
  </div>

  <div v-else-if="workspaces.length === 0" class="text-center py-8 bg-white rounded-lg shadow-lg border border-gray-200">
    No workspaces found.
  </div>
  <div v-else class="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
    <div
      v-for="workspace in workspaces"
      :key="workspace.alias"
      class="mb-4 pb-4 border-b border-gray-200 last:mb-0 last:pb-0 last:border-b-0"
    >
      <RouterLink :to="`/workspace/${workspace.alias}`">
        <h3 class="inline-block text-lg font-semibold mb-2 text-link">
          {{ workspace.entity.description }}
        </h3>
      </RouterLink>
      <p class="text-sm">{{ workspace.entity.url }}</p>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/button.css';
@import '@/assets/text-link.css';
</style>
