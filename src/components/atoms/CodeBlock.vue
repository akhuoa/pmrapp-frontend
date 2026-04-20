<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePrismHighlight } from '@/composables/usePrismHighlight'

// Minimal HTML entity encoding used to display plain text before the service
// worker has finished highlighting the code.
const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')

const props = defineProps<{
  code: string
  filename: string
}>()

const { highlight } = usePrismHighlight()

const codeBlock = ref<HTMLElement | null>(null)
const preBlock = ref<HTMLElement | null>(null)
const darkThemeMediaQuery = ref<MediaQueryList | null>(null)
const isWrapped = ref(false)
const isHighlighting = ref(false)

// Holds the v-html content for the <code> element.
// Initialised with escaped plain text so the file is immediately visible
// before the service worker has finished highlighting.
const displayCode = ref(escapeHtml(props.code))

// Generation counter used to discard stale service-worker responses when the
// displayed file changes while a previous request is still in flight.
// Declared with `let` in <script setup> – each component instance gets its own
// copy because Vue runs the setup function once per instance.
let requestGeneration = 0

const preformatClass = [
  'bg-gray-50',
  'dark:bg-gray-900',
  'rounded',
  'overflow-x-auto',
  'text-sm!',
  'm-0!',
  'transition-all',
  'duration-200',
  'ease-in-out',
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
  if (!props.code || detectedLanguage.value === 'none') {
    displayCode.value = escapeHtml(props.code)
    return
  }

  // Show plain text immediately while the service worker processes the code.
  displayCode.value = escapeHtml(props.code)
  isHighlighting.value = true
  const generation = ++requestGeneration

  // The composable sends work to the Prism service worker and returns the
  // highlighted HTML.  If the service worker is unavailable it falls back to
  // running Prism.highlight() on the main thread transparently.
  const html = await highlight(props.code, detectedLanguage.value)

  // Discard stale results if a newer request was dispatched while this one
  // was being processed.
  if (generation !== requestGeneration) return

  displayCode.value = html
  await nextTick()
  isHighlighting.value = false
}

const syncWrapAndLineNumbers = async () => {
  if (!preBlock.value || !codeBlock.value) return

  // Keep wrap classes in sync after Prism mutates highlighted markup.
  preBlock.value.classList.toggle('!whitespace-pre-wrap', isWrapped.value)
  codeBlock.value.classList.toggle('!whitespace-pre-wrap', isWrapped.value)

  await nextTick()

  // Re-check refs after await in case the component was unmounted.
  if (!preBlock.value) return

  if (!isWrapped.value) {
    return
  }
}

const refreshCodeBlock = async () => {
  await highlightCode()
  await syncWrapAndLineNumbers()
}

const toggleWrap = async () => {
  if (!preBlock.value || !codeBlock.value) return

  isWrapped.value = !isWrapped.value
  await syncWrapAndLineNumbers()
}

defineExpose({
  toggleWrap,
  isWrapped,
})

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
  void refreshCodeBlock()

  darkThemeMediaQuery.value = window.matchMedia('(prefers-color-scheme: dark)')

  // Load initial theme.
  loadPrismTheme(darkThemeMediaQuery.value.matches)

  // Listen for theme changes.
  darkThemeMediaQuery.value.addEventListener('change', handleThemeChange)
})

onBeforeUnmount(() => {
  if (darkThemeMediaQuery.value) {
    darkThemeMediaQuery.value.removeEventListener('change', handleThemeChange)
  }
})

watch(
  () => props.code,
  () => {
    void refreshCodeBlock()
  },
)
</script>

<template>
  <div>
    <div
      v-if="isHighlighting"
      class="animate-pulse bg-gray-100 dark:bg-gray-800 rounded px-3 py-2 text-sm text-gray-500 dark:text-gray-400 mb-2"
    >
      Highlighting code…
    </div>
    <pre
      ref="preBlock"
      :class="preformatClass"
    ><code
      ref="codeBlock"
      :class="`language-${detectedLanguage}`"
      v-html="displayCode"
    ></code></pre>
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

