<script setup lang="ts">
import { useRoute } from 'vue-router'
import ExposureDetail from '@/components/ExposureDetail.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()
const alias = route.params.alias as string
</script>

<template>
  <DefaultLayout>
    <ExposureDetail :alias="alias" />
  </DefaultLayout>
</template>
