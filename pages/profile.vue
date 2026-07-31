<script setup lang="ts">
import PageHeader from '@/components/molecules/PageHeader.vue'
import Profile from '@/components/organisms/Profile.vue'

definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <PageHeader
    title="Profile"
    centered
  />
  <Profile />
</template>
