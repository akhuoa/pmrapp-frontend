<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import hljs from 'highlight.js/lib/core'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import markdown from 'highlight.js/lib/languages/markdown'
import python from 'highlight.js/lib/languages/python'
import xml from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/github.css'
import CopyButton from './CopyButton.vue'

hljs.registerLanguage('css', css)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('md', markdown)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
// CellML and SED-ML are XML-based.
hljs.registerLanguage('cellml', xml)
hljs.registerLanguage('sedml', xml)

const props = defineProps<{
  code: string
  filename: string
}>()

const codeBlock = ref<HTMLElement | null>(null)

const detectedLanguage = computed(() => {
  const ext = props.filename.split('.').pop()?.toLowerCase()

  // Map file extensions to highlight.js language names.
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'javascript',
    tsx: 'javascript',
    py: 'python',
    css: 'css',
    scss: 'css',
    sass: 'css',
    html: 'html',
    htm: 'html',
    xml: 'xml',
    svg: 'xml',
    md: 'markdown',
    markdown: 'markdown',
    cellml: 'xml',
    sedml: 'xml',
  }

  return ext ? languageMap[ext] || 'plaintext' : 'plaintext'
})

const highlightCode = async () => {
  await nextTick()
  if (codeBlock.value && props.code) {
    try {
      // Clear previous highlighting.
      codeBlock.value.removeAttribute('data-highlighted')

      if (detectedLanguage.value !== 'plaintext') {
        hljs.highlightElement(codeBlock.value)
      }
    } catch (err) {
      console.error('Error highlighting code:', err)
    }
  }
}

onMounted(() => {
  highlightCode()
})

watch(() => props.code, () => {
  highlightCode()
})
</script>

<template>
  <div class="relative">
    <pre class="bg-gray-50 dark:bg-gray-900 rounded overflow-x-auto text-sm m-0"><code
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

<style>
/* Light mode - default github theme. */
@media (prefers-color-scheme: light) {
  .hljs {
    background: rgb(249 250 251) !important;
    color: #24292e !important;
  }
}

/* Dark mode - invert colors for github theme. */
@media (prefers-color-scheme: dark) {
  .hljs {
    background: rgb(17 24 39) !important;
    color: #c9d1d9 !important;
  }

  .hljs-comment,
  .hljs-quote {
    color: #8b949e !important;
  }

  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-subst {
    color: #ff7b72 !important;
  }

  .hljs-number,
  .hljs-literal,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-tag .hljs-attr {
    color: #79c0ff !important;
  }

  .hljs-string,
  .hljs-doctag {
    color: #a5d6ff !important;
  }

  .hljs-title,
  .hljs-section,
  .hljs-selector-id {
    color: #d2a8ff !important;
  }

  .hljs-subst {
    color: #c9d1d9 !important;
  }

  .hljs-type,
  .hljs-class .hljs-title,
  .hljs-tag,
  .hljs-name,
  .hljs-attribute {
    color: #7ee787 !important;
  }

  .hljs-regexp,
  .hljs-link {
    color: #ffa657 !important;
  }

  .hljs-symbol,
  .hljs-bullet {
    color: #ffa198 !important;
  }

  .hljs-built_in,
  .hljs-builtin-name {
    color: #ffa657 !important;
  }

  .hljs-meta {
    color: #79c0ff !important;
  }

  .hljs-deletion {
    color: #ffa198 !important;
  }

  .hljs-addition {
    color: #7ee787 !important;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }
}
</style>
