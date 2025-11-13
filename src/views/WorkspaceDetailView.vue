<script setup lang="ts">
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import WorkspaceDetail from '@/components/WorkspaceDetail.vue'

const route = useRoute()
const alias = route.params.alias as string
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow py-12">
      <div class="container mx-auto px-4">
        <Suspense>
          <template #default>
            <WorkspaceDetail :alias="alias" />
          </template>
          <template #fallback>
            <p class="text-gray-600">Loading workspace...</p>
          </template>
        </Suspense>
      </div>
    </main>
    <Footer />
  </div>
</template>
