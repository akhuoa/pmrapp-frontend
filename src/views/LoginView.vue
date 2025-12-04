<script setup lang="ts">
import Login from '@/components/Login.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <PageHeader
      title="Login"
      centered
    />
    <Login />
  </DefaultLayout>
</template>
