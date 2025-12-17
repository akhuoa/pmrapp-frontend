<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
</script>

<template>
  <section class="text-center mb-16">
    <h1 class="text-5xl font-bold mb-4">
      Physiome Model Repository
    </h1>
    <p class="text-xl max-w-3xl mx-auto leading-relaxed">
      Welcome to the demo of the platform that will power the next generation of the
      Physiome Model Repository, written in Rust.
    </p>
  </section>

  <section class="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
    <RouterLink
      to="/workspace"
      class="box p-8 flex items-center gap-6 hover:shadow-lg transition-shadow group"
    >
      <div class="flex-1">
        <h2 class="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
          Workspaces
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-base">
          Access project files and Git-based version history for all models.
        </p>
      </div>
      <div class="flex-shrink-0">
        <ArrowRightIcon
          class="text-primary transform group-hover:translate-x-1 transition-transform"
        />
      </div>
    </RouterLink>

    <RouterLink
      to="/exposure"
      class="box p-8 flex items-center gap-6 hover:shadow-lg transition-shadow group"
    >
      <div class="flex-1">
        <h2 class="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
          Exposures
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-base">
          Explore published models and simulation results for citation and public use.
        </p>
      </div>
      <div class="flex-shrink-0">
        <ArrowRightIcon
          class="text-primary transform group-hover:translate-x-1 transition-transform"
        />
      </div>
    </RouterLink>
  </section>

  <section class="p-8 text-center">
    <div class="flex items-start gap-4">
      <div class="flex-1">
        <p>
          The code for this project may be found on
          <a
            href="https://github.com/Physiome/pmrplatform/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-link underline font-medium"
          >its project page on GitHub</a>.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import '@/assets/text-link.css';
@import '@/assets/box.css';
</style>
