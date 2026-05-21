// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },

  modules: ['@nuxt/ui', '@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL ?? '',
    authSecret: process.env.AUTH_SECRET ?? '',
    resendApiKey: process.env.RESEND_API_KEY ?? '',
    public: {
      cmsName: process.env.CMS_NAME ?? 'Blog CMS',
      cmsOrigin: process.env.CMS_ORIGIN ?? 'http://localhost:3001',
      webOrigin: process.env.CMS_WEB_ORIGIN ?? 'http://localhost:3000',
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  nitro: {
    experimental: {
      asyncContext: true,
    },
  },
})
