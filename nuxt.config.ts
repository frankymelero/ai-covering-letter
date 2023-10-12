// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    secret: process.env.TOKEN_CHATGPT,
    public: {
      token: process.env.TOKEN_CHATGPT
    }
  }
})
