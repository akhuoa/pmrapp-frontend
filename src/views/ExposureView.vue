<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Exposures from '@/components/Exposures.vue'
</script>

<template>
  <DefaultLayout>
    <h1 class="text-4xl font-bold mb-6">Exposure Listing</h1>
    <p class="text-lg text-gray-600 mb-8">
      View and manage model exposures.
    </p>

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
