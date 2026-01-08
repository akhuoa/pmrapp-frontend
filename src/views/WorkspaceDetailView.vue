<script setup lang="ts">
import { useRoute } from 'vue-router'
import WorkspaceDetail from '@/components/organisms/WorkspaceDetail.vue'
import WorkspaceFileDetail from '@/components/organisms/WorkspaceFileDetail.vue'
import { computed, onMounted, ref, watch } from 'vue'
import type { WorkspaceInfo } from '@/types/workspace'
import { useWorkspaceStore } from '@/stores/workspace'

const route = useRoute()
const workspaceStore = useWorkspaceStore()
const alias = computed(() => route.params.alias as string)
const commitId = computed(() => route.params.commitId as string)
const path = computed(() => route.params.path as string)
const workspaceInfo = ref<WorkspaceInfo | null>(null)
const error = ref<string | null>(null)
const isLoading = ref(true)
const isWorkspaceFile = ref(false)

const loadWorkspaceInfo = async () => {
  isLoading.value = true
  error.value = null

  try {
    const aliasValue = alias.value
    const commitIdValue = commitId.value || ''
    const pathValue = path.value || ''
    workspaceInfo.value = await workspaceStore.getWorkspaceInfo(
      aliasValue,
      commitIdValue,
      pathValue,
    )

    if (workspaceInfo.value?.target?.TreeInfo) {
      isWorkspaceFile.value = false
    } else {
      isWorkspaceFile.value = true
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load workspace.'
    console.error('Error loading workspace:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadWorkspaceInfo)

// Watch for changes in props to reload data.
watch(() => [alias.value, commitId.value, path.value], loadWorkspaceInfo)
</script>

<template>
  <WorkspaceFileDetail v-if="isWorkspaceFile" :alias="alias" :commit-id="commitId" :path="path" />
  <WorkspaceDetail v-else :alias="alias" :commit-id="commitId" :path="path" />
</template>
