<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useExposureStore } from '@/stores/exposure'
import type { ExposureFileInfo } from '@/types/exposure'
import PageHeader from './molecules/PageHeader.vue'
import ErrorBlock from './organisms/ErrorBlock.vue'

const props = defineProps<{
  alias: string
  file: string
}>()

const exposureStore = useExposureStore()
const exposureFileInfo = ref<ExposureFileInfo | null>(null)
const error = ref<string | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const { alias, file } = props
    const fileView = `${file}/view`
    // const fileDownload = file // This will return redirect path to download.
    exposureFileInfo.value = await exposureStore.getExposureFileInfo(alias, fileView)
    console.log('exposuree file info', exposureFileInfo.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load exposure file'
    console.error('Error loading exposure file:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="mb-4">
    <RouterLink :to="`/exposure/${props.alias}`" class="text-link">
      &larr; Back
    </RouterLink>
  </div>

  <ErrorBlock
    v-if="error"
    title="Error loading exposure file"
    :error="error"
  />

  <div v-else-if="isLoading" class="text-center box">
    Loading exposure file...
  </div>

  <div v-else-if="exposureFileInfo" class="flex flex-col lg:flex-row gap-8">
    <div v-if="exposureFileInfo.Redirect">
      Redirect: {{ exposureFileInfo.Redirect }}
    </div>

    <article class="flex-1" v-else>
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
