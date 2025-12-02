<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navLinks = [
  { path: '/workspace', label: 'Workspace' },
  { path: '/exposure', label: 'Exposure' },
]

const isActive = (path: string) => computed(() => route.path.startsWith(path))
</script>

<template>
  <header class="header-border-top bg-background border-b border-gray-200 dark:border-gray-700 sticky top-0 z-100">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center nav-link">
        <img src="/logo.png" alt="Physiome Model Repository" width="48" height="48" />
      </RouterLink>

      <nav>
        <ul class="flex items-center gap-4">
          <li v-for="link in navLinks" :key="link.path">
            <RouterLink
              :to="link.path"
              class="nav-link"
              :class="{ 'text-primary': isActive(link.path).value }"
            >
              {{ link.label }}
            </RouterLink>
          </li>
          <li class="h-6 border-l border-gray-300 dark:border-gray-600"></li>
          <li>
            <RouterLink
              to="/login"
              class="nav-link"
              active-class="text-primary"
            >
              Login
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
@reference 'tailwindcss';
@reference '@/assets/main.css';

.header-border-top {
  @apply
    before:content-['']
    before:absolute
    before:top-0
    before:left-0
    before:right-0
    before:h-[6px]
    before:bg-primary;
}

.nav-link {
  @apply hover:opacity-80 transition-opacity;
}
</style>
