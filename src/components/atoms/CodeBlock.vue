<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import Prism from 'prismjs'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-fortran'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-matlab'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import CopyButton from './CopyButton.vue'
import WrapButton from './WrapButton.vue'

const props = defineProps<{
  code: string
  filename: string
}>()

const codeBlock = ref<HTMLElement | null>(null)
const preBlock = ref<HTMLElement | null>(null)
const darkThemeMediaQuery = ref<MediaQueryList | null>(null)
let observer: ResizeObserver | null = null

const preformatClass = [
  'line-numbers',
  'bg-gray-50',
  'dark:bg-gray-900',
  'rounded',
  'overflow-x-auto',
  'text-sm!',
  'm-0!',
  'transition-all',
  'duration-200',
  'ease-in-out'
].join(' ')

const detectedLanguage = computed(() => {
  const ext = props.filename.split('.').pop()?.toLowerCase()

  // Map file extensions to Prism language names.
  const languageMap: Record<string, string> = {
    c: 'c',
    cellml: 'markup',
    conf: 'json',
    cpp: 'cpp',
    css: 'css',
    f77: 'fortran',
    fortran: 'fortran',
    h: 'cpp',
    htm: 'markup',
    html: 'markup',
    js: 'javascript',
    json: 'json',
    jsx: 'javascript',
    m: 'matlab',
    markdown: 'markdown',
    matlab: 'matlab',
    md: 'markdown',
    py: 'python',
    python: 'python',
    rdf: 'markup',
    sass: 'css',
    scss: 'css',
    sedml: 'markup',
    svg: 'markup',
    ts: 'javascript',
    tsx: 'javascript',
    xml: 'markup',
  }

  return ext ? languageMap[ext] || 'plaintext' : 'none'
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

const toggleWrap = async () => {
  if (!preBlock.value || !codeBlock.value) return

  const isWrapped = preBlock.value.classList.toggle('!whitespace-pre-wrap')
  codeBlock.value.classList.toggle('!whitespace-pre-wrap')

  await nextTick()

  if (!isWrapped) {
    const lineSpans = preBlock.value.querySelectorAll('.line-numbers-rows > span')
    lineSpans.forEach((span) => {
      (span as HTMLElement).style.height = ''
    })
  }

  if (Prism.plugins.lineNumbers && Prism.plugins.lineNumbers.resize) {
    Prism.plugins.lineNumbers.resize(preBlock.value)
  }
}

const loadPrismTheme = async (isDark: boolean) => {
  // Remove existing Prism theme stylesheets.
  const existingThemes = document.querySelectorAll('link[data-prism-theme]')
  existingThemes.forEach((link) => {
    link.remove()
  })

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

const handleThemeChange = (e: MediaQueryListEvent) => {
  loadPrismTheme(e.matches)
}

onMounted(() => {
  highlightCode()

  darkThemeMediaQuery.value = window.matchMedia('(prefers-color-scheme: dark)')

  // Load initial theme.
  loadPrismTheme(darkThemeMediaQuery.value.matches)

  // Listen for theme changes.
  darkThemeMediaQuery.value.addEventListener('change', handleThemeChange)

  if (preBlock.value) {
    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (Prism.plugins.lineNumbers && Prism.plugins.lineNumbers.resize) {
          Prism.plugins.lineNumbers.resize(entry.target as HTMLElement)
        }
      }
    })

    observer.observe(preBlock.value)
  }
})

onBeforeUnmount(() => {
  if (darkThemeMediaQuery.value) {
    darkThemeMediaQuery.value.removeEventListener('change', handleThemeChange)
  }

  if (observer) {
    observer.disconnect()
  }
})

watch(
  () => props.code,
  () => {
    highlightCode()
  },
)
</script>

<template>
  <div class="relative">
    <pre
      ref="preBlock"
      :class="preformatClass"
    ><code
      ref="codeBlock"
      :class="`language-${detectedLanguage}`"
    >{{ code }}</code></pre>

    <div class="absolute top-2 right-2">
      <WrapButton :text="code" title="Wrap code" @click="toggleWrap" />
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

:deep(.line-numbers-rows > span) {
  transition: height 0.2s ease-in-out;
}
</style>

<style>
@media (prefers-color-scheme: light) {
  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    background: transparent !important;
  }
}
</style>
