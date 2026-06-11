<script setup lang="ts">
import CopyButton from '@/components/atoms/CopyButton.vue';

const props = defineProps<{
  title: string
  description?: string
  citationText: string
}>()
</script>

<template>
  <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
  <p class="mb-4" v-if="description">{{ description }}</p>
  <div class="group relative">
    <code class="block text-sm! m-0! p-4 pr-8 bg-gray-50 dark:bg-gray-800 rounded-md">
      {{ citationText }}
    </code>
    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <CopyButton
        :text="citationText"
        title="Copy citation"
      />
    </div>
  </div>
</template>
