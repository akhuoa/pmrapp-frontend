<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import UserDropdown from '@/components/molecules/UserDropdown.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import SearchOverlay from '@/components/organisms/SearchOverlay.vue'
import ActionButton from '../atoms/ActionButton.vue'
import { useGlobalStateStore } from '@/stores/globalState'

const route = useRoute()
const isSearchOverlayVisible = ref(false)
const globalState = useGlobalStateStore()

const handleSearchClick = () => {
  if (route.name === 'search-results') {
    globalState.requestSearchFocus()
  } else {
    isSearchOverlayVisible.value = true
  }
}

const navLinks = [
  { path: '/workspaces', label: 'Workspaces' },
  { path: '/exposures', label: 'Exposures' },
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
          <li>
            <ActionButton
              type="button"
              variant="icon"
              size="sm"
              aria-label="Open search"
              @click="handleSearchClick"
              content-section="Header navigation"
            >
              <span class="sr-only">Open search</span>
              <SearchIcon class="w-5 h-5" />
            </ActionButton>
          </li>
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
            <UserDropdown />
          </li>
        </ul>
      </nav>
    </div>
    <SearchOverlay :show="isSearchOverlayVisible" @close="isSearchOverlayVisible = false" />
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
