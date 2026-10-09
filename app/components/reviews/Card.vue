<script setup lang="ts">
import type { PropType } from 'vue'
import type { Review } from '~/types/Review'

const props = defineProps({
  review: {
    type: Object as PropType<Review>,
    required: true,
  },
})

// Attribution stops at the shortened name Upwork already shows publicly - no
// company, country, avatar or date. The Upwork mark plus the verifiable
// profile link is still what carries the trust; the name only makes it
// easier to match a quote to the review it came from.
const client = computed(() => props.review.client?.trim() ?? '')
const project = computed(() => props.review.project?.trim() ?? '')
</script>

<template>
  <SpotlightCard
    white
    class="h-full"
  >
    <figure class="flex h-full flex-col gap-4 p-5">
      <!-- platform mark + rating: signals these are verified, not self-written -->
      <div class="flex items-center gap-2">
        <ReviewsStars :rating="review.rating" />
        <SvgoUpwork
          class="size-4 shrink-0 text-[#14a800]"
          :font-controlled="false"
          aria-label="Verified on Upwork"
        />
      </div>

      <!-- verbatim quote -->
      <blockquote
        class="grow font-extralight leading-relaxed tracking-wide text-white/75"
      >
        &ldquo;{{ review.quote }}&rdquo;
      </blockquote>

      <!-- who said it, then a generic description of the work - never the
           client's company or the project's real name -->
      <figcaption
        v-if="client || project"
        class="flex flex-col items-start gap-2 border-t border-white/10 pt-4"
      >
        <span
          v-if="client"
          class="text-sm font-medium text-main"
        >
          {{ client }}
        </span>

        <span
          v-if="project"
          class="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-muted"
        >
          {{ project }}
        </span>
      </figcaption>
    </figure>
  </SpotlightCard>
</template>
