<script setup lang="ts">
import type { PropType } from 'vue'
import type { ServiceIndustries } from '~/types/Service'

defineProps({
  industries: {
    type: Object as PropType<ServiceIndustries>,
    required: true,
  },
})
</script>

<template>
  <ServicesDetailSection
    :heading="industries.heading"
    :intro="industries.intro"
  >
    <div class="flex flex-col gap-4">
      <SpotlightCard
        v-for="item in industries.items"
        :key="item.title"
        white
      >
        <article class="flex flex-col gap-5 p-5 sm:p-6">
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

          <div
            v-if="item.workflow?.length"
            class="flex flex-col gap-2"
          >
            <p class="text-xs uppercase tracking-wider text-muted">
              {{ $t('services.example_workflow') }}
            </p>
            <ServicesDetailWorkflow :steps="item.workflow" />
          </div>

          <div
            v-if="item.features?.length"
            class="flex flex-col gap-2 border-t border-white/10 pt-4"
          >
            <p class="text-xs uppercase tracking-wider text-muted">
              {{ $t('services.possible_features') }}
            </p>
            <ul class="grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2">
              <li
                v-for="feature in item.features"
                :key="feature"
                class="flex items-start gap-2 text-sm font-extralight text-white/70"
              >
                <UIcon
                  name="i-heroicons-check"
                  class="mt-0.5 size-4 shrink-0 text-white/40"
                  aria-hidden="true"
                />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
        </article>
      </SpotlightCard>
    </div>

    <!-- other trades: named, but explicitly not sold as off-the-shelf -->
    <div
      v-if="industries.others?.length"
      class="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 px-5 py-5 backdrop-blur-sm sm:px-6"
    >
      <h3 class="text-sm font-semibold text-main">
        {{ $t('services.other_businesses') }}
      </h3>
      <ul class="flex flex-wrap gap-1.5">
        <li
          v-for="other in industries.others"
          :key="other"
          class="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-muted"
        >
          {{ other }}
        </li>
      </ul>
      <p
        v-if="industries.othersNote"
        class="text-pretty text-sm font-extralight leading-relaxed text-white/70"
      >
        {{ industries.othersNote }}
      </p>
    </div>
  </ServicesDetailSection>
</template>
