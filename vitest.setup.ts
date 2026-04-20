import { vi } from 'vitest'

// jsdom does not provide ResizeObserver, but the vendored MathML polyfills
// instantiate it at module load time.
if (!globalThis.ResizeObserver) {
  class MockResizeObserver implements ResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }

  Object.defineProperty(globalThis, 'ResizeObserver', {
    writable: true,
    value: MockResizeObserver,
  })
}

// Check if cookieStore exists (to avoid overwriting if a polyfill is added later).
if (!globalThis.cookieStore) {
  Object.defineProperty(globalThis, 'cookieStore', {
    writable: true,
    value: {
      get: vi.fn().mockResolvedValue(null), // Default return null for get
      getAll: vi.fn().mockResolvedValue([]), // Default return empty array
      set: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    },
  })
}
