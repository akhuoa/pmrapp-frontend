<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import type { ExposureInfo } from '@/types/exposure'
// TODO: Remove this import when API is available
import { mockExposureInfo } from '@/mocks/exposureMockData'
import { exposureService } from '@/services/exposureService'
import FileIcon from '@/components/icons/FileIcon.vue'

const props = defineProps<{
  alias: string
}>()

const exposureInfo = ref<ExposureInfo | null>(null)
const error = ref<string | null>(null)
// TODO: Remove this state when API is available
const isLoadingMock = ref(false)

try {
  exposureInfo.value = await exposureService.getExposureInfo(props.alias)
} catch (err) {
  error.value = err instanceof Error ? err.message : 'Failed to load exposure'
  console.error('Error loading exposure:', err)
}

// TODO: Remove this function when API is available
const loadMockData = async () => {
  isLoadingMock.value = true
  error.value = null

  try {
    await new Promise((resolve) => setTimeout(resolve, 200)) // Simulate API delay
    exposureInfo.value = mockExposureInfo
  } catch (err) {
    error.value = 'Failed to load mock data'
    console.error('Error loading mock data:', err)
  } finally {
    isLoadingMock.value = false
  }
}
</script>

<template>
  <div v-if="error" class="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
    <h3 class="font-semibold mb-2">Error loading exposure</h3>
    <p class="text-sm">{{ error }}</p>

    <!-- TODO: Remove this section when API is available -->
    <div class="mt-4 pt-4 border-t border-red-300">
      <p class="text-sm text-gray-700 mb-3">
        <strong>Temporary Solution:</strong> The API is currently unavailable. You can load sample data for testing purposes.
        This is fixed sample data for a specific exposure alias. Regardless of which exposure URL you visit,
        the same mock data will be loaded. This feature will be removed once the API is ready.
      </p>
      <button
        @click="loadMockData"
        :disabled="isLoadingMock"
        class="button-primary"
      >
        {{ isLoadingMock ? 'Loading...' : 'Load Mock Data (Temporary)' }}
      </button>
    </div>
  </div>

  <div v-else-if="exposureInfo" class="flex flex-col lg:flex-row gap-8">
    <article class="flex-1">
      <h1 class="text-4xl font-bold mb-6">
        Exposure {{ exposureInfo.exposure.id }}
      </h1>
      <p class="text-gray-600 mb-4">{{ exposureInfo.exposure.description }}</p>
      <div class="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 class="text-xl font-semibold mb-4">Files</h2>
        <ul class="space-y-2">
          <li v-for="entry in exposureInfo.files" :key="entry[0]">
            <RouterLink
              :to="`/exposure/${alias}/${entry[0]}`"
              class="text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-2"
            >
              <FileIcon class="text-gray-500" />
              {{ entry[0]}}
            </RouterLink>
          </li>
        </ul>
      </div>
    </article>
    <aside class="w-full lg:w-80">
      <section class="pb-6">
        <h4 class="text-lg font-semibold mb-3">Source</h4>
        <div class="text-sm text-gray-700 leading-relaxed">
          Derived from workspace
          <RouterLink
            :to="`/workspace/${exposureInfo.workspace_alias}`"
            class="text-primary hover:text-primary-hover transition-colors"
          >
            {{ exposureInfo.exposure.description }}
          </RouterLink>
          at changeset
          <RouterLink
            :to="`/workspace/${exposureInfo.workspace_alias}/file/${exposureInfo.exposure.commit_id}`"
            class="text-primary hover:text-primary-hover transition-colors font-mono"
          >
            {{ exposureInfo.exposure.commit_id.substring(0, 12) }}
          </RouterLink>.
        </div>
      </section>
      <section class="pt-6 border-t border-gray-200">
        <h4 class="text-lg font-semibold mb-3">Navigation</h4>
        <nav>
          <ul class="space-y-2">
            <li
              v-for="entry in exposureInfo.files.filter((e) => e[1] === true)"
              :key="entry[0]"
              class="text-sm"
            >
              <RouterLink
                :to="`/exposure/${alias}/${entry[0]}`"
                class="text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-2"
              >
                <span class="text-gray-400">›</span>
                {{ entry[0] }}
              </RouterLink>
            </li>
          </ul>
        </nav>
      </section>
    </aside>
  </div>
</template>

<style scoped>
@import '@/assets/button.css';
</style>
