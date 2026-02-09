<script setup lang="ts">
import BackToTop from '@/components/atoms/BackToTop.vue'
import BetaRibbon from '@/components/atoms/BetaRibbon.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <DefaultLayout>
      <RouterView />
    </DefaultLayout>
    <BackToTop />
  </div>
  <BetaRibbon />
</template>
