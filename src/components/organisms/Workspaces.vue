<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ListContainer from '@/components/molecules/ListContainer.vue'
import ListItem from '@/components/molecules/ListItem.vue'
import ListToolbar from '@/components/molecules/ListToolbar.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import type { SortOption } from '@/types/common'
import type { Workspace } from '@/types/workspace'
import { formatDate } from '@/utils/format'

const emit = defineEmits<{
  updateFilteredCount: [filteredCount: number, totalCount: number, hasFilter: boolean]
}>()

const workspaceStore = useWorkspaceStore()
const route = useRoute()
const router = useRouter()
const filterQuery = ref((route.query.filter as string) || '')
const sortBy = ref<SortOption>('description')

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
  let result = workspaceStore.workspaces

  // Filter by search query.
  if (filterQuery.value.trim()) {
    const query = filterQuery.value.toLowerCase()

    result = result.filter((workspace: Workspace) => {
      const description = workspace.entity.description?.toLowerCase() || ''
      return description.includes(query)
    })
  }

  // Sort based on selected option.
  return [...result].sort((a: Workspace, b: Workspace) => {
    switch (sortBy.value) {
      case 'description': {
        const descA = a.entity.description
        const descB = b.entity.description

        if (descA === null && descB === null) return 0
        if (descA === null) return 1
        if (descB === null) return -1

        return descA.localeCompare(descB)
      }
      case 'id':
        return a.entity.id - b.entity.id
      case 'date-asc':
        return a.entity.created_ts - b.entity.created_ts
      case 'date-desc':
        return b.entity.created_ts - a.entity.created_ts
      default:
        return 0
    }
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
    v-model:sort-by="sortBy"
    :is-loading="workspaceStore.isLoading"
    content-section="Workspace Listing"
    @refresh="handleRefresh"
  />

  <ListContainer
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
        :link="`/workspaces/${workspace.alias}`"
      >
        <p>
          <small>
            #{{ workspace.entity.id }} ·
            Created on {{ formatDate(workspace.entity.created_ts) }}
          </small>
        </p>
      </ListItem>
    </template>
  </ListContainer>
</template>
