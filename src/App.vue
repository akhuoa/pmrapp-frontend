<script setup lang="ts">
import BackToTop from '@/components/BackToTop.vue'
import MockDataNotification from '@/components/molecules/MockDataNotification.vue'
</script>

<template>
  <MockDataNotification />
  <RouterView />
  <BackToTop />
</template>
