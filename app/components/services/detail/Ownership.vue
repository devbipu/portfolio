<script setup lang="ts">
import type { PropType } from 'vue'
import type { ServiceOwnership } from '~/types/Service'

defineProps({
  ownership: {
    type: Object as PropType<ServiceOwnership>,
    required: true,
  },
})
</script>

<template>
  <SpotlightCard white>
    <section class="flex flex-col gap-5 p-6 sm:p-8">
      <div class="flex flex-col gap-3">
        <h2
          class="flex items-center gap-2.5 font-newsreader text-2xl italic text-main sm:text-3xl"
        >
          <UIcon
            name="lucide:key"
            class="size-6 shrink-0 text-white/50"
            aria-hidden="true"
          />
          {{ ownership.heading }}
        </h2>
        <p
          class="max-w-2xl text-pretty leading-relaxed tracking-wide text-white/80"
        >
          {{ ownership.copy }}
        </p>
      </div>

      <ul class="flex flex-col gap-2">
        <li
          v-for="point in ownership.points"
          :key="point"
          class="flex items-start gap-2.5 text-sm font-extralight leading-relaxed text-white/70"
        >
          <UIcon
            name="i-heroicons-check"
            class="mt-0.5 size-4 shrink-0 text-white/40"
            aria-hidden="true"
          />
          <span>{{ point }}</span>
        </li>
      </ul>

      <!-- the honest cost note: hosting is never actually free, and saying so
           here is what makes the "no subscription" claim above credible -->
      <p
        v-if="ownership.note"
        class="text-pretty border-t border-white/10 pt-4 text-sm font-extralight leading-relaxed text-white/60"
      >
        {{ ownership.note }}
      </p>
    </section>
  </SpotlightCard>
</template>
