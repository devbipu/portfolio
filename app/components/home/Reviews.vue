<script setup lang="ts">
const { data: reviews } = await useReviews()

// Lead with the strongest few. The rest live on /reviews so the homepage
// never looks padded.
const featured = computed(
  () => reviews.value?.reviews?.filter(review => review.featured) ?? [],
)

const total = computed(() => reviews.value?.reviews?.length ?? 0)

// A named, signed letter outranks any anonymous quote, so it leads.
const letter = computed(() => reviews.value?.letter ?? null)
</script>

<template>
  <div
    v-if="featured.length || letter"
    class="flex w-full flex-col items-center justify-center gap-8"
  >
    <div class="flex flex-col items-center justify-center gap-2">
      <h3 class="font-newsreader italic text-white-shadow text-3xl sm:text-4xl">
        {{ reviews!.title }}
      </h3>
      <p class="text-center text-sm font-medium text-muted">
        {{ reviews!.subtitle }}
      </p>
    </div>

    <ReviewsLetter
      v-if="letter"
      :letter="letter"
      compact
      class="w-full"
    />

    <div
      v-if="featured.length"
      class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <ReviewsCard
        v-for="(review, index) in featured"
        :key="index"
        :review="review"
      />
    </div>

    <NuxtLink
      v-if="total > featured.length"
      to="/reviews"
      class="font-newsreader italic text-white-shadow text-sm transition-opacity duration-300 hover:opacity-70"
    >
      {{ $t('reviews.see_all', { count: total }) }}
    </NuxtLink>
  </div>
</template>
