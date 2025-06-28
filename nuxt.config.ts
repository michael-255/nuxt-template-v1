// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  ssr: false,
  nitro: { preset: "static" },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@nuxtjs/supabase",
  ],
  app: { baseURL: "/nuxt-template-v1/" },
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
});
