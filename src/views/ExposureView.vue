<script setup lang="ts">
import Exposures from '@/components/Exposures.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <PageHeader
      title="Exposure Listing"
      description="View and manage model exposures."
    />

    <Exposures />
  </DefaultLayout>
</template>
