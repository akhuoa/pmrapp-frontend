// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  devtools: { enabled: true },

  ssr: true,

  experimental: {
    componentIslands: true,
  },

  modules: ['@pinia/nuxt', '@nuxt/devtools', '@nuxt/image'],

  css: ['~/src/assets/main.css'],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.VITE_API_BASE_URL || '',
      githubAuthApi: process.env.VITE_GITHUB_AUTH_API || '',
      gaMeasurementId: process.env.VITE_GA_MEASUREMENT_ID || '',
      basePath: process.env.VITE_BASE_PATH || '/',
    },
  },

  app: {
    head: {
      title: 'Physiome Model Repository',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'The Physiome Model Repository provides a resource for the community to store, retrieve, search, reference, and reuse CellML models.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  nitro: {
    prerender: {
      routes: ['/'],
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
})
