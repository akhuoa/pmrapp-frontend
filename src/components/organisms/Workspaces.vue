<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemList from '@/components/molecules/ItemList.vue'
import ListToolbar from '@/components/molecules/ListToolbar.vue'
import ListItem from '@/components/molecules/ListItem.vue'
import { useWorkspaceStore } from '@/stores/workspace'

const emit = defineEmits<{
  updateFilteredCount: [filteredCount: number, totalCount: number, hasFilter: boolean]
}>()

const workspaceStore = useWorkspaceStore()
const route = useRoute()
const router = useRouter()
const filterQuery = ref((route.query.filter as string) || '')

onMounted(async () => {
  await workspaceStore.fetchWorkspaces()
})

// Sync filter query with URL query parameter.
watch(filterQuery, (newValue) => {
  const query = newValue.trim() ? { filter: newValue } : {}
  router.replace({ query })
})

const handleRefresh = async () => {
  await workspaceStore.fetchWorkspaces(true)
}

const filteredWorkspaces = computed(() => {
  if (!filterQuery.value.trim()) {
    return workspaceStore.workspaces
  }

  const query = filterQuery.value.toLowerCase()
  return workspaceStore.workspaces.filter((workspace) => {
    const description = workspace.entity.description?.toLowerCase() || ''
    return description.includes(query)
  })
})

watch(
  [filteredWorkspaces, () => workspaceStore.workspaces.length],
  () => {
    emit(
      'updateFilteredCount',
      filteredWorkspaces.value.length,
      workspaceStore.workspaces.length,
      !!filterQuery.value.trim(),
    )
  },
  { immediate: true },
)
</script>

<template>
  <ListToolbar
    v-model:filter-query="filterQuery"
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
      <ListItem
        v-for="workspace in filteredWorkspaces"
        :key="workspace.alias"
        :title="workspace.entity.description || workspace.alias"
        :subtitle="workspace.entity.long_description || workspace.entity.url"
        :link="`/workspaces/${workspace.alias}`"
      />
    </template>
  </ItemList>
</template>
