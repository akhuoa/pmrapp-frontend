<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchInput from '@/components/molecules/SearchInput.vue'
import { SEARCH_KIND_NAMES } from '@/constants/search'
import { buildQuerySearchQuery, buildSearchQuery, parseQueryFiltersFromQuery } from '@/utils/search'
import Keycap from '@/components/atoms/Keycap.vue'
import Dialog from '@/components/molecules/Dialog.vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<(e: 'close') => void>()

const router = useRouter()
const route = useRoute()
const searchInputRef = ref<InstanceType<typeof SearchInput> | null>(null)

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      // Double nextTick to ensure focus happens
      // after Dialog's own nextTick callback
      // that focuses dialogRef (which steals focus).
      nextTick(() => {
        nextTick(() => {
          searchInputRef.value?.searchInputRef?.focus()
        })
      })
    }
  },
)

watch(
  () => route.fullPath,
  () => {
    if (props.show) {
      emit('close')
    }
  },
)

const handleSearch = (searchKind: string, searchTerm: string) => {
  router.push({ path: '/search', query: buildSearchQuery(searchKind, searchTerm, route.query) })
  emit('close')
}

const handleQuerySearch = (request: {
  query?: string
  filters?: Array<{ kind: string; term: string }>
}) => {
  router.push({
    path: '/search',
    query: buildQuerySearchQuery(request.query ?? '', request.filters ?? [], route.query),
  })
  emit('close')
}

const getInitialTerm = (): string => {
  const queryParam = route.query.query

  if (typeof queryParam === 'string') {
    return queryParam
  }

  return ''
}
</script>

<template>
  <Dialog
    :show="show"
    title="Search"
    position="top"
    @close="emit('close')"
  >
    <div class="mb-4 text-sm text-gray-500 dark:text-gray-400">
      Type a term and press <Keycap>Enter</Keycap> to search the repository,
      or use the more options to filter by category (author, keyword, publication references), or combine both.
    </div>
    <div class="pb-4">
      <SearchInput
        ref="searchInputRef"
        :inOverlay="true"
        :initial-kind="''"
        :initial-term="getInitialTerm()"
        :initial-filters="parseQueryFiltersFromQuery(route.query, SEARCH_KIND_NAMES)"
        @search="handleSearch"
        @querySearch="handleQuerySearch"
        @close="emit('close')"
      />
    </div>
  </Dialog>
</template>
