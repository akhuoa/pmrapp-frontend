<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import GitHubIcon from '@/components/icons/GitHubIcon.vue'

const repositories = [
  {
    name: 'Platform',
    url: 'https://github.com/Physiome/pmrplatform',
  },
  {
    name: 'Web app',
    url: 'https://github.com/Physiome/pmrapp-frontend',
  },
]
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-800 text-gray-400 py-6">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm font-light">Copyright 2025-{{ currentYear }} IUPS Physiome project</p>
        <div class="flex gap-4 text-sm">
          <a
            v-for="repo in repositories"
            :key="repo.name"
            :href="repo.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 hover:text-white transition-colors"
          >
            <GitHubIcon />
            <span>{{ repo.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
