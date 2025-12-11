<script setup lang="ts">
import PageHeader from '@/components/molecules/PageHeader.vue'
import Workspaces from '@/components/Workspaces.vue'
</script>

<template>
  <PageHeader
    title="Workspace Listing"
    description="Browse and explore all workspaces."
  />

  <Workspaces />
</template>
