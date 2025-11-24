<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import type { ExposureFileInfo } from '@/types/exposure'
import { getExposureService } from '@/services'
import PageHeader from './molecules/PageHeader.vue'
import ErrorBlock from './organisms/ErrorBlock.vue'

const props = defineProps<{
  alias: string
  file: string
}>()

const exposureFileInfo = ref<ExposureFileInfo | null>(null)
const error = ref<string | null>(null)

try {
  exposureFileInfo.value = await getExposureService().getExposureFileInfo(props.alias, props.file)
} catch (err) {
  error.value = err instanceof Error ? err.message : 'Failed to load exposure file'
  console.error('Error loading exposure file:', err)
}
</script>

<template>
  <ErrorBlock
    v-if="error"
    title="Error loading exposure file"
    :error="error"
  />

  <div v-else-if="exposureFileInfo" class="flex flex-col lg:flex-row gap-8">
    <article class="flex-1">
      <PageHeader
        :title="`Exposure ${exposureFileInfo.Target[0]?.exposure_id}`"
        :description="exposureFileInfo.Target[0]?.workspace_file_path || undefined"
      />

      <div class="box">
        <h2 class="text-xl font-semibold mb-4">Views</h2>
        <ul class="space-y-0">
          <li v-for="entry in exposureFileInfo.Target[0]?.views" :key="entry.id"
            class="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:mb-0 last:pb-0 last:border-b-0 flex items-center justify-between">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              &bull;
              <RouterLink
                :to="`/exposure/${props.alias}/${props.file}/${entry.view_key}`"
                class="text-link truncate"
              >
                <span>{{ entry.view_key }}</span>
              </RouterLink>
            </div>
          </li>
        </ul>
      </div>
    </article>
  </div>
</template>

<style scoped>
@import '@/assets/text-link.css';
@import '@/assets/box.css';
</style>
