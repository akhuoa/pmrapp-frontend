<script setup lang="ts">
import { useRoute } from 'vue-router'
import WorkspaceFileDetail from '@/components/organisms/WorkspaceFileDetail.vue'

const route = useRoute()
const alias = route.params.alias as string
const commitId = route.params.commitId as string
const filename = route.params.filename as string
</script>

<template>
  <WorkspaceFileDetail :alias="alias" :commit-id="commitId" :filename="filename" />
</template>
