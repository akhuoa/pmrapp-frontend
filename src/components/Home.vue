<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import NavigationCard from '@/components/molecules/NavigationCard.vue'
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
    <NavigationCard
      to="/workspace"
      title="Workspaces"
      description="Access project files and Git-based version history for all models."
    />

    <NavigationCard
      to="/exposure"
      title="Exposures"
      description="Explore published models and simulation results for citation and public use."
    />
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
