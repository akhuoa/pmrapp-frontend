<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-markdown'
import 'prismjs/themes/prism.css'
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
/* Light mode - default Prism theme. */
@media (prefers-color-scheme: light) {
  pre[class*="language-"] {
    background: rgb(249 250 251) !important;
  }

  code[class*="language-"],
  pre[class*="language-"] {
    color: #24292e !important;
  }
}

/* Dark mode - GitHub dark theme colors. */
@media (prefers-color-scheme: dark) {
  pre[class*="language-"],
  code[class*="language-"] {
    background: rgb(17 24 39) !important;
    color: #c9d1d9 !important;
    text-shadow: none;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #8b949e !important;
  }

  .token.punctuation {
    color: #c9d1d9 !important;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #79c0ff !important;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #a5d6ff !important;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #ffa657 !important;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #ff7b72 !important;
  }

  .token.function,
  .token.class-name {
    color: #d2a8ff !important;
  }

  .token.regex,
  .token.important,
  .token.variable {
    color: #ffa198 !important;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }
}
</style>
