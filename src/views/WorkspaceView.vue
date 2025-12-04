<script setup lang="ts">
import PageHeader from '@/components/molecules/PageHeader.vue'
import Workspaces from '@/components/Workspaces.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
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
        <p class="">Loading workspaces...</p>
      </template>
    </Suspense>
  </DefaultLayout>
</template>
