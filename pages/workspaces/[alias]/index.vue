<script setup lang="ts">
import WorkspaceDetail from '@/components/organisms/WorkspaceDetail.vue'
import WorkspaceFileDetail from '@/components/organisms/WorkspaceFileDetail.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import type { WorkspaceInfo } from '@/types/workspace'

const route = useRoute()
const workspaceStore = useWorkspaceStore()
const alias = computed(() => route.params.alias as string)
const commitId = computed(() => '')
const path = computed(() => '')

const workspaceInfo = ref<WorkspaceInfo | null>(null)
const error = ref<string | null>(null)
const isLoading = ref(true)
const isWorkspaceFile = ref(false)
const requestCounter = ref(0)

const loadWorkspaceInfo = async () => {
  isLoading.value = true
  error.value = null

  const currentRequest = ++requestCounter.value

  try {
    const aliasValue = alias.value
    const workspaceData = await workspaceStore.getWorkspaceInfo(aliasValue, '', '')

    if (currentRequest === requestCounter.value) {
      workspaceInfo.value = workspaceData
      if (workspaceInfo.value?.target?.TreeInfo) {
        isWorkspaceFile.value = false
      } else {
        isWorkspaceFile.value = true
      }
    }
  } catch (err) {
    if (currentRequest === requestCounter.value) {
      error.value = err instanceof Error ? err.message : 'Failed to load workspace.'
      console.error('Error loading workspace:', err)
    }
  } finally {
    if (currentRequest === requestCounter.value) {
      isLoading.value = false
    }
  }
}

onMounted(loadWorkspaceInfo)

// Watch for changes in props to reload data.
watch(() => alias.value, loadWorkspaceInfo)
</script>

<template>
  <WorkspaceFileDetail v-if="isWorkspaceFile" :alias="alias" :commit-id="commitId" :path="path" />
  <WorkspaceDetail v-else :alias="alias" :commit-id="commitId" :path="path" />
</template>
