<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import type { Workspace } from '@/types/workspace'
import { getWorkspaceService } from '@/services'
import ItemList from './organisms/ItemList.vue'
import WorkspaceListItem from './molecules/WorkspaceListItem.vue'

const workspaces = ref<Workspace[]>([])
const error = ref<string | null>(null)

try {
  workspaces.value = await getWorkspaceService().listAliasedWorkspaces()

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
  <ItemList
    :items="workspaces"
    :error="error"
    error-title="Error loading workspaces"
    empty-message="No workspaces found."
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
