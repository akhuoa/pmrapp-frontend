<script setup lang="ts">
import Keycap from '@/components/atoms/Keycap.vue'

withDefaults(defineProps<{ query: string; suffix?: string }>(), { suffix: '' })
</script>

<template>
  Press <Keycap>Enter</Keycap> to search for
  <span class="text-gray-700 dark:text-gray-200 font-semibold">{{ query }}</span>
  anywhere in the repository{{ suffix }}.
</template>
