<script setup lang="ts">
import { useRoute } from 'vue-router'
import ExposureFileDetail from '@/components/organisms/ExposureFileDetail.vue'

const route = useRoute()
const alias = route.params.alias as string
const file = route.params.file as string
</script>

<template>
  <ExposureFileDetail :alias="alias" :file="file" />
</template>
