<script setup lang="ts">
import SearchIcon from '@/components/icons/SearchIcon.vue'
</script>

<template>
  <button
    type="button"
    class="flex items-center gap-2 input-field md:w-[200px] search-button"
    @click="$emit('click')"
  >
    <SearchIcon class="w-6 h-6 text-gray-500 dark:text-gray-400" />
    <span class="hidden md:inline text-gray-500 dark:text-gray-400">Search...</span>
  </button>
</template>

<style scoped>
@import '@/assets/input.css';

/* Show icon only on small screens. */
@media screen and (max-width: 767px) {
  .search-button {
    padding: 0.5rem;
    border: none;
  }
}
</style>
