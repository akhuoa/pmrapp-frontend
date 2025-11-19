<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Workspaces from '@/components/Workspaces.vue'
</script>

<template>
  <DefaultLayout>
    <h1 class="text-4xl font-bold mb-6">Workspace Listing</h1>
    <p class="text-lg text-gray-600 mb-8">
      Browse and explore all workspaces.
    </p>

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
