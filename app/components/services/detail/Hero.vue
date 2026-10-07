<script setup lang="ts">
import type { PropType } from 'vue'
import type { ServiceHero } from '~/types/Service'

defineProps({
  hero: {
    type: Object as PropType<ServiceHero>,
    required: true,
  },
})
</script>

<template>
  <section class="relative">
    <!-- same grid + spotlight treatment as the homepage hero -->
    <div
      class="pointer-events-none absolute inset-0 bg-center bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]"
    />
    <div
      class="pointer-events-none absolute -top-8 left-1/2 size-72 -translate-x-1/2 rounded-full bg-white/20 blur-[120px] lg:size-[28rem] lg:blur-[180px]"
    />

    <div
      class="relative z-10 flex flex-col items-center gap-6 py-10 text-center sm:py-16"
    >
      <h1
        class="mx-auto max-w-3xl text-balance bg-gradient-to-b from-white/90 to-white/30 bg-clip-text text-3xl leading-tight text-transparent sm:text-4xl lg:text-5xl"
      >
        {{ hero.headline }}
      </h1>

      <p
        class="mx-auto max-w-2xl text-pretty text-md font-extralight leading-relaxed tracking-wide text-white/70 sm:text-lg"
      >
        {{ hero.subline }}
      </p>

      <div
        v-if="hero.primaryCta || hero.secondaryCta"
        class="flex flex-col items-center gap-3 sm:flex-row sm:gap-2"
      >
        <SpotlightButton v-if="hero.primaryCta">
          <NuxtLink
            class="white-gradient relative flex items-center justify-center gap-2 transition-all duration-200"
            :to="hero.primaryCta.to"
          >
            {{ hero.primaryCta.label }}
            <UIcon
              name="heroicons-envelope"
              class="size-5 text-white/80"
              aria-hidden="true"
            />
          </NuxtLink>
        </SpotlightButton>

        <NuxtLink
          v-if="hero.secondaryCta"
          :to="hero.secondaryCta.to"
          class="group flex items-center gap-1.5 rounded-md border border-white/10 px-6 py-2 text-sm text-muted transition-colors duration-300 hover:border-white/20 hover:text-main"
        >
          {{ hero.secondaryCta.label }}
          <UIcon
            name="i-heroicons-arrow-down"
            class="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>

      <!-- value row, kept as plain text rather than badges so it reads as fact -->
      <ul
        v-if="hero.highlights?.length"
        class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
      >
        <li
          v-for="highlight in hero.highlights"
          :key="highlight"
          class="flex items-center gap-1.5 text-xs text-muted sm:text-sm"
        >
          <UIcon
            name="i-heroicons-check"
            class="size-3.5 shrink-0 text-white/40"
            aria-hidden="true"
          />
          {{ highlight }}
        </li>
      </ul>
    </div>
  </section>
</template>
