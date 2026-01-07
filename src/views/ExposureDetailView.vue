<script setup lang="ts">
import { useRoute } from 'vue-router'
import ExposureDetail from '@/components/organisms/ExposureDetail.vue'

const route = useRoute()
const alias = route.params.alias as string
</script>

<template>
  <ExposureDetail :alias="alias" />
</template>
