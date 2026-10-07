<script setup lang="ts">
import type { ServiceDetail } from '~/types/Service'

// One page template for every service in content/en/services/. The whole page
// is driven by that file's frontmatter, so adding the next service (auto
// repair, cleaning, HVAC) is a content change rather than a code change.
const route = useRoute()
const { locale } = useI18n()
const appConfig = useAppConfig()

const { data: page } = await useAsyncData(`${route.path}`, () =>
  queryContent<ServiceDetail>(route.path).locale(locale.value).findOne(),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

// Deliberately not useContentHead(): it sets the title from frontmatter
// `title`, which then races the `seoTitle` set below and leaves the tab
// showing a different title after a client-side navigation than after a hard
// load. Everything it would provide is set explicitly here instead.

// Same base URL app.vue uses for its canonical link, so og:url and the
// canonical tag can never disagree. app.vue already emits the canonical
// itself, so this page must not add a second one.
const canonical = computed(() => `https://bipu.dev${route.path}`)

// The service's name is what a client calls it; `seoTitle` is what they would
// type into Google. Suffix with the person, not "devbipu portfolio".
const documentTitle = computed(
  () => page.value?.seoTitle ?? page.value?.title ?? '',
)

useHead({
  titleTemplate: '%s - Biplob Shaha',
})

useSeoMeta({
  title: () => documentTitle.value,
  description: () => page.value?.description,
  author: 'Biplob Shaha',
  ogType: 'website',
  ogTitle: () => documentTitle.value,
  ogDescription: () => page.value?.description,
  ogUrl: () => canonical.value,
  ogImage: `https://bipu.dev${appConfig.openGraphImage}`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => documentTitle.value,
  twitterDescription: () => page.value?.description,
  twitterSite: appConfig.twitterUsername,
  twitterCreator: appConfig.twitterUsername,
  twitterImage: `https://bipu.dev${appConfig.openGraphImage}`,
})

defineOgImage({
  url: appConfig.openGraphImage,
  width: 1200,
  height: 630,
  alt: () => page.value?.title ?? 'Service',
})

// Service + FAQPage JSON-LD, hand-rolled for the same reason as the reviews
// page: the offer has to nest under the Person who provides it. No price is
// emitted because none is advertised.
const jsonLd = computed(() => {
  if (!page.value) return null

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Service',
      'name': page.value.title,
      'description': page.value.description,
      'serviceType': page.value.title,
      'url': canonical.value,
      'areaServed': {
        '@type': 'Country',
        'name': 'United States',
      },
      'audience': {
        '@type': 'BusinessAudience',
        'name': 'Small and mid-sized service businesses',
      },
      'provider': {
        '@type': 'Person',
        'name': 'Biplob Shaha',
        'url': 'https://bipu.dev',
        'jobTitle': 'Full-Stack Laravel & Vue.js Developer',
        'sameAs': Object.values(appConfig.socials),
      },
      ...(page.value.modules?.items?.length
        ? {
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              'name': page.value.modules.heading,
              'itemListElement': page.value.modules.items.map(item => ({
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': item.title,
                  'description': item.description,
                },
              })),
            },
          }
        : {}),
    },
  ]

  if (page.value.faq?.questions?.length) {
    graph.push({
      '@type': 'FAQPage',
      'mainEntity': page.value.faq.questions.map(question => ({
        '@type': 'Question',
        'name': question.title,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': question.answer,
        },
      })),
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
})

useHead({
  script: computed(() =>
    jsonLd.value
      ? [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(jsonLd.value),
          },
        ]
      : [],
  ),
})
</script>

<template>
  <div>
    <!-- The wrapping div is required: <Html> renders no DOM node of its own,
         so without it the page has no single root and Nuxt warns that route
         transitions will break. This comment has to live inside the div for
         the same reason - in dev, a top-level template comment is itself a
         root node. pages/[...slug].vue is structured the same way. Layouts
         are not auto-applied either: app.vue renders a bare <NuxtPage />, so
         every page opts into the navbar and footer itself. -->
    <Html
      :lang="$i18n.locale"
      class="bg-zinc-950 text-main font-geist transition-colors duration-300 selection:bg-white/60 selection:text-zinc-800"
    >
      <Body>
        <LayoutScrollToTop />
        <NuxtLayout>
          <article
            v-if="page"
            class="mx-auto flex max-w-4xl flex-col px-5 pt-4 sm:px-7 sm:pt-6"
          >
            <NuxtLink
              to="/services"
              class="flex w-fit cursor-pointer items-center gap-2 py-4 text-muted transition-colors duration-200 hover:text-main"
            >
              <UIcon
                name="lucide:arrow-left"
                class="size-4"
                aria-hidden="true"
              />
              <span class="text-sm font-extralight">
                {{ $t('navigation.services') }}
              </span>
            </NuxtLink>

            <ServicesDetailHero :hero="page.hero" />

            <div class="flex flex-col gap-16 py-10 sm:gap-20 sm:py-14">
              <ServicesDetailProblems
                v-if="page.problems"
                :problems="page.problems"
              />

              <ServicesDetailModules
                v-if="page.modules"
                :modules="page.modules"
              />

              <ServicesDetailIndustries
                v-if="page.industries"
                :industries="page.industries"
              />

              <ServicesDetailComparison
                v-if="page.comparison"
                :comparison="page.comparison"
              />

              <ServicesDetailProcess
                v-if="page.process"
                :process="page.process"
              />

              <ServicesDetailOwnership
                v-if="page.ownership"
                :ownership="page.ownership"
              />

              <ServicesDetailPricing
                v-if="page.pricing"
                :pricing="page.pricing"
              />

              <ServicesDetailSection
                v-if="page.faq?.questions?.length"
                :heading="page.faq.heading"
                :intro="page.faq.intro"
              >
                <FAQ :questions="page.faq.questions" />
              </ServicesDetailSection>

              <ServicesDetailClosing
                v-if="page.closing"
                :closing="page.closing"
              />
            </div>
          </article>
        </NuxtLayout>
        <DotPattern
          class="absolute inset-0 -z-10 size-full fill-white/5 [mask-image:radial-gradient(white,transparent_85%)]"
        />
      </Body>
    </Html>
  </div>
</template>
