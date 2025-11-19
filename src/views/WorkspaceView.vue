<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Workspaces from '@/components/Workspaces.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
</script>

<template>
  <DefaultLayout>
    <PageHeader
      title="Workspace Listing"
      description="Browse and explore all workspaces."
    />

    <Suspense>
      <template #default>
        <Workspaces />
      </template>
      <template #fallback>
        <p class="text-gray-600">Loading workspaces...</p>
      </template>
    </Suspense>
  </DefaultLayout>
</template>
