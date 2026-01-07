<script setup lang="ts">
import BackToTop from '@/components/atoms/BackToTop.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <DefaultLayout>
      <RouterView />
    </DefaultLayout>
    <BackToTop />
  </div>
</template>
