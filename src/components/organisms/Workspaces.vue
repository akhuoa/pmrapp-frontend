<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted } from 'vue'
import ListItem from '@/components/molecules/ListItem.vue'
import Listing from '@/components/molecules/Listing.vue'
import { useWorkspaceStore } from '@/stores/workspace'

const emit = defineEmits<{
  updateFilteredCount: [filteredCount: number, totalCount: number, hasFilter: boolean]
}>()

const workspaceStore = useWorkspaceStore()

onMounted(async () => {
  await workspaceStore.fetchWorkspaces()
})

const handleRefresh = async () => {
  await workspaceStore.fetchWorkspaces(true)
}

const handleUpdateFilteredCount = (
  filteredCount: number,
  totalCount: number,
  hasFilter: boolean,
) => {
  emit('updateFilteredCount', filteredCount, totalCount, hasFilter)
}
</script>

<template>
  <Listing
    :items="workspaceStore.workspaces"
    :is-loading="workspaceStore.isLoading"
    :error="workspaceStore.error"
    content-section="Workspace Listing"
    error-title="Error loading workspaces"
    empty-message="No workspaces found."
    @refresh="handleRefresh"
    @update-filtered-count="handleUpdateFilteredCount"
  >
    <template #item="{ items }">
      <ListItem
        v-for="workspace in items"
        :key="workspace.alias"
        :title="workspace.entity.description || workspace.alias"
        :subtitle="workspace.entity.long_description || workspace.entity.url"
        :link="`/workspaces/${workspace.alias}`"
      />
    </template>
  </Listing>
</template>
