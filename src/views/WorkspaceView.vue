<script setup lang="ts">
import { computed } from 'vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import Workspaces from '@/components/Workspaces.vue'
import { useWorkspaceStore } from '@/stores/workspace'

const workspaceStore = useWorkspaceStore()

const description = computed(() => {
  if (workspaceStore.error) {
    return 'Unable to load workspaces. Please try refreshing.'
  }

  const count = workspaceStore.workspaces.length
  if (count === 0) {
    return 'No workspaces found. Please try refreshing.'
  }

  return `Browse and explore ${count > 1 ? 'all ' : ''}${count} workspace${count > 1 ? 's' : ''}.`
})
</script>

<template>
  <PageHeader
    title="Workspace Listing"
    :description="description"
  />

  <Workspaces />
</template>
