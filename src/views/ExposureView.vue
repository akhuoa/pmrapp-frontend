<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Exposures from '@/components/Exposures.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
</script>

<template>
  <DefaultLayout>
    <PageHeader
      title="Exposure Listing"
      description="View and manage model exposures."
    />

    <Suspense>
      <template #default>
        <Exposures />
      </template>
      <template #fallback>
        <p class="text-gray-600">Loading exposures...</p>
      </template>
    </Suspense>
  </DefaultLayout>
</template>
