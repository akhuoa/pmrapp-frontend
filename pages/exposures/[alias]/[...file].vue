<script setup lang="ts">
import ExposureDetail from '@/components/organisms/ExposureDetail.vue'

const route = useRoute()
const alias = computed(() => route.params.alias as string)
const file = computed(() => {
  // Handle the catch-all param which could be an array
  const fileParam = route.params.file
  if (Array.isArray(fileParam)) {
    return fileParam.join('/')
  }
  return fileParam || ''
})
const view = computed(() => (route.query.view as string) || '')
</script>

<template>
  <ExposureDetail :alias="alias" :file="file" :view="view" />
</template>
