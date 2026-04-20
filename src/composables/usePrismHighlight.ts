import Prism from 'prismjs'

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')

/**
 * URL of the compiled service worker script.
 *
 * During development Vite serves the script through a custom middleware
 * (see vite.config.ts).  In production it is built by Rollup as an
 * unhashed file at the root of the dist folder.
 */
const SW_URL = `${import.meta.env.BASE_URL}prism.sw.js`

// Module-level singleton – register the service worker at most once per
// page lifetime regardless of how many CodeBlock components mount.
let swPromise: Promise<ServiceWorker | null> | null = null

/**
 * Returns a resolved ServiceWorker that is ready to receive messages, or
 * `null` when service workers are not supported or registration fails.
 */
function getServiceWorker(): Promise<ServiceWorker | null> {
  if (!('serviceWorker' in navigator)) return Promise.resolve(null)

  if (!swPromise) {
    swPromise = navigator.serviceWorker
      .register(SW_URL, {
        scope: import.meta.env.BASE_URL,
        // Registered as an ES-module worker (matches the Rollup ESM output).
        type: 'module',
      })
      .then(
        (reg) =>
          new Promise<ServiceWorker | null>((resolve) => {
            const sw = reg.installing ?? reg.waiting ?? reg.active
            if (!sw) {
              resolve(null)
              return
            }
            if (sw.state === 'activated') {
              resolve(sw)
              return
            }
            const onStateChange = () => {
              if (sw.state === 'activated') {
                sw.removeEventListener('statechange', onStateChange)
                resolve(sw)
              } else if (sw.state === 'redundant') {
                sw.removeEventListener('statechange', onStateChange)
                resolve(null)
              }
            }
            sw.addEventListener('statechange', onStateChange)
          }),
      )
      .catch(() => null)
  }

  return swPromise
}

/** Synchronous main-thread fallback using `Prism.highlight()`. */
function mainThreadHighlight(code: string, language: string): string {
  const grammar = Prism.languages[language]
  return grammar ? Prism.highlight(code, grammar, language) : escapeHtml(code)
}

/**
 * Composable that exposes a single `highlight()` helper.
 *
 * – When the Prism service worker is available, highlighting runs in the SW
 *   thread so the browser main thread is never blocked.
 * – When the service worker is unavailable (unsupported browser, registration
 *   failure, non-secure context), the call falls back transparently to running
 *   `Prism.highlight()` on the main thread.
 */
export function usePrismHighlight() {
  /**
   * Return the Prism-tokenised HTML for `code` in the given `language`.
   * Always resolves (never rejects); returns an empty string on failure.
   */
  const highlight = async (code: string, language: string): Promise<string> => {
    const sw = await getServiceWorker()

    if (!sw) {
      return mainThreadHighlight(code, language)
    }

    return new Promise<string>((resolve) => {
      // crypto.randomUUID() is guaranteed unique (no collision risk).
      const id = crypto.randomUUID()

      // Timeout guards against a silent Service Worker failure that would
      // otherwise leave the listener registered indefinitely.
      const timeoutId = setTimeout(() => {
        navigator.serviceWorker.removeEventListener('message', handler)
        resolve(mainThreadHighlight(code, language))
      }, 30_000)

      const handler = (event: MessageEvent<{ id: string; html: string }>) => {
        if (event.data?.id !== id) return
        clearTimeout(timeoutId)
        navigator.serviceWorker.removeEventListener('message', handler)
        // If the SW returned empty string (unknown language / error), fall back.
        resolve(event.data.html || mainThreadHighlight(code, language))
      }

      navigator.serviceWorker.addEventListener('message', handler)
      sw.postMessage({ id, code, language })
    })
  }

  return { highlight }
}
