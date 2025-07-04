import { closeIcon } from './shared/constants'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  nitro: { preset: 'static' },
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    'nuxt-quasar-ui',
  ],
  css: ['~/assets/css/main.css'],
  app: { baseURL: '/nuxt-template-v1/' },
  runtimeConfig: {
    public: {
      url: process.env.NUXT_PUBLIC_SUPABASE_URL,
      key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    },
  },
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
  },
  quasar: {
    config: {
      dark: true,
      brand: {
        primary: '#1976d2',
        secondary: '#607d8b',
        accent: '#673ab7',
        info: '#0d47a1',
        warning: '#ff6f00',
        negative: '#C10015',
        positive: '#4caf50',
        dark: '#1d1d1d',
        'dark-page': '#121212',
      },
      notify: {
        textColor: 'white',
        position: 'bottom',
        multiLine: false,
        iconSize: '2rem',
        progress: true,
        timeout: 5000,
        actions: [
          {
            icon: closeIcon,
            round: true,
            color: 'white',
          },
        ],
      },
    },
    plugins: ['Dialog', 'Meta', 'Notify'],
  },
})
