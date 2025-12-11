<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useWorkspaceStore } from '@/stores/workspace'
import WorkspaceListItem from './molecules/WorkspaceListItem.vue'
import ItemList from './organisms/ItemList.vue'
import ActionButton from './atoms/ActionButton.vue'

const workspaceStore = useWorkspaceStore()

onMounted(async () => {
  await workspaceStore.fetchWorkspaces()
})

const handleRefresh = async () => {
  await workspaceStore.fetchWorkspaces(true)
}
</script>

<template>
  <div class="mb-4 flex justify-end">
    <ActionButton
      variant="secondary"
      size="sm"
      :disabled="workspaceStore.isLoading"
      @click="handleRefresh"
      content-section="Workspace Listing"
    >
      {{ workspaceStore.isLoading ? 'Refreshing...' : 'Refresh' }}
    </ActionButton>
  </div>

  <ItemList
    :items="workspaceStore.workspaces"
    :error="workspaceStore.error"
    error-title="Error loading workspaces"
    empty-message="No workspaces found."
  >
    <template #item>
      <WorkspaceListItem
        v-for="workspace in workspaceStore.workspaces"
        :key="workspace.alias"
        :workspace="workspace"
      />
    </template>
  </ItemList>
</template>
