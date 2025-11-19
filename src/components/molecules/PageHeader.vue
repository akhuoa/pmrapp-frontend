<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  centered?: boolean
}>()
</script>

<template>
  <div :class="{ 'text-center': centered }">
    <h1 class="text-4xl font-bold mb-6">{{ title }}</h1>
    <p v-if="description" class="text-lg text-gray-600 mb-8">
      {{ description }}
    </p>
  </div>
</template>
