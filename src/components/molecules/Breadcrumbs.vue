<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  to?: RouteLocationRaw
}

defineProps<{
  items: BreadcrumbItem[]
}>()

const truncateCharLimit = 26

const isOverflowing = (label: string): boolean => {
  return label.length > truncateCharLimit
}

const truncateClass = [
  'truncate',
  'inline-block',
  `sm:max-w-[${truncateCharLimit}ch]`,
].join(' ')
</script>

<template>
  <nav aria-label="breadcrumb" class="mb-4">
    <ol class="flex flex-wrap items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center gap-1 min-w-0"
      >
        <span
          v-if="index > 0"
          aria-hidden="true"
          class="text-gray-400 dark:text-gray-500"
        >/</span>
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="text-primary hover:text-primary-hover transition-colors"
          :class="truncateClass"
          :title="isOverflowing(item.label) ? item.label : undefined"
        >
          {{ item.label }}
        </RouterLink>
        <span
          v-else
          class="text-gray-800 dark:text-gray-200"
          :class="truncateClass"
          :title="isOverflowing(item.label) ? item.label : undefined"
          aria-current="page"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
