<script setup lang="ts">
import { useRoute } from 'vue-router'
import WorkspaceFileDetail from '@/components/organisms/WorkspaceFileDetail.vue'
import { computed } from 'vue'

const route = useRoute()
const alias = computed(() => route.params.alias as string)
const commitId = computed(() => route.params.commitId as string)
const path = computed(() => route.params.path as string)
</script>

<template>
  <WorkspaceFileDetail :alias="alias" :commit-id="commitId" :path="path" />
</template>
