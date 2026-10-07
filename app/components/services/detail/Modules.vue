<script setup lang="ts">
import type { PropType } from 'vue'
import type { ServiceModules } from '~/types/Service'

defineProps({
  modules: {
    type: Object as PropType<ServiceModules>,
    required: true,
  },
})
</script>

<template>
  <ServicesDetailSection
    id="what-i-build"
    :heading="modules.heading"
    :intro="modules.intro"
  >
    <div class="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
      <SpotlightCard
        v-for="item in modules.items"
        :key="item.title"
        white
        class="h-full"
      >
        <article class="flex h-full flex-col gap-3 p-5">
          <div class="flex items-center gap-3">
            <div
              class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"
            >
              <UIcon
                :name="item.icon"
                class="size-[1.1rem] text-white/80"
                aria-hidden="true"
              />
            </div>
            <h3 class="text-base font-semibold text-main">
              {{ item.title }}
            </h3>
          </div>
          <p
            class="font-extralight leading-relaxed tracking-wide text-white/70"
          >
            {{ item.description }}
          </p>
        </article>
      </SpotlightCard>
    </div>

    <p
      v-if="modules.note"
      class="text-center font-newsreader text-lg italic text-white/80"
    >
      {{ modules.note }}
    </p>
  </ServicesDetailSection>
</template>
