import { forceParsing, language, StreamLanguage, syntaxTreeAvailable } from '@codemirror/language';
import type { Extension } from '@codemirror/state';
import { type EditorView, ViewPlugin } from '@codemirror/view';
import {
  EXTENSION_LANGUAGE_MAP,
  VIEWPORT_PARSE_PAUSE_MS,
  VIEWPORT_PARSE_SLICE_MS,
} from '@/constants/codeLanguage';
import type { CodeLanguageId } from '@/types/codeLanguage';
import { tagHighlighter, tags } from '@lezer/highlight';

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
]);

/**
 * Detect the code viewer language from a filename.
 * @param filename - The filename, optionally including a path.
 * @returns The detected language, or null when the file should be shown as plain text.
 */
export const detectCodeLanguage = (filename: string): CodeLanguageId | null => {
  const basename = filename.split('/').pop() ?? '';
  const dotIndex = basename.lastIndexOf('.');

  if (dotIndex < 0) return null;

  const extension = basename.slice(dotIndex + 1).toLowerCase();
  return EXTENSION_LANGUAGE_MAP[extension] ?? null;
};

/**
 * Load the CodeMirror language support for a language.
 * Each language pack is imported dynamically so that it is only downloaded when needed.
 * @param id - The language to load.
 * @returns The CodeMirror extension providing the language support.
 */
export const loadCodeLanguage = async (id: CodeLanguageId): Promise<Extension> => {
  switch (id) {
    case 'cpp':
      return (await import('@codemirror/lang-cpp')).cpp();
    case 'css':
      return (await import('@codemirror/lang-css')).css();
    case 'fortran':
      return StreamLanguage.define((await import('@codemirror/legacy-modes/mode/fortran')).fortran);
    case 'html':
      return (await import('@codemirror/lang-html')).html();
    case 'javascript':
      return (await import('@codemirror/lang-javascript')).javascript({
        jsx: true,
        typescript: true,
      });
    case 'json':
      return (await import('@codemirror/lang-json')).json();
    case 'markdown':
      return (await import('@codemirror/lang-markdown')).markdown();
    case 'matlab':
      return StreamLanguage.define((await import('@codemirror/legacy-modes/mode/octave')).octave);
    case 'python':
      return (await import('@codemirror/lang-python')).python();
    case 'xml':
      return (await import('@codemirror/lang-xml')).xml();
  }
};

/**
 * Keep parsing until the visible lines can be highlighted, even when the editor is not focused.
 * CodeMirror's background parser stops after about 3 seconds of work and only resumes while the
 * editor has focus. A read-only viewer is usually scrolled without being focused, so on a slower
 * machine the end of a large file would otherwise never be highlighted. The work is done in short
 * slices, so the page does not freeze.
 */
export const viewportParsing = ViewPlugin.fromClass(
  class {
    private timer: ReturnType<typeof setTimeout> | null = null;

    constructor(private readonly view: EditorView) {
      this.schedule();
    }

    update() {
      this.schedule();
    }

    destroy() {
      if (this.timer !== null) clearTimeout(this.timer);
      this.timer = null;
    }

    private schedule() {
      if (this.timer === null) {
        this.timer = setTimeout(() => this.parse(), VIEWPORT_PARSE_PAUSE_MS);
      }
    }

    private parse() {
      this.timer = null;
      const { state, viewport } = this.view;

      // Nothing to do without a language, or when the visible lines are already parsed.
      if (!state.facet(language) || syntaxTreeAvailable(state, viewport.to)) return;
      if (!forceParsing(this.view, viewport.to, VIEWPORT_PARSE_SLICE_MS)) this.schedule();
    }
  },
);
