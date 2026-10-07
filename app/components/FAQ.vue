<script setup lang="ts">
import type { PropType } from 'vue'
import type { Question } from '~/types/Faq'

defineProps({
  questions: {
    type: Object as PropType<Question[]>,
    required: true,
  },
})

// Unique per instance, so two FAQ lists on one page cannot collide on the
// ids wiring each button to the panel it controls.
const uid = useId()
</script>

<template>
  <FaqGroup class="select-none space-y-5">
    <FaqItem
      v-for="(question, index) in questions"
      :key="question.title"
      v-slot="{ isActive, toggle }"
      class="group transform-gpu rounded-xl border border-white/10 bg-white/5 transition duration-500 will-change-transform hover:bg-white/[0.075]"
    >
      <!-- a real button: the row has to be reachable by tab and operable by
           Enter/Space, which a div with a click handler is not -->
      <button
        :id="`${uid}-q-${index}`"
        type="button"
        class="flex w-full cursor-pointer items-center gap-4 p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        :aria-expanded="isActive"
        :aria-controls="`${uid}-a-${index}`"
        @click="toggle"
      >
        <span class="text-white/75 transition group-hover:text-white">
          {{ question.title }}
        </span>

        <span class="relative ml-auto">
          <UIcon
            name="i-heroicons-x-mark"
            class="size-6 transform-gpu text-white/50 transition-transform duration-500 will-change-transform"
            :class="{ 'rotate-180': isActive, 'rotate-45': !isActive }"
            aria-hidden="true"
          />
        </span>
      </button>

      <FaqContent
        :id="`${uid}-a-${index}`"
        role="region"
        :aria-labelledby="`${uid}-q-${index}`"
        :aria-hidden="!isActive"
        class="transform-gpu overflow-hidden px-4 transition-all duration-500 will-change-[height]"
      >
        <p
          class="pb-4 font-extralight leading-relaxed tracking-wide text-white/75"
        >
          {{ question.answer }}
        </p>
      </FaqContent>
    </FaqItem>
  </FaqGroup>
</template>
