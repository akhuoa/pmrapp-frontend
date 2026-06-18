<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <div class="group p-4 text-sm bg-gray-50 dark:bg-gray-900 rounded-md break-words relative">
    {{ content }}
  </div>
</template>
