<template>
  <kbd class="keycap">
    <slot />
  </kbd>
</template>

<style scoped>
@reference "tailwindcss";

.keycap {
  @apply inline-flex items-center px-1.5 py-0.5 text-sm font-semibold rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200;
}
</style>
