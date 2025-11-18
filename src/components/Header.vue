<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts"></script>

<template>
  <header class="header-border-top bg-white border-b border-gray-200 sticky top-0 z-100">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
        <img src="/logo.png" alt="Physiome Model Repository" width="48" height="48" />
      </RouterLink>

      <nav>
        <ul class="flex items-center gap-4">
          <li>
            <RouterLink
              to="/workspace"
              class="hover:opacity-80 transition-opacity"
              active-class="text-[#cc0000]"
            >
              Workspace
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/exposure"
              class="hover:opacity-80 transition-opacity"
              active-class="text-[#cc0000]"
            >
              Exposure
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/login"
              class="hover:opacity-80 transition-opacity"
              active-class="text-[#cc0000]"
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
</style>
