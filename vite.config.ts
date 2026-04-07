import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

/**
 * Vite plugin that serves the TypeScript service worker during development by
 * running it through Vite's own transform pipeline.  In production the SW is
 * compiled as a separate Rollup entry (see build.rollupOptions below).
 */
const prismServiceWorkerDevPlugin = (): Plugin => ({
  name: 'prism-service-worker-dev',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/pmrapp-frontend/prism.sw.js', async (_req, res) => {
      const result = await server.transformRequest('/src/workers/prism.sw.ts')
      if (result?.code) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        res.end(result.code)
      } else {
        res.statusCode = 404
        res.end('Not found')
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: '/pmrapp-frontend/',
  plugins: [vue(), vueDevTools(), tailwindcss(), prismServiceWorkerDevPlugin()],
  build: {
    rollupOptions: {
      input: {
        // Main application entry.
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        // Service worker compiled as a separate, unhashed ES-module bundle so
        // it can be registered at a predictable URL.
        'prism.sw': fileURLToPath(new URL('./src/workers/prism.sw.ts', import.meta.url)),
      },
      output: {
        // Keep the service worker filename stable (no content hash) so the
        // registration URL in the composable always resolves correctly.
        entryFileNames: (chunk) =>
          chunk.name === 'prism.sw' ? '[name].js' : 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
