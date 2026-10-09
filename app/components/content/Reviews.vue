<script setup lang="ts">
const { data: reviews } = await useReviews()
const appConfig = useAppConfig()

const all = computed(() => reviews.value?.reviews ?? [])
const stats = computed(() => reviews.value?.stats ?? {})
const letter = computed(() => reviews.value?.letter ?? null)

defineOgImage({
  url: appConfig.openGraphImage,
  width: 1200,
  height: 630,
  alt: 'Client reviews',
})

// Hand-rolled JSON-LD rather than the schema-org helpers: reviews need to nest
// under the reviewed Person, which the typed `definePerson` helper doesn't
// expose. Note Google does not show review rich results for self-serving
// reviews hosted on your own site - this is here for semantic clarity and
// AI/LLM search, not for SERP stars.
const jsonLd = computed(() => {
  if (!all.value.length && !letter.value) return null

  const rating = stats.value.rating

  // The letter is the only review here with a real author, so it is the only
  // one worth emitting as attributed structured data. Role, company and the
  // link to the signed PDF all go in; the signer's email deliberately does not.
  const letterReview = letter.value
    ? [
        {
          '@type': 'Review',
          'name': letter.value.excerpt,
          'reviewBody': letter.value.body.join('\n\n'),
          'datePublished': letter.value.date,
          ...(letter.value.pdf ? { url: `https://bipu.dev${letter.value.pdf}` } : {}),
          ...(letter.value.rating
            ? {
                reviewRating: {
                  '@type': 'Rating',
                  'ratingValue': letter.value.rating,
                  'bestRating': 5,
                },
              }
            : {}),
          'author': {
            '@type': 'Person',
            'name': letter.value.author,
            'jobTitle': letter.value.role,
            'worksFor': {
              '@type': 'Organization',
              'name': letter.value.company,
            },
          },
        },
      ]
    : []

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'Biplob Shaha',
    'url': 'https://bipu.dev',
    'jobTitle': 'Full-Stack Laravel & Vue.js Developer',
    'sameAs': Object.values(appConfig.socials),
    ...(rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            'ratingValue': rating,
            'bestRating': 5,
            'ratingCount': stats.value.ratingCount ?? stats.value.jobs ?? all.value.length,
            'reviewCount': all.value.length,
          },
        }
      : {}),
    // Below the letter, the author is only ever the shortened name Upwork
    // publishes, and falls back to a generic label when a review has none.
    // No date, company or project identifier is emitted here either way.
    'review': [
      ...letterReview,
      ...all.value.map(review => ({
        '@type': 'Review',
        'reviewBody': review.quote,
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': review.rating,
          'bestRating': 5,
        },
        'author': {
          '@type': 'Person',
          'name': review.client?.trim() || 'Upwork client',
        },
      })),
    ],
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

    <ReviewsStats
      :stats="stats"
      :profile-url="reviews?.profileUrl"
      class="mb-10"
    />

    <!-- attributed and signed, so it leads the page -->
    <ReviewsLetter
      v-if="letter"
      :letter="letter"
      class="mb-10"
    />

    <div
      v-if="all.length"
      class="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2"
    >
      <ReviewsCard
        v-for="(review, index) in all"
        :key="index"
        :review="review"
      />
    </div>

    <p
      v-else-if="!letter"
      class="text-center text-sm text-muted"
    >
      {{ $t('reviews.empty') }}
    </p>

    <Divider class="my-10" />

    <div class="flex flex-col items-center gap-4">
      <p class="text-center text-sm text-muted">
        {{ $t('reviews.cta_hint') }}
      </p>
      <SpotlightButton>
        <NuxtLink
          class="white-gradient relative flex items-center justify-center gap-2 transition-all duration-200"
          to="/contact"
        >
          {{ $t('global.contact') }}
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
