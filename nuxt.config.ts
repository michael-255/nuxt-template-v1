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
    redirect: false, // TODO - May go back to true when ready for auth
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
  },
  quasar: {
    config: {
      dark: true,
      brand: {
        primary: '#1976d2', // Blue
        secondary: '#607d8b', // Blue Grey
        accent: '#673ab7', // Deep Purple
        info: '#0d47a1', // Dark Blue
        warning: '#ff6f00', // Amber
        negative: '#C10015', // Red
        positive: '#4caf50', // Green
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
    plugins: ['Dialog', 'Meta', 'Notify', 'Loading'],
  },
})
