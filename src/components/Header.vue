<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const navLinks = [
  { path: '/workspace', label: 'Workspace' },
  { path: '/exposure', label: 'Exposure' },
]

const isActive = (path: string) => computed(() => route.path.startsWith(path))
</script>

<template>
  <header class="header-border-top bg-white border-b border-gray-200 sticky top-0 z-100">
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

.header-border-top {
  @apply before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[6px] before:bg-[#3a3a3a];
}

.nav-link {
  @apply hover:opacity-80 transition-opacity;
}
</style>
