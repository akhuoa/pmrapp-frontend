<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Login from '@/components/Login.vue'
import PageHeader from '@/components/molecules/PageHeader.vue';
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
