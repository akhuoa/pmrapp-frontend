<script setup lang="ts">
import { useRoute } from 'vue-router'
import ExposureFileDetail from '@/components/ExposureFileDetail.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()
const alias = route.params.alias as string
const file = route.params.file as string
</script>

<template>
  <DefaultLayout>
    <ExposureFileDetail :alias="alias" :file="file" />
  </DefaultLayout>
</template>
