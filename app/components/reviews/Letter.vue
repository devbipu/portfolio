<script setup lang="ts">
import type { PropType } from 'vue'
import type { ReviewLetter } from '~/types/Review'

const props = defineProps({
  letter: {
    type: Object as PropType<ReviewLetter>,
    required: true,
  },
  // Homepage shows the excerpt and links through; /reviews shows the whole
  // letter. Same attribution block either way, so it stays one component.
  compact: {
    type: Boolean,
    default: false,
  },
})

const { locale } = useI18n()

// Format from the date parts rather than letting Date parse the ISO string
// into UTC midnight - west of Greenwich that renders as the previous day.
const formattedDate = computed(() => {
  const [year, month, day] = props.letter.date.split('-').map(Number)
  if (!year || !month || !day) return props.letter.date

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
})

const byline = computed(
  () => `${props.letter.role}, ${props.letter.company}`,
)
</script>

<template>
  <SpotlightCard
    white
    class="h-full"
  >
    <figure
      class="flex h-full flex-col gap-5 p-6 sm:p-8"
      :aria-label="
        $t('reviews.letter_aria', {
          author: letter.author,
          role: letter.role,
          company: letter.company,
        })
      "
    >
      <!-- header: says plainly what this is, so it is never mistaken for one
           of the Upwork quotes below it -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-heroicons-document-text"
            class="size-4 shrink-0 text-white/50"
            aria-hidden="true"
          />
          <span
            class="text-xs font-medium uppercase tracking-widest text-white/50"
          >
            {{ $t('reviews.letter_title') }}
          </span>
        </div>

        <ReviewsStars
          v-if="letter.rating"
          :rating="letter.rating"
        />
        <time
          v-else
          :datetime="letter.date"
          class="text-xs text-muted"
        >
          {{ formattedDate }}
        </time>
      </div>

      <!-- the letter itself: serif to read as correspondence rather than as a
           review card -->
      <blockquote
        class="grow font-newsreader text-[15px] leading-relaxed text-white/80 sm:text-base"
      >
        <template v-if="compact">
          &ldquo;{{ letter.excerpt }}&rdquo;
        </template>

        <template v-else>
          <p
            v-if="letter.salutation"
            class="mb-4 text-white/60"
          >
            {{ letter.salutation }}
          </p>
          <p
            v-for="(paragraph, index) in letter.body"
            :key="index"
            :class="{ 'mt-4': index > 0 }"
          >
            {{ paragraph }}
          </p>
        </template>
      </blockquote>

      <!-- attribution: the whole point of the letter, and the one place on the
           site a client is named -->
      <figcaption class="border-t border-white/10 pt-5">
        <NuxtImg
          v-if="letter.signature"
          :src="letter.signature"
          alt=""
          aria-hidden="true"
          width="300"
          height="81"
          loading="lazy"
          class="mb-3 h-9 w-auto opacity-70 sm:h-11"
        />

        <p class="text-sm font-medium text-main">
          {{ letter.author }}
        </p>
        <p class="text-sm text-muted">
          {{ byline }}
        </p>

        <time
          v-if="letter.rating && !compact"
          :datetime="letter.date"
          class="mt-1 block text-xs text-muted/70"
        >
          {{ formattedDate }}
        </time>
      </figcaption>

      <!-- compact: send them to the full text. full: let them check it against
           the signed original, which is what makes the transcription credible -->
      <div
        v-if="compact"
        class="mt-auto"
      >
        <NuxtLink
          to="/reviews"
          class="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-300 hover:text-main"
        >
          {{ $t('reviews.letter_read_full') }}
          <UIcon
            name="i-heroicons-arrow-right"
            class="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>

      <div
        v-else-if="letter.pdf || letter.projectUrl"
        class="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2"
      >
        <a
          v-if="letter.pdf"
          :href="letter.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-300 hover:text-main"
        >
          {{ $t('reviews.letter_view_pdf') }}
          <UIcon
            name="i-heroicons-arrow-up-right"
            class="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>

        <NuxtLink
          v-if="letter.projectUrl"
          :to="letter.projectUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-300 hover:text-main"
        >
          {{ $t('reviews.letter_view_project') }}
          <UIcon
            name="i-heroicons-arrow-up-right"
            class="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </figure>
  </SpotlightCard>
</template>
