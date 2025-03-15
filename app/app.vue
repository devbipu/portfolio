<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const appConfig = useAppConfig()
const { locale } = useI18n()

const route = useRoute()
const baseUrl = 'https://bipu.dev'
const canonicalUrl = `${baseUrl}${route.path}`

console.log(route);


useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },

    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
    { rel: 'canonical', href: canonicalUrl }
  ],
})

useSeoMeta({
  author: 'Biplob Shaha',
  ogType: 'website',
  ogTitle: appConfig.appName,
  ogSiteName: 'devbipu portfolio',
  ogImage: appConfig.openGraphImage,
  ogUrl: () => runtimeConfig.public.siteUrl,
  ogLocale: () => locale.value,
  twitterTitle: appConfig.appName,
  twitterCard: 'summary_large_image',
  twitterSite: appConfig.twitterUsername,
  twitterCreator: appConfig.twitterUsername,
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style scoped></style>
