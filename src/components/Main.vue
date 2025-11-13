<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts"></script>

<template>
  <main class="py-12">
    <div class="container mx-auto px-4">

      <section class="text-center mb-16">
        <h1 class="text-5xl font-bold mb-4">
          Physiome Model Repository
        </h1>
        <p class="text-xl max-w-3xl mx-auto leading-relaxed">
          Welcome to the demo of the platform that will power the next generation of the
          Physiome Model Repository, written in Rust.
        </p>
      </section>

      <section class="bg-white mb-12 rounded-lg p-8 border border-gray-200 max-w-4xl mx-auto">
        <div class="flex items-center justify-between flex-wrap gap-6">
          <div class="flex-1 min-w-[250px]">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              Workspace Listing
            </h2>
            <p class="text-gray-600">
              Browse and explore all workspaces in the repository.
            </p>
          </div>
          <div>
            <RouterLink
              to="/workspace"
              class="inline-block bg-[#830a28] hover:bg-[#d11241] text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              View Workspaces
            </RouterLink>
          </div>
        </div>
      </section>

      <section class="rounded-lg p-8 text-center">
        <div class="flex items-start gap-4">
          <div class="flex-1">
            <p>
              The code for this project may be found on
              <a
                href="https://github.com/Physiome/pmrplatform/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[#830a28] hover:text-[#d11241] transition-colors underline font-medium"
              >its project page on GitHub</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
