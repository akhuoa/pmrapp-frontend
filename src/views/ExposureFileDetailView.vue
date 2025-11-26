<script setup lang="ts">
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ExposureFileDetail from '@/components/ExposureFileDetail.vue'

const route = useRoute()
const alias = route.params.alias as string
const file = route.params.file as string
</script>

<template>
  <DefaultLayout>
    <Suspense>
      <template #default>
        <ExposureFileDetail :alias="alias" :file="file" />
      </template>
      <template #fallback>
        <p class="text-gray-600">Loading exposure file {{ file }}...</p>
      </template>
    </Suspense>
  </DefaultLayout>
</template>
