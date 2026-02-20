import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStateStore = defineStore('globalState', () => {
  const isSearchFocusRequested = ref(false)

  const requestSearchFocus = () => {
    isSearchFocusRequested.value = true
  }

  const consumeSearchFocus = () => {
    isSearchFocusRequested.value = false
  }

  return {
    isSearchFocusRequested,
    requestSearchFocus,
    consumeSearchFocus,
  }
})
