<script setup lang="ts">
import { useRoute } from 'vue-router'
import WorkspaceDetail from '@/components/organisms/WorkspaceDetail.vue'

const route = useRoute()
const alias = route.params.alias as string
</script>

<template>
  <WorkspaceDetail :alias="alias" />
</template>
