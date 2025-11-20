<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import type { Workspace } from '@/types/workspace'
import { workspaceService } from '@/services/workspaceService'
// TODO: Remove this import when API is available
import { mockWorkspaces } from '@/mocks/workspaceMockData'
import ItemList from './organisms/ItemList.vue'
import WorkspaceListItem from './molecules/WorkspaceListItem.vue'

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
  <ItemList
    :items="workspaces"
    :error="error"
    error-title="Error loading workspaces"
    mock-message="This is fixed sample data for testing."
    :is-loading-mock="isLoadingMock"
    empty-message="No workspaces found."
    @load-mock="loadMockData"
  >
    <template #item>
      <WorkspaceListItem
        v-for="workspace in workspaces"
        :key="workspace.alias"
        :workspace="workspace"
      />
    </template>
  </ItemList>
</template>

<style scoped>
@import '@/assets/button.css';
</style>
