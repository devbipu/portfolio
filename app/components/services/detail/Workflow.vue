<script setup lang="ts">
import type { PropType } from 'vue'

// A real-world process rendered as an ordered chain. It wraps on narrow
// screens rather than scrolling sideways, so a crew lead on a phone can read
// the whole flow without swiping.
defineProps({
  steps: {
    type: Array as PropType<string[]>,
    required: true,
  },
})
</script>

<template>
  <ol class="flex flex-wrap items-center gap-x-1.5 gap-y-2">
    <li
      v-for="(step, index) in steps"
      :key="step"
      class="flex items-center gap-1.5"
    >
      <span
        class="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/75"
      >
        {{ step }}
      </span>
      <UIcon
        v-if="index < steps.length - 1"
        name="i-heroicons-arrow-right"
        class="size-3 shrink-0 text-white/25"
        aria-hidden="true"
      />
    </li>
  </ol>
</template>
