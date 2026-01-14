<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-markdown'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import CopyButton from './CopyButton.vue'

const props = defineProps<{
  code: string
  filename: string
}>()

const codeBlock = ref<HTMLElement | null>(null)

const detectedLanguage = computed(() => {
  const ext = props.filename.split('.').pop()?.toLowerCase()

  // Map file extensions to Prism language names.
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'javascript',
    tsx: 'javascript',
    py: 'python',
    python: 'python',
    css: 'css',
    scss: 'css',
    sass: 'css',
    html: 'markup',
    htm: 'markup',
    xml: 'markup',
    svg: 'markup',
    md: 'markdown',
    markdown: 'markdown',
    cellml: 'markup',
    sedml: 'markup',
  }

  return ext ? languageMap[ext] || 'none' : 'none'
})

const highlightCode = async () => {
  await nextTick()
  if (codeBlock.value && props.code) {
    try {
      // Clear previous highlighting.
      codeBlock.value.removeAttribute('data-highlighted')

      if (detectedLanguage.value !== 'none') {
        Prism.highlightElement(codeBlock.value)
      }
    } catch (err) {
      console.error('Error highlighting code:', err)
    }
  }
}

const loadPrismTheme = async (isDark: boolean) => {
  // Remove existing Prism theme stylesheets.
  const existingThemes = document.querySelectorAll('link[data-prism-theme]')
  existingThemes.forEach(link => link.remove())

  // Create and add new theme stylesheet.
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.setAttribute('data-prism-theme', 'true')

  // Import from local node_modules.
  if (isDark) {
    const theme = await import('prismjs/themes/prism-okaidia.css?url')
    link.href = theme.default
  } else {
    const theme = await import('prismjs/themes/prism.css?url')
    link.href = theme.default
  }

  document.head.appendChild(link)
}

onMounted(() => {
  highlightCode()

  const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // Load initial theme.
  loadPrismTheme(darkThemeMediaQuery.matches)

  // Listen for theme changes.
  darkThemeMediaQuery.addEventListener('change', (e) => {
    loadPrismTheme(e.matches)
  })
})

watch(() => props.code, () => {
  highlightCode()
})
</script>

<template>
  <div class="relative">
    <pre class="line-numbers bg-gray-50 dark:bg-gray-900 rounded overflow-x-auto text-sm! m-0!"><code
      ref="codeBlock"
      :class="`language-${detectedLanguage}`"
    >{{ code }}</code></pre>

    <div class="absolute top-2 right-2">
      <CopyButton :text="code" title="Copy code" />
    </div>
  </div>
</template>

<style scoped>
pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}

code {
  font-family: inherit;
}
</style>
