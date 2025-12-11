<script setup lang="ts">
import { useRoute } from 'vue-router'
import WorkspaceDetail from '@/components/WorkspaceDetail.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()
const alias = route.params.alias as string
</script>

<template>
  <DefaultLayout>
    <WorkspaceDetail :alias="alias" />
  </DefaultLayout>
</template>
