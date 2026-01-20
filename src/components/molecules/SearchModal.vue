<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import CloseButton from '@/components/atoms/CloseButton.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const searchInput = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')

const closeModal = () => {
  emit('update:modelValue', false)
  searchQuery.value = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  // Close modal on Escape key.
  if (e.key === 'Escape' && props.modelValue) {
    closeModal()
  }

  // Open modal on Cmd+K (Mac) or Ctrl+K (other OS).
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    emit('update:modelValue', true)
  }
}

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    closeModal()
  }
}

// Focus input when modal opens.
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      // Wait for next tick to ensure DOM is updated.
      nextTick(() => {
        searchInput.value?.focus()
      })
    }
  },
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[1000] flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[10vh]"
        @click="handleBackdropClick"
      >
        <div class="search-modal bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl w-full max-w-2xl mx-4">
          <!-- Search Header. -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <SearchIcon class="w-6 h-6" />
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-gray-400"
            />
            <CloseButton @click="closeModal" />
          </div>

          <!-- Search Results. -->
          <div class="search-results p-4 min-h-[300px] max-h-[60vh] overflow-y-auto">
            <div v-if="!searchQuery" class="text-center text-gray-400 py-8">
              <p class="text-sm">Start typing to search...</p>
              <p class="text-xs mt-2 text-gray-500">Search for workspaces, exposures, and more</p>
            </div>
            <div v-else class="text-center text-gray-400 py-8">
              <p class="text-sm">No results found for "{{ searchQuery }}"</p>
              <p class="text-xs mt-2 text-gray-500">Search functionality coming soon</p>
            </div>
          </div>

          <!-- Search Footer. -->
          <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1">
                <kbd class="kbd">↑</kbd>
                <kbd class="kbd">↓</kbd>
                <span>to navigate</span>
              </span>
              <span class="flex items-center gap-1">
                <kbd class="kbd">↵</kbd>
                <span>to select</span>
              </span>
            </div>
            <span class="flex items-center gap-1">
              <kbd class="kbd">esc</kbd>
              <span>to close</span>
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@reference 'tailwindcss';

.search-modal {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .search-modal {
  transition: transform 0.2s ease-out;
}

.modal-enter-from .search-modal {
  transform: translateY(-20px);
}

.kbd {
  @apply
    inline-flex
    items-center
    justify-center
    min-w-[20px]
    h-5
    px-1.5
    rounded
    bg-gray-100
    dark:bg-gray-800
    border
    border-gray-300
    dark:border-gray-600
    font-mono
    text-[10px]
    font-semibold
    text-gray-700
    dark:text-gray-300;
}

.search-results::-webkit-scrollbar {
  width: 8px;
}

.search-results::-webkit-scrollbar-track {
  background: transparent;
}

.search-results::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.dark .search-results::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark .search-results::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
