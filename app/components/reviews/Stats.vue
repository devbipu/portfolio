<script setup lang="ts">
import type { PropType } from 'vue'
import type { ReviewStats } from '~/types/Review'

const props = defineProps({
  stats: {
    type: Object as PropType<ReviewStats>,
    required: true,
  },
  profileUrl: {
    type: String,
    default: '',
  },
})

const { t } = useI18n()

const items = computed(() => {
  const { rating, jobSuccess, jobs, hours } = props.stats

  return [
    rating ? { value: `${rating}/5`, label: t('reviews.rating') } : null,
    jobSuccess
      ? { value: `${jobSuccess}%`, label: t('reviews.job_success') }
      : null,
    jobs ? { value: `${jobs}`, label: t('reviews.jobs') } : null,
    hours
      ? { value: `${hours.toLocaleString('en-US')}+`, label: t('reviews.hours') }
      : null,
  ].filter(item => !!item)
})

const hasContent = computed(() => items.value.length > 0 || !!props.stats.badge)
</script>

<template>
  <div
    v-if="hasContent"
    class="flex w-full flex-col items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900/80 px-6 py-5 backdrop-blur-3xl"
  >
    <!-- badge -->
    <div
      v-if="stats.badge"
      class="flex items-center gap-2"
    >
      <SvgoUpwork
        class="size-5 text-[#14a800]"
        :font-controlled="false"
        aria-label="Upwork logo"
      />
      <span class="text-sm font-medium text-main">{{ stats.badge }}</span>
      <span class="text-sm text-muted">{{ $t('reviews.on_upwork') }}</span>
    </div>

    <!-- numbers -->
    <dl
      v-if="items.length"
      class="grid w-full grid-cols-2 gap-x-4 gap-y-5 sm:flex sm:items-start sm:justify-center sm:gap-0"
    >
      <div
        v-for="(item, index) in items"
        :key="item!.label"
        class="flex flex-col items-center gap-1 text-center sm:px-6"
        :class="{ 'sm:border-l sm:border-white/10': index > 0 }"
      >
        <dt class="sr-only">
          {{ item!.label }}
        </dt>
        <dd
          class="white-gradient-tb whitespace-nowrap text-xl font-semibold sm:text-2xl"
        >
          {{ item!.value }}
        </dd>
        <p class="whitespace-nowrap text-xs text-muted">
          {{ item!.label }}
        </p>
      </div>
    </dl>

    <!-- verifiable outbound link: this is what turns the numbers into proof -->
    <NuxtLink
      v-if="profileUrl"
      :to="profileUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="group flex items-center gap-1.5 text-sm text-muted transition-colors duration-300 hover:text-main"
      :aria-label="$t('reviews.view_profile')"
    >
      {{ $t('reviews.view_profile') }}
      <UIcon
        name="i-heroicons-arrow-up-right"
        class="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </NuxtLink>
  </div>
</template>
