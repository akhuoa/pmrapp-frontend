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
    <div class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Search</h2>
        <CloseButton @click="emit('close')" />
      </div>
      <SearchInput ref="searchInputRef" initial-kind="" initial-term="" @search="handleSearch" />
    </div>
  </div>
</template>
