<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  centered?: boolean
  titleSize?: 'small' | 'medium' | 'large'
}>()
</script>

<template>
  <div :class="{ 'text-center': centered }">
    <h1 :class="`text-${titleSize === 'small' ? '2xl' : titleSize === 'medium' ? '3xl' : '4xl'} font-bold mb-6`">
      {{ title }}
    </h1>
    <p v-if="description" class="text-lg mb-8">
      {{ description }}
    </p>
  </div>
</template>
