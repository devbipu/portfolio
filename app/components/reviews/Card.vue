<script setup lang="ts">
import type { PropType } from 'vue'
import type { Review } from '~/types/Review'

const props = defineProps({
  review: {
    type: Object as PropType<Review>,
    required: true,
  },
})

// No attribution block by design: reviews are published unattributed, so there
// is no client name, company, country, avatar or date to render. The Upwork
// mark plus the verifiable profile link carries the trust instead.
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

      <!-- generic description of the work, never the client's project name -->
      <figcaption
        v-if="project"
        class="border-t border-white/10 pt-4"
      >
        <span
          class="inline-block rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-muted"
        >
          {{ project }}
        </span>
      </figcaption>
    </figure>
  </SpotlightCard>
</template>
