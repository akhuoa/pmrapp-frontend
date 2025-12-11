<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useWorkspaceStore } from '@/stores/workspace'
import ListToolbar from './molecules/ListToolbar.vue'
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
  <ListToolbar
    v-model:search-query="searchQuery"
    :is-loading="workspaceStore.isLoading"
    content-section="Workspace Listing"
    @refresh="handleRefresh"
  />

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
