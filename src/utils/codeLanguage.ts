import { StreamLanguage } from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import { tagHighlighter, tags } from '@lezer/highlight'

/**
 * Highlighter that assigns stable `tok-*` CSS classes to syntax tokens.
 * Unlike the default `classHighlighter`, it gives XML tag and attribute names their own classes,
 * which matters for CellML, SED-ML and RDF files. Colours are defined in CodeBlock.vue.
 */
export const codeHighlighter = tagHighlighter([
  { tag: tags.comment, class: 'tok-comment' },
  { tag: [tags.keyword, tags.modifier, tags.operatorKeyword], class: 'tok-keyword' },
  { tag: [tags.string, tags.attributeValue], class: 'tok-string' },
  { tag: [tags.regexp, tags.escape, tags.special(tags.string)], class: 'tok-string2' },
  { tag: [tags.number, tags.bool, tags.atom, tags.null], class: 'tok-number' },
  { tag: tags.tagName, class: 'tok-tagName' },
  { tag: tags.attributeName, class: 'tok-attributeName' },
  { tag: [tags.typeName, tags.className, tags.namespace], class: 'tok-typeName' },
  { tag: tags.propertyName, class: 'tok-propertyName' },
  {
    tag: [tags.function(tags.variableName), tags.function(tags.propertyName)],
    class: 'tok-function',
  },
  { tag: tags.definition(tags.variableName), class: 'tok-definition' },
  { tag: tags.operator, class: 'tok-operator' },
  { tag: [tags.punctuation, tags.bracket], class: 'tok-punctuation' },
  {
    tag: [tags.meta, tags.processingInstruction, tags.documentMeta, tags.macroName],
    class: 'tok-meta',
  },
  { tag: tags.heading, class: 'tok-heading' },
  { tag: tags.emphasis, class: 'tok-emphasis' },
  { tag: tags.strong, class: 'tok-strong' },
  { tag: [tags.link, tags.url], class: 'tok-link' },
  { tag: tags.invalid, class: 'tok-invalid' },
])

/**
 * Languages supported by the code viewer for syntax highlighting.
 */
export type CodeLanguageId =
  | 'cpp'
  | 'css'
  | 'fortran'
  | 'html'
  | 'javascript'
  | 'json'
  | 'markdown'
  | 'matlab'
  | 'python'
  | 'xml'

/**
 * Map of file extensions to code viewer languages.
 */
const EXTENSION_LANGUAGE_MAP: Record<string, CodeLanguageId> = {
  c: 'cpp',
  cellml: 'xml',
  conf: 'json',
  cpp: 'cpp',
  css: 'css',
  f77: 'fortran',
  fortran: 'fortran',
  h: 'cpp',
  htm: 'html',
  html: 'html',
  js: 'javascript',
  json: 'json',
  jsx: 'javascript',
  m: 'matlab',
  markdown: 'markdown',
  matlab: 'matlab',
  md: 'markdown',
  neon: 'json',
  py: 'python',
  python: 'python',
  rdf: 'xml',
  sass: 'css',
  scss: 'css',
  sedml: 'xml',
  svg: 'xml',
  ts: 'javascript',
  tsx: 'javascript',
  xml: 'xml',
  xul: 'xml',
}

/**
 * Detect the code viewer language from a filename.
 * @param filename - The filename, optionally including a path.
 * @returns The detected language, or null when the file should be shown as plain text.
 */
export const detectCodeLanguage = (filename: string): CodeLanguageId | null => {
  const basename = filename.split('/').pop() ?? ''
  const dotIndex = basename.lastIndexOf('.')

  if (dotIndex < 0) return null

  const extension = basename.slice(dotIndex + 1).toLowerCase()
  return EXTENSION_LANGUAGE_MAP[extension] ?? null
}

/**
 * Load the CodeMirror language support for a language.
 * Each language pack is imported dynamically so that it is only downloaded when needed.
 * @param id - The language to load.
 * @returns The CodeMirror extension providing the language support.
 */
export const loadCodeLanguage = async (id: CodeLanguageId): Promise<Extension> => {
  switch (id) {
    case 'cpp':
      return (await import('@codemirror/lang-cpp')).cpp()
    case 'css':
      return (await import('@codemirror/lang-css')).css()
    case 'fortran':
      return StreamLanguage.define((await import('@codemirror/legacy-modes/mode/fortran')).fortran)
    case 'html':
      return (await import('@codemirror/lang-html')).html()
    case 'javascript':
      return (await import('@codemirror/lang-javascript')).javascript({
        jsx: true,
        typescript: true,
      })
    case 'json':
      return (await import('@codemirror/lang-json')).json()
    case 'markdown':
      return (await import('@codemirror/lang-markdown')).markdown()
    case 'matlab':
      return StreamLanguage.define((await import('@codemirror/legacy-modes/mode/octave')).octave)
    case 'python':
      return (await import('@codemirror/lang-python')).python()
    case 'xml':
      return (await import('@codemirror/lang-xml')).xml()
  }
}
