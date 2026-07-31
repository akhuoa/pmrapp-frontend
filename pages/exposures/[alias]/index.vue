<script setup lang="ts">
import ExposureDetail from '@/components/organisms/ExposureDetail.vue'

const route = useRoute()
const alias = computed(() => route.params.alias as string)
const file = computed(() => '')
const view = computed(() => '')
</script>

<template>
  <ExposureDetail :alias="alias" :file="file" :view="view" />
</template>
