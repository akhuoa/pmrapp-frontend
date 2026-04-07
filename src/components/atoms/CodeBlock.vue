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
import { highlightService } from '@/services/highlightService'

// Minimal HTML entity encoding used to display plain text before the service responds.
const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const props = defineProps<{
  code: string
  filename: string
}>()

const codeBlock = ref<HTMLElement | null>(null)
const preBlock = ref<HTMLElement | null>(null)
const darkThemeMediaQuery = ref<MediaQueryList | null>(null)
const isWrapped = ref(false)
const isHighlighting = ref(false)

// Holds the v-html content for the <code> element.
// Initialised with escaped plain text so the file is immediately visible.
const displayCode = ref(escapeHtml(props.code))

// Generation counter used to discard stale service responses when the file
// changes while a previous request is still in flight.
// Declared with `let` in <script setup> – each component instance gets its own
// copy because Vue runs the setup function once per instance.
let requestGeneration = 0

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

/**
 * Remove any stale line-number rows injected by the Prism line-numbers plugin
 * from a previous highlighting pass so the plugin rebuilds them correctly.
 */
const clearLineNumberRows = () => {
  preBlock.value?.querySelectorAll('.line-numbers-rows').forEach((el) => {
    el.remove()
  })
}

/**
 * Fire the Prism lifecycle hooks that the line-numbers plugin listens to.
 * Must be called after the highlighted HTML has been flushed to the DOM.
 */
const triggerLineNumberHooks = () => {
  if (!codeBlock.value || !preBlock.value) return
  const env = {
    element: codeBlock.value,
    language: detectedLanguage.value,
    grammar: Prism.languages[detectedLanguage.value],
    code: props.code,
  }
  Prism.hooks.run('after-highlight', env)
  Prism.hooks.run('complete', env)
}

const highlightCode = async () => {
  if (!props.code || detectedLanguage.value === 'none') {
    displayCode.value = escapeHtml(props.code)
    return
  }

  // Show plain text immediately while the service request is in flight.
  displayCode.value = escapeHtml(props.code)
  isHighlighting.value = true
  const generation = ++requestGeneration

  try {
    // Off-main-thread path: ask the server to highlight the code.
    // Security: displayCode is populated only with the response from our own
    // trusted backend API (/api/highlight).  The backend is responsible for
    // producing safe Prism-tokenised HTML.  Never pass untrusted third-party
    // HTML through this path.
    const html = await highlightService.highlight(props.code, detectedLanguage.value)

    // Discard the result if a newer request has already been dispatched.
    if (generation !== requestGeneration) return

    clearLineNumberRows()
    displayCode.value = html
    await nextTick()
    triggerLineNumberHooks()
  } catch {
    // Service unavailable or failed – fall back to main-thread Prism so the
    // viewer still works in development or when the backend is unreachable.
    if (generation !== requestGeneration) return

    clearLineNumberRows()
    await nextTick()
    if (!codeBlock.value || generation !== requestGeneration) return
    // Vue has already applied displayCode (escaped plain text) to innerHTML
    // via v-html, so codeBlock.textContent is the original source ready for Prism.
    codeBlock.value.removeAttribute('data-highlighted')
    Prism.highlightElement(codeBlock.value)
    // Sync displayCode so Vue does not overwrite Prism's output on re-render.
    displayCode.value = codeBlock.value.innerHTML
  }

  if (generation === requestGeneration) {
    isHighlighting.value = false
  }
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
    const lineSpans = preBlock.value.querySelectorAll('.line-numbers-rows > span')
    lineSpans.forEach((span) => {
      const lineSpan = span as HTMLElement
      lineSpan.style.height = ''
    })
  }

  if (Prism.plugins.lineNumbers?.resize) {
    Prism.plugins.lineNumbers.resize(preBlock.value)
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

  if (preBlock.value && typeof ResizeObserver === 'function') {
    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (Prism.plugins.lineNumbers?.resize) {
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
