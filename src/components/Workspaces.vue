<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useWorkspaceStore } from '@/stores/workspace'
import ActionButton from './atoms/ActionButton.vue'
import WorkspaceListItem from './molecules/WorkspaceListItem.vue'
import ItemList from './organisms/ItemList.vue'

const workspaceStore = useWorkspaceStore()
const searchQuery = ref('')

onMounted(async () => {
  await workspaceStore.fetchWorkspaces()
})

const handleRefresh = async () => {
  await workspaceStore.fetchWorkspaces(true)
}

const filteredWorkspaces = computed(() => {
  if (!searchQuery.value.trim()) {
    return workspaceStore.workspaces
  }

  const query = searchQuery.value.toLowerCase()
  return workspaceStore.workspaces.filter((workspace) => {
    const description = workspace.entity.description?.toLowerCase() || ''
    return description.includes(query)
  })
})
</script>

<template>
  <div class="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
    <div class="flex-1 w-full sm:w-auto">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by description..."
        class="input-field w-full"
      />
    </div>
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
    :items="filteredWorkspaces"
    :error="workspaceStore.error"
    :is-loading="workspaceStore.isLoading"
    error-title="Error loading workspaces"
    empty-message="No workspaces found."
  >
    <template #item>
      <WorkspaceListItem
        v-for="workspace in filteredWorkspaces"
        :key="workspace.alias"
        :workspace="workspace"
      />
    </template>
  </ItemList>
</template>

<style scoped>
@import '@/assets/input.css';
</style>
