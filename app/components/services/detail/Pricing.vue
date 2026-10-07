<script setup lang="ts">
import type { PropType } from 'vue'
import type { ServicePricing } from '~/types/Service'

// No figure is shown on purpose: every one of these builds is a different
// size, so a number here would be either fiction or useless.
defineProps({
  pricing: {
    type: Object as PropType<ServicePricing>,
    required: true,
  },
})
</script>

<template>
  <ServicesDetailSection
    center
    :heading="pricing.heading"
  >
    <div class="flex max-w-2xl flex-col items-center gap-5 text-center">
      <p
        class="text-pretty font-extralight leading-relaxed tracking-wide text-white/70"
      >
        {{ pricing.copy }}
      </p>

      <p
        v-if="pricing.note"
        class="flex items-center gap-2 text-sm text-white/80"
      >
        <UIcon
          name="i-heroicons-check"
          class="size-4 shrink-0 text-white/40"
          aria-hidden="true"
        />
        {{ pricing.note }}
      </p>

      <SpotlightButton v-if="pricing.cta">
        <NuxtLink
          class="white-gradient relative flex items-center justify-center gap-2 transition-all duration-200"
          :to="pricing.cta.to"
        >
          {{ pricing.cta.label }}
          <UIcon
            name="i-heroicons-arrow-right"
            class="size-5 text-white/80"
            aria-hidden="true"
          />
        </NuxtLink>
      </SpotlightButton>
    </div>
  </ServicesDetailSection>
</template>
