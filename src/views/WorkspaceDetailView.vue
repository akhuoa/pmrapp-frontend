<script setup lang="ts">
import { useRoute } from 'vue-router'
import WorkspaceDetail from '@/components/WorkspaceDetail.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()
const alias = route.params.alias as string
</script>

<template>
  <DefaultLayout>
    <Suspense>
      <template #default>
        <WorkspaceDetail :alias="alias" />
      </template>
      <template #fallback>
        <p class="text-gray-600">Loading workspace...</p>
      </template>
    </Suspense>
  </DefaultLayout>
</template>
