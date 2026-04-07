/**
 * Prism Service Worker
 *
 * Runs syntax highlighting off the browser's main thread so that tokenising
 * large source files (e.g. complex CellML models) never freezes the UI.
 *
 * Communication protocol (postMessage):
 *   Page → SW :  { id: string, code: string, language: string }
 *   SW   → Page: { id: string, html: string }
 *
 * The `id` field lets the page match each response to the originating request
 * and discard stale results when the displayed file changes rapidly.
 */

/// <reference lib="webworker" />

import Prism from 'prismjs'
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

export type HighlightMessage = {
  id: string
  code: string
  language: string
}

export type HighlightResult = {
  id: string
  html: string
}

// Cast to ServiceWorkerGlobalScope so TypeScript accepts the SW-specific event
// types ('activate', ExtendableMessageEvent, etc.).  The DOM tsconfig resolves
// `self` as Window; the explicit cast corrects that for this file.
const swScope = self as unknown as ServiceWorkerGlobalScope

swScope.addEventListener('message', (event: ExtendableMessageEvent) => {
  const { id, code, language } = event.data as HighlightMessage

  let html = ''
  try {
    const grammar = Prism.languages[language]
    if (grammar) {
      html = Prism.highlight(code, grammar, language)
    }
  } catch {
    // Swallow Prism errors; the caller will fall back to main-thread highlighting.
  }

  // Reply to the specific client that sent the message.
  const source = event.source as Client | null
  source?.postMessage({ id, html } satisfies HighlightResult)
})

// Claim all open clients immediately so the service worker is active for the
// current page without requiring a reload.
swScope.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(swScope.clients.claim())
})
