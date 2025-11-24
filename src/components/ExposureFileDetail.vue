<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import type { ExposureFileInfo } from '@/types/exposure'
import { getExposureService } from '@/services'
import FileIcon from '@/components/icons/FileIcon.vue'
import ActionButton from '@/components/atoms/ActionButton.vue'
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
    <!-- <aside class="w-full lg:w-80">
      <section class="pb-6">
        <h4 class="text-lg font-semibold mb-3">Source</h4>
        <div class="text-sm leading-relaxed">
          Derived from workspace
          <RouterLink
            :to="`/workspace/${ExposureFileInfo.workspace_alias}`"
            class="text-link"
          >
            {{ ExposureFileInfo.exposure.description }}
          </RouterLink>
          at changeset
          <RouterLink
            :to="`/workspace/${ExposureFileInfo.workspace_alias}/file/${ExposureFileInfo.exposure.commit_id}`"
            class="text-link font-mono"
          >
            {{ ExposureFileInfo.exposure.commit_id.substring(0, 12) }}
          </RouterLink>.
        </div>
      </section>
      <section class="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 class="text-lg font-semibold mb-3">Navigation</h4>
        <nav>
          <ul class="space-y-2">
            <li
              v-for="entry in ExposureFileInfo.files.filter((e) => e[1] === true)"
              :key="entry[0]"
              class="text-sm"
            >
              <RouterLink
                :to="`/exposure/${alias}/${entry[0]}`"
                class="text-link inline-flex items-center gap-2"
              >
                <span class="text-foreground">›</span>
                {{ entry[0] }}
              </RouterLink>
            </li>
          </ul>
        </nav>
      </section>
    </aside> -->
  </div>
</template>

<style scoped>
@import '@/assets/text-link.css';
@import '@/assets/box.css';
</style>
