<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '@/components/atoms/BackButton.vue'
import LoadingBox from '@/components/atoms/LoadingBox.vue'
import FileIcon from '@/components/icons/FileIcon.vue'
import { useBackNavigation } from '@/composables/useBackNavigation'
import { useWorkspaceStore } from '@/stores/workspace'
import type { WorkspaceInfo } from '@/types/workspace'
import PageHeader from '@/components/molecules/PageHeader.vue'
import ErrorBlock from '@/components/organisms/ErrorBlock.vue'

const props = defineProps<{
  alias: string
}>()

const router = useRouter()
const workspaceStore = useWorkspaceStore()
const workspaceInfo = ref<WorkspaceInfo | null>(null)
const error = ref<string | null>(null)
const isLoading = ref(true)
const { goBack } = useBackNavigation('/workspaces')

onMounted(async () => {
  try {
    workspaceInfo.value = await workspaceStore.getWorkspaceInfo(props.alias)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load workspace'
    console.error('Error loading workspace:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <BackButton
    label="Back to Workspaces"
    content-section="Workspace Detail"
    :on-click="goBack"
  />

  <ErrorBlock
    v-if="error"
    title="Error loading workspace"
    :error="error"
  />

  <LoadingBox v-else-if="isLoading" message="Loading workspace..." />

  <div v-else-if="workspaceInfo">
    <PageHeader
      :title="workspaceInfo.workspace.description || alias"
      :description="`Git Repository URI: ${workspaceInfo.workspace.url}`"
    />

    <div class="box">
      <h2 class="text-xl font-semibold mb-4">Files</h2>
      <ul class="space-y-2">
        <li v-for="entry in workspaceInfo.target.TreeInfo.entries" :key="entry.id">
          <RouterLink
            :to="`/workspaces/${alias}/file/${workspaceInfo.commit.commit_id}/${entry.name}`"
            class="text-link inline-flex items-center gap-2"
          >
            <FileIcon class="text-foreground" />
            {{ entry.name }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/text-link.css';
@import '@/assets/box.css';
</style>
