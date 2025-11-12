<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts"></script>

<template>
  <header class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
        <img src="/logo.png" alt="Physiome Model Repository" width="48" height="48" />
      </RouterLink>

      <nav>
        <ul class="flex items-center gap-4">
          <li>
            <RouterLink to="/" class="hover:opacity-80 transition-opacity"> Workspace </RouterLink>
          </li>
          <li>
            <RouterLink to="/about" class="hover:opacity-80 transition-opacity">
              Exposure
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/models" class="hover:opacity-80 transition-opacity">
              Login
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
