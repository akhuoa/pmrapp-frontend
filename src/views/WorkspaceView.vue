<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-6">Workspace Listing</h1>
        <p class="text-lg text-gray-600 mb-8">
          Browse and explore all workspaces.
        </p>

        <!-- Placeholder content -->
        <div class="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <p class="text-gray-500">Workspace listing coming soon...</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
