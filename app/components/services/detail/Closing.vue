<script setup lang="ts">
import type { PropType } from 'vue'
import type { ServiceClosing } from '~/types/Service'

defineProps({
  closing: {
    type: Object as PropType<ServiceClosing>,
    required: true,
  },
})

// The second CTA is a different channel rather than a second link to the same
// form - and it reads the number from app config so it is never duplicated in
// content files.
const { whatsapp } = useAppConfig()
</script>

<template>
  <section class="relative overflow-hidden rounded-2xl border border-white/10">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_140px_at_50%_0%,theme(backgroundColor.white/8%),transparent)]"
    />

    <div
      class="relative flex flex-col items-center gap-5 px-6 py-10 text-center sm:px-10 sm:py-12"
    >
      <h2
        class="max-w-2xl text-balance font-newsreader text-2xl italic text-white-shadow sm:text-3xl"
      >
        {{ closing.heading }}
      </h2>
      <p
        class="max-w-2xl text-pretty font-extralight leading-relaxed tracking-wide text-white/70"
      >
        {{ closing.copy }}
      </p>

      <div class="flex flex-col items-center gap-3 sm:flex-row sm:gap-2">
        <SpotlightButton v-if="closing.primaryCta">
          <NuxtLink
            class="white-gradient relative flex items-center justify-center gap-2 transition-all duration-200"
            :to="closing.primaryCta.to"
          >
            {{ closing.primaryCta.label }}
            <UIcon
              name="heroicons-envelope"
              class="size-5 text-white/80"
              aria-hidden="true"
            />
          </NuxtLink>
        </SpotlightButton>

        <NuxtLink
          v-if="whatsapp"
          :to="whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 rounded-md border border-white/10 px-6 py-2 text-sm text-muted transition-colors duration-300 hover:border-white/20 hover:text-main"
        >
          <SvgoWhatsapp
            class="size-4 shrink-0"
            :font-controlled="false"
            aria-hidden="true"
          />
          {{ $t('services.message_whatsapp') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
