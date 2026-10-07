<script setup lang="ts">
import type { PropType } from 'vue'
import type { ServiceProblems } from '~/types/Service'

defineProps({
  problems: {
    type: Object as PropType<ServiceProblems>,
    required: true,
  },
})
</script>

<template>
  <ServicesDetailSection
    :heading="problems.heading"
    :intro="problems.intro"
  >
    <ul class="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      <li
        v-for="item in problems.items"
        :key="item"
        class="flex items-start gap-2.5 text-sm font-extralight leading-relaxed text-white/70"
      >
        <!-- a neutral marker, not an alarm icon: these are facts of the job -->
        <span
          class="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-white/25"
          aria-hidden="true"
        />
        <span>{{ item }}</span>
      </li>
    </ul>

    <p
      v-if="problems.note"
      class="max-w-2xl border-l-2 border-white/15 pl-4 text-pretty font-newsreader text-lg italic leading-relaxed text-white/80"
    >
      {{ problems.note }}
    </p>
  </ServicesDetailSection>
</template>
