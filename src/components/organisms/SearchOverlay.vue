<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import CloseButton from '@/components/atoms/CloseButton.vue'
import SearchInput from '@/components/molecules/SearchInput.vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const searchInputRef = ref<InstanceType<typeof SearchInput> | null>(null)

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        searchInputRef.value?.searchInputRef?.focus()
      })
    }
  },
)

const handleSearch = (searchKind: string, searchTerm: string) => {
  router.push({ path: '/search', query: { kind: searchKind, term: searchTerm } })
  emit('close')
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-800/75 dark:bg-gray-900/75 z-50 flex justify-center items-start pt-20"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div class="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        <h2 class="text-lg font-semibold">Search</h2>
        <CloseButton @click="emit('close')" />
      </div>
      <div class="my-4 text-sm text-gray-500 dark:text-gray-400">
        <p class="lg:w-3/4">
          Search for models by selecting a category from the dropdown on the left,
          <br />
          such as publication references, authors, or CellML keywords. Start typing to see available terms.
        </p>
      </div>
      <div class="pt-4 pb-8">
        <SearchInput ref="searchInputRef" initial-kind="" initial-term="" @search="handleSearch" />
      </div>
    </div>
  </div>
</template>
