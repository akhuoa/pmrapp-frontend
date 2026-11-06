<script setup lang="ts">
import { syntaxHighlighting } from '@codemirror/language'
import { highlightSelectionMatches, search, searchKeymap } from '@codemirror/search'
import { Compartment, EditorState, type Extension } from '@codemirror/state'
import { drawSelection, EditorView, keymap, lineNumbers } from '@codemirror/view'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { codeHighlighter, detectCodeLanguage, loadCodeLanguage } from '@/utils/codeLanguage'

const props = defineProps<{
  code: string;
  filename: string;
  startWrapped?: boolean;
}>();

const host = ref<HTMLElement | null>(null)
const detectedLanguage = computed(() => detectCodeLanguage(props.filename))

// CodeMirror only renders the lines in the viewport and parses the document incrementally,
// so large files can be highlighted without building a DOM node for every token.
let view: EditorView | null = null
const languageCompartment = new Compartment()
const wrapCompartment = new Compartment()
const attributesCompartment = new Compartment()

// Incremented on every language load so that stale asynchronous loads are ignored.
let languageRequestId = 0

const wrapExtension = (isWrapped: boolean): Extension => (isWrapped ? EditorView.lineWrapping : [])

const attributesExtension = (filename: string): Extension =>
  EditorView.contentAttributes.of({ 'aria-label': `Code view of ${filename || 'file'}` })

const applyLanguage = async () => {
  const requestId = ++languageRequestId
  const language = detectedLanguage.value

  // Show plain text straight away; highlighting is added once the language pack is loaded.
  view?.dispatch({ effects: languageCompartment.reconfigure([]) })

  if (!language) return

  try {
    const support = await loadCodeLanguage(language)
    if (view && requestId === languageRequestId) {
      view.dispatch({ effects: languageCompartment.reconfigure(support) })
    }
  } catch (err) {
    console.error('Error loading syntax highlighting:', err)
  }
};

onMounted(() => {
  if (!host.value) return

  view = new EditorView({
    parent: host.value,
    state: EditorState.create({
      doc: props.code,
      extensions: [
        EditorState.readOnly.of(true),
        lineNumbers(),
        drawSelection(),
        highlightSelectionMatches(),
        // The browser's find-in-page only sees the rendered lines, so use the built-in search.
        search({ top: true }),
        keymap.of(searchKeymap),
        syntaxHighlighting(codeHighlighter),
        languageCompartment.of([]),
        wrapCompartment.of(wrapExtension(Boolean(props.startWrapped))),
        attributesCompartment.of(attributesExtension(props.filename)),
      ],
    }),
  })

  void applyLanguage()
})

onBeforeUnmount(() => {
  // Invalidate any pending language load.
  languageRequestId++
  view?.destroy()
  view = null
})

watch(
  () => props.code,
  (code) => {
    if (!view || view.state.doc.toString() === code) return

    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: code },
      selection: { anchor: 0 },
    })
  },
)

watch(
  () => props.filename,
  (filename) => {
    view?.dispatch({ effects: attributesCompartment.reconfigure(attributesExtension(filename)) })
    void applyLanguage()
  },
);

watch(
  () => props.startWrapped,
  (isWrapped) => {
    view?.dispatch({ effects: wrapCompartment.reconfigure(wrapExtension(Boolean(isWrapped))) })
  },
);
</script>

<template>
  <div
    ref="host"
    class="code-block"
    :data-language="detectedLanguage ?? 'plaintext'"
  />
</template>

<style>
/* Editor layout. These styles are global because CodeMirror creates its DOM outside Vue. */
.code-block {
  --code-background: var(--color-gray-50, #f9fafb);
  --code-foreground: #1f2328;
  --code-gutter-foreground: #8c959f;
  --code-gutter-border: var(--color-gray-200, #e5e7eb);
  --code-selection: #b6d6fd;
  --code-search-match: #fde68a;

  --tok-comment: #6a737d;
  --tok-keyword: #0550ae;
  --tok-string: #0a7a2f;
  --tok-string2: #b45309;
  --tok-number: #953800;
  --tok-tag: #a1145a;
  --tok-attribute: #6639ba;
  --tok-type: #8a4b08;
  --tok-property: #0b6584;
  --tok-function: #a01b3e;
  --tok-operator: #8a5a28;
  --tok-punctuation: #6e7781;
  --tok-meta: #6e7781;
  --tok-heading: #0550ae;
  --tok-invalid: #cf222e;
}

@media (prefers-color-scheme: dark) {
  .code-block {
    --code-background: var(--color-gray-900, #111827);
    --code-foreground: #f8f8f2;
    --code-gutter-foreground: #6b7280;
    --code-gutter-border: var(--color-gray-700, #374151);
    --code-selection: #3e4451;
    --code-search-match: #6b5b16;

    --tok-comment: #8292a2;
    --tok-keyword: #66d9ef;
    --tok-string: #a6e22e;
    --tok-string2: #fd971f;
    --tok-number: #ae81ff;
    --tok-tag: #f92672;
    --tok-attribute: #a6e22e;
    --tok-type: #66d9ef;
    --tok-property: #fd971f;
    --tok-function: #e6db74;
    --tok-operator: #f8f8f2;
    --tok-punctuation: #c0c0bc;
    --tok-meta: #8292a2;
    --tok-heading: #66d9ef;
    --tok-invalid: #f92672;
  }
}

.code-block .cm-editor {
  background-color: var(--code-background);
  color: var(--code-foreground);
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.code-block .cm-editor.cm-focused {
  outline: 1px solid var(--code-gutter-border);
}

.code-block .cm-scroller {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}

.code-block .cm-content {
  padding: 1em 0;
  caret-color: var(--code-foreground);
}

.code-block .cm-line {
  padding: 0 1em 0 0.75em;
}

.code-block .cm-gutters {
  background-color: var(--code-background);
  color: var(--code-gutter-foreground);
  border-right: 1px solid var(--code-gutter-border);
}

.code-block .cm-lineNumbers .cm-gutterElement {
  padding: 0 0.75em 0 1em;
}

.code-block .cm-cursor {
  border-left-color: var(--code-foreground);
}

.code-block .cm-selectionBackground,
.code-block .cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground {
  background-color: var(--code-selection);
}

.code-block .cm-searchMatch,
.code-block .cm-selectionMatch {
  background-color: var(--code-search-match);
}

.code-block .cm-panels {
  background-color: var(--code-background);
  color: var(--code-foreground);
}

.code-block .cm-panels-top {
  border-bottom: 1px solid var(--code-gutter-border);
}

/* Syntax token colours (light theme based on GitHub, dark theme based on Okaidia). */
.code-block .tok-comment {
  color: var(--tok-comment);
  font-style: italic;
}

.code-block .tok-keyword {
  color: var(--tok-keyword);
}

.code-block .tok-string {
  color: var(--tok-string);
}

.code-block .tok-string2 {
  color: var(--tok-string2);
}

.code-block .tok-number {
  color: var(--tok-number);
}

.code-block .tok-tagName {
  color: var(--tok-tag);
}

.code-block .tok-attributeName {
  color: var(--tok-attribute);
}

.code-block .tok-typeName {
  color: var(--tok-type);
}

.code-block .tok-propertyName {
  color: var(--tok-property);
}

.code-block .tok-function,
.code-block .tok-definition {
  color: var(--tok-function);
}

.code-block .tok-operator {
  color: var(--tok-operator);
}

.code-block .tok-punctuation {
  color: var(--tok-punctuation);
}

.code-block .tok-meta {
  color: var(--tok-meta);
}

.code-block .tok-heading {
  color: var(--tok-heading);
  font-weight: bold;
}

.code-block .tok-emphasis {
  font-style: italic;
}

.code-block .tok-strong {
  font-weight: bold;
}

.code-block .tok-link {
  text-decoration: underline;
}

.code-block .tok-invalid {
  color: var(--tok-invalid);
}
</style>
