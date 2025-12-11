<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ActionButton from '@/components/atoms/ActionButton.vue'
import FileIcon from '@/components/icons/FileIcon.vue'
import { useExposureStore } from '@/stores/exposure'
import type { ExposureInfo } from '@/types/exposure'
import PageHeader from './molecules/PageHeader.vue'
import ErrorBlock from './organisms/ErrorBlock.vue'

const props = defineProps<{
  alias: string
}>()

const exposureStore = useExposureStore()
const exposureInfo = ref<ExposureInfo | null>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    exposureInfo.value = await exposureStore.getExposureInfo(props.alias)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load exposure'
    console.error('Error loading exposure:', err)
  }
})
</script>

<template>
  <ErrorBlock
    v-if="error"
    title="Error loading exposure"
    :error="error"
  />

  <div v-else-if="exposureInfo" class="flex flex-col lg:flex-row gap-8">
    <article class="flex-1">
      <div class="mb-4">
        <RouterLink to="/exposure" class="text-link">
          &larr; Back
        </RouterLink>
      </div>

      <PageHeader
        :title="`Exposure ${exposureInfo.exposure.id}`"
        :description="exposureInfo.exposure.description || undefined"
      />

      <div class="box">
        <h2 class="text-xl font-semibold mb-4">Files</h2>
        <ul class="space-y-0">
          <li v-for="entry in exposureInfo.files" :key="entry[0]"
            class="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:mb-0 last:pb-0 last:border-b-0 flex items-center justify-between">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <FileIcon class="text-foreground flex-shrink-0" />
              <span class="truncate text-sm">{{ entry[0] }}</span>
            </div>
            <div class="flex items-center gap-2 ml-4 flex-shrink-0">
              <ActionButton
                v-if="entry[1] === true"
                variant="primary"
                size="sm"
                :to="`/exposure/${alias}/${entry[0]}`"
              >
                View
              </ActionButton>
              <ActionButton
                variant="secondary"
                size="sm"
                :to="`/workspace/${exposureInfo.workspace_alias}/rawfile/${exposureInfo.exposure.commit_id}/${entry[0]}`"
              >
                Download
              </ActionButton>
            </div>
          </li>
        </ul>
      </div>
    </article>
    <aside class="w-full lg:w-80">
      <section class="pb-6">
        <h4 class="text-lg font-semibold mb-3">Source</h4>
        <div class="text-sm leading-relaxed">
          Derived from workspace
          <RouterLink
            :to="`/workspace/${exposureInfo.workspace_alias}`"
            class="text-link"
          >
            {{ exposureInfo.exposure.description }}
          </RouterLink>
          at changeset
          <RouterLink
            :to="`/workspace/${exposureInfo.workspace_alias}/file/${exposureInfo.exposure.commit_id}`"
            class="text-link font-mono"
          >
            {{ exposureInfo.exposure.commit_id.substring(0, 12) }}
          </RouterLink>.
        </div>
      </section>
      <section class="pt-6 border-t border-gray-200 dark:border-gray-700">
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
                class="text-link inline-flex items-center gap-2"
              >
                <span class="text-foreground">›</span>
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
@import '@/assets/text-link.css';
@import '@/assets/box.css';
</style>
