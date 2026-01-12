<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import ActionButton from '@/components/atoms/ActionButton.vue'
import BackButton from '@/components/atoms/BackButton.vue'
import LoadingBox from '@/components/atoms/LoadingBox.vue'
import FileIcon from '@/components/icons/FileIcon.vue'
import ErrorBlock from '@/components/molecules/ErrorBlock.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import { useBackNavigation } from '@/composables/useBackNavigation'
import { useExposureStore } from '@/stores/exposure'
import type { ExposureInfo } from '@/types/exposure'
import { trackButtonClick } from '@/utils/analytics'

const props = defineProps<{
  alias: string
}>()

const DEFAULT_LICENSE = 'https://creativecommons.org/licenses/by/3.0/'
const exposureStore = useExposureStore()
const exposureInfo = ref<ExposureInfo | null>(null)
const error = ref<string | null>(null)
const isLoading = ref(true)
const detailHTML = ref<string>('')
const htmlViewRef = ref<HTMLElement | null>(null)
const licenseInfo = ref<string>(DEFAULT_LICENSE)
const { goBack } = useBackNavigation('/exposures')

const pageTitle = computed(() => {
  if (!exposureInfo.value) return 'No information.'
  return exposureInfo.value.exposure.description || `Exposure ${exposureInfo.value.exposure.id}`
})

const openCORFiles = computed(() => {
  if (!exposureInfo.value) return []

  return exposureInfo.value.files.filter((entry) => {
    const filename = entry[0]
    return filename.endsWith('.omex') || filename.endsWith('.cellml') || filename.endsWith('.sedml')
  })
})

const navigationFiles = computed(() => {
  if (!exposureInfo.value) return []

  return exposureInfo.value.files.filter((entry) => entry[1] === true)
})

const buildOpenCORURL = (option?: string) => {
  if (!exposureInfo.value || openCORFiles.value.length === 0) return ''

  const baseURL = `${exposureInfo.value.workspace.url}rawfile/${exposureInfo.value.exposure.commit_id}`

  const sortedFiles = [...openCORFiles.value].sort((a, b) => {
    const getOrder = (filename: string) => {
      if (filename.endsWith('.cellml')) return 1
      if (filename.endsWith('.sedml')) return 2
      if (filename.endsWith('.omex')) return 3
      return 4
    }
    return getOrder(a[0]) - getOrder(b[0])
  })

  const fileURLs = sortedFiles.map((entry) => `${baseURL}/${entry[0]}`).join('%7C')
  const command = sortedFiles.length > 1 ? 'openFiles' : 'openFile'

  const opencorLink = `opencor://${command}/${fileURLs}`
  if (option !== 'desktop') {
    return `//opencor.ws/app/?${opencorLink}`
  }
  return opencorLink
}

const convertFirstTextNodeToTitle = () => {
  if (!htmlViewRef.value) return

  const firstChild = htmlViewRef.value.firstChild
  if (firstChild && firstChild.nodeType === 3) {
    const textContent = firstChild.textContent?.trim()
    if (textContent) {
      const h2 = document.createElement('h2')
      h2.textContent = textContent
      htmlViewRef.value.replaceChild(h2, firstChild)
    }
  }
}

const handleClick = (event: Event) => {
  const buttonText = (event.currentTarget as HTMLElement)?.textContent?.trim() || ''
  const contentSection = `Exposure Detail - ${pageTitle.value}`
  const link = (event.currentTarget as HTMLElement)?.getAttribute('href') || ''

  trackButtonClick({
    button_name: buttonText,
    content_section: contentSection,
    link_category: link,
  })
}

watch(detailHTML, async () => {
  if (detailHTML.value) {
    await nextTick()
    convertFirstTextNodeToTitle()
  }
})

onMounted(async () => {
  try {
    exposureInfo.value = await exposureStore.getExposureInfo(props.alias)

    const fileWithViews = exposureInfo.value.exposure?.files?.find(
      (file) => file.views && file.views.length > 0,
    )

    if (fileWithViews) {
      const viewEntry = fileWithViews.views.find((v) => v.view_key === 'view')
      const licenseEntry = fileWithViews.views.find((v) => v.view_key === 'license_citation')
      // This route path is used to fix relative paths in the HTML content.
      // It is not a part of the API request parameters.
      // Note: Keep as "exposure" (singular) to match server file paths, not the router path.
      const routePath = `/exposure/${props.alias}`

      if (viewEntry) {
        detailHTML.value = await exposureStore.getExposureSafeHTML(
          fileWithViews.exposure_id,
          viewEntry.exposure_file_id,
          'view',
          'index.html',
          routePath,
        )
      }

      if (licenseEntry) {
        licenseInfo.value = await exposureStore.getExposureSafeHTML(
          fileWithViews.exposure_id,
          licenseEntry.exposure_file_id,
          'license_citation',
          'license.txt',
          routePath,
        )
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load exposure'
    console.error('Error loading exposure:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <BackButton
    label="Back to Exposures"
    content-section="Exposure Detail"
    :on-click="goBack"
  />

  <ErrorBlock
    v-if="error"
    title="Error loading exposure"
    :error="error"
  />

  <LoadingBox v-else-if="isLoading" message="Loading exposure..." />

  <div v-else-if="exposureInfo" class="flex flex-col lg:flex-row gap-8">
    <article class="w-full lg:flex-1 lg:min-w-0">
      <PageHeader
        :title="pageTitle"
      />

      <div v-if="detailHTML" class="box mb-8">
        <div ref="htmlViewRef" v-html="detailHTML" class="html-view"></div>
      </div>

      <div class="box">
        <h2 class="text-xl font-semibold mb-4">Files</h2>
        <ul class="space-y-0">
          <li v-for="entry in exposureInfo.files" :key="entry[0]"
            class="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:mb-0 last:pb-0 last:border-b-0 flex items-center justify-between">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <FileIcon class="text-foreground flex-shrink-0" />
              <span class="text-sm break-all">{{ entry[0] }}</span>
            </div>
            <div class="flex items-center gap-2 ml-4 flex-shrink-0">
              <ActionButton
                v-if="entry[1] === true"
                variant="primary"
                size="sm"
                :to="`/exposures/${alias}/${entry[0]}`"
                contentSection="exposure_file_list"
              >
                View
              </ActionButton>
              <ActionButton
                variant="secondary"
                size="sm"
                :to="`/workspaces/${exposureInfo.workspace_alias}/rawfile/${exposureInfo.exposure.commit_id}/${entry[0]}`"
                contentSection="exposure_file_list"
              >
                Download
              </ActionButton>
            </div>
          </li>
        </ul>
      </div>
    </article>
    <aside class="w-full lg:w-70 xl:w-80 lg:flex-shrink-0">
      <section class="pb-6">
        <h4 class="text-lg font-semibold mb-3">Source</h4>
        <div class="text-sm leading-relaxed">
          Derived from workspace
          <RouterLink
            :to="`/workspaces/${exposureInfo.workspace_alias}`"
            class="text-link"
          >
            {{ exposureInfo.exposure.description }}
          </RouterLink>
          at changeset
          <RouterLink
            :to="`/workspaces/${exposureInfo.workspace_alias}/file/${exposureInfo.exposure.commit_id}`"
            class="text-link font-mono"
          >
            {{ exposureInfo.exposure.commit_id.substring(0, 12) }}
          </RouterLink>.
        </div>
      </section>
      <section v-if="openCORFiles.length > 0" class="pt-6 pb-6 border-t border-gray-200 dark:border-gray-700">
        <h4 class="text-lg font-semibold mb-3">Views Available</h4>
        <nav>
          <ul class="space-y-2">
            <li class="text-sm">
              <a
                :href="buildOpenCORURL()"
                class="text-link inline-flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
                @click="handleClick"
              >
                <span class="text-foreground">›</span>
                Open in OpenCOR's Web app
              </a>
            </li>
          </ul>
        </nav>
      </section>
      <section v-if="navigationFiles.length > 0" class="pt-6 pb-6 border-t border-gray-200 dark:border-gray-700">
        <h4 class="text-lg font-semibold mb-3">Navigation</h4>
        <nav>
          <ul class="space-y-2">
            <li
              v-for="entry in navigationFiles"
              :key="entry[0]"
              class="text-sm"
            >
              <RouterLink
                :to="`/exposures/${alias}/${entry[0]}`"
                class="text-link inline-flex items-center gap-2 break-all"
              >
                <span class="text-foreground">›</span>
                {{ entry[0] }}
              </RouterLink>
            </li>
          </ul>
        </nav>
      </section>
      <section class="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 class="text-lg font-semibold mb-3">License</h4>
        <nav>
          <ul class="space-y-2">
            <li
              class="text-sm"
            >
              <a :href="licenseInfo" class="text-link" target="_blank" rel="noopener noreferrer">{{ licenseInfo }}</a>
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

.html-view {
  @apply text-sm;

  & :deep(a) {
    @apply text-link;
  }

  & :deep(h2) {
    @apply text-2xl font-semibold mt-0 mb-8;
  }

  & :deep(h3),
  & :deep(h4) {
    @apply text-xl font-semibold mt-8 mb-4;
  }

  & :deep(> div > h2),
  & :deep(> div > h3),
  & :deep(> div > h4) {
    @apply mt-0;
  }

  & :deep(p) {
    @apply text-sm mb-4;
  }

  & :deep(img) {
    @apply max-w-full h-auto;
  }

  & :deep(table) {
    @apply w-full border border-collapse border-gray-300 dark:border-gray-600 mb-4 table-fixed;
  }

  & :deep(table caption) {
    @apply text-sm font-medium mb-2;
  }

  & :deep(table td), & :deep(table th) {
    @apply border border-gray-300 dark:border-gray-600 p-2;
  }

  & :deep(table td) {
    @apply align-top text-sm;
  }
}
</style>
