<script setup lang="ts">
import type { PropType } from 'vue'
import type { ServiceProcess } from '~/types/Service'

defineProps({
  process: {
    type: Object as PropType<ServiceProcess>,
    required: true,
  },
})
</script>

<template>
  <ServicesDetailSection
    :heading="process.heading"
    :intro="process.intro"
  >
    <ol class="flex flex-col">
      <li
        v-for="(step, index) in process.steps"
        :key="step.title"
        class="flex gap-4"
      >
        <!-- numbered rail: the connector stops on the final step -->
        <div class="flex flex-col items-center">
          <span
            class="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-medium text-white/80"
            aria-hidden="true"
          >
            {{ index + 1 }}
          </span>
          <span
            v-if="index < process.steps.length - 1"
            class="w-px grow bg-gradient-to-b from-white/15 to-white/5"
            aria-hidden="true"
          />
        </div>

        <div
          class="flex flex-col gap-1"
          :class="index < process.steps.length - 1 ? 'pb-7' : ''"
        >
          <h3 class="mt-1 text-sm font-semibold text-main">
            {{ step.title }}
          </h3>
          <p
            class="text-pretty text-sm font-extralight leading-relaxed tracking-wide text-white/70"
          >
            {{ step.description }}
          </p>
        </div>
      </li>
    </ol>
  </ServicesDetailSection>
</template>
