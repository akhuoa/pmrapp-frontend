import type { CodeLanguageId } from '@/types/codeLanguage';

/**
 * Map of file extensions to code viewer languages.
 */
export const EXTENSION_LANGUAGE_MAP: Record<string, CodeLanguageId> = {
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
};

/** Longest time, in milliseconds, spent parsing in one go before giving the browser a turn. */
export const VIEWPORT_PARSE_SLICE_MS = 50;

/** Pause, in milliseconds, between parse slices so that scrolling and input stay responsive. */
export const VIEWPORT_PARSE_PAUSE_MS = 50;
