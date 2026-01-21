<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/search'

interface Props {
  inSidebar: boolean
}

defineProps<Props>()

const searchStore = useSearchStore()
const router = useRouter()
const categoryFilters = ref<Map<string, string>>(new Map())
const termLoading = ref(false)
const selectedTerm = ref<{ kind: string; term: string } | null>(null)

const termButtonClass = [
  'px-3',
  'py-1.5',
  'bg-gray-100',
  'cursor-pointer',
  'dark:bg-gray-800',
  'hover:bg-gray-200',
  'dark:hover:bg-gray-700',
  'rounded-md',
  'text-sm',
  'transition-colors',
  'relative',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
].join(' ')

const termLoadingClass = [
  'absolute',
  'top-0',
  'left-0',
  'w-full',
  'h-full',
  'flex',
  'items-center',
  'justify-center',
  'bg-white/75',
  'dark:bg-gray-900/75',
  'rounded-md',
  'text-sm',
].join(' ')

onMounted(async () => {
  await searchStore.fetchCategories()
})

const handleTermClick = async (kind: string, term: string) => {
  termLoading.value = true
  selectedTerm.value = { kind, term }

  try {
    // Navigate to search results page.
    await router.push(`/search/${kind}/${encodeURIComponent(term)}`)
  } finally {
    termLoading.value = false
  }
}

const getFilteredTerms = (terms: string[], kind: string): string[] => {
  const filter = categoryFilters.value.get(kind)?.toLowerCase() || ''
  return terms
    .filter((t) => t.trim())
    .filter((t) => filter === '' || t.toLowerCase().includes(filter))
}
</script>

<template>
  <h2 class="text-3xl font-bold mb-6" v-if="!inSidebar">
    Browse by keyword
  </h2>

  <div v-if="searchStore.isLoading" class="text-center py-8">
    <p class="text-gray-500 dark:text-gray-400">Loading categories...</p>
  </div>

  <div v-else-if="searchStore.error" class="text-center py-8">
    <p class="text-red-600 dark:text-red-400">{{ searchStore.error }}</p>
  </div>

  <div v-else class="space-y-6">
    <div
      v-for="category in searchStore.categories"
      :key="category.kind"
      :class="{ 'box p-6': !inSidebar }"
    >
      <div
        class="flex items-center mb-4 gap-4"
        :class="{ 'justify-end': !inSidebar }"
      >
        <input
          v-if="category.kindInfo"
          type="search"
          placeholder="Filter keywords..."
          class="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          :class="{ 'w-full' : inSidebar }"
          :value="categoryFilters.get(category.kind) || ''"
          @input="categoryFilters.set(category.kind, ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div v-if="category.loading" class="text-gray-500 dark:text-gray-400">
        Loading...
      </div>

      <div v-else-if="category.error" class="text-red-600 dark:text-red-400">
        {{ category.error }}
      </div>

      <div
        v-else-if="category.kindInfo"
        class="flex flex-wrap gap-2 overflow-y-auto"
        :class="inSidebar ? 'max-h-[300px]' : 'max-h-40'"
      >
        <button
          v-for="term in getFilteredTerms(category.kindInfo.terms, category.kind)"
          :key="term"
          :class="termButtonClass"
          :disabled="termLoading"
          @click="handleTermClick(category.kind, term)"
        >
          {{ term }}
          <span
            v-if="termLoading && selectedTerm?.term === term && selectedTerm?.kind === category.kind"
            :class="termLoadingClass"
          >
            <span class="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/box.css';
</style>
