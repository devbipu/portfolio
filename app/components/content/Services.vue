<script setup lang="ts">
const { data: services } = await useServices()
const appConfig = useAppConfig()

const all = computed(() => services.value?.services ?? [])

// A lone service in a two-column grid sits lopsided against the left edge, so
// a single card gets a centred single column instead.
const single = computed(() => all.value.length === 1)

defineOgImage({
  url: appConfig.openGraphImage,
  width: 1200,
  height: 630,
  alt: 'Services',
})

// Hand-rolled JSON-LD, same reasoning as the reviews page: the offers have to
// nest under the Person who provides them, which the typed `definePerson`
// helper doesn't expose. This is for semantic clarity and AI/LLM search.
const jsonLd = computed(() => {
  if (!all.value.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'Biplob Shaha',
    'url': 'https://bipu.dev',
    'jobTitle': 'Full-Stack Laravel & Vue.js Developer',
    'sameAs': Object.values(appConfig.socials),
    'makesOffer': all.value.map(service => ({
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'name': service.title,
        'description': service.description,
        'serviceType': service.title,
        ...(service.stack?.length ? { keywords: service.stack.join(', ') } : {}),
      },
    })),
  }
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
  <section class="mx-auto mt-4 flex max-w-4xl flex-col p-7 sm:mt-20">
    <h1 class="font-newsreader italic text-white-shadow text-center text-4xl">
      <ContentSlot :use="$slots.title" />
    </h1>
    <h2 class="text-center text-lg font-extralight italic text-muted">
      <ContentSlot :use="$slots.subtitle" />
    </h2>
    <Divider class="mb-8 mt-2" />

    <div
      v-if="all.length"
      class="grid grid-cols-1 items-stretch gap-4"
      :class="single ? 'mx-auto w-full max-w-xl' : 'sm:grid-cols-2'"
    >
      <ServicesCard
        v-for="(service, index) in all"
        :key="index"
        :service="service"
      />
    </div>

    <p
      v-else
      class="text-center text-sm text-muted"
    >
      {{ $t('services.empty') }}
    </p>

    <Divider class="my-10" />

    <div class="flex flex-col items-center gap-4">
      <p class="text-center text-sm text-muted">
        {{ $t('services.cta_hint') }}
      </p>
      <SpotlightButton>
        <NuxtLink
          class="white-gradient relative flex items-center justify-center gap-2 transition-all duration-200"
          to="/contact"
        >
          {{ $t('services.discuss') }}
          <UIcon
            name="heroicons-envelope"
            class="size-5 text-white/80"
            aria-hidden="true"
          />
        </NuxtLink>
      </SpotlightButton>
    </div>
  </section>
</template>
