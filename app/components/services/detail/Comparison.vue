<script setup lang="ts">
import type { PropType } from 'vue'
import type { ServiceComparison } from '~/types/Service'

defineProps({
  comparison: {
    type: Object as PropType<ServiceComparison>,
    required: true,
  },
})
</script>

<template>
  <ServicesDetailSection
    :heading="comparison.heading"
    :intro="comparison.intro"
  >
    <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      <div
        v-for="advantage in comparison.advantages"
        :key="advantage.title"
        class="flex gap-3"
      >
        <UIcon
          :name="advantage.icon"
          class="mt-0.5 size-5 shrink-0 text-white/50"
          aria-hidden="true"
        />
        <div class="flex flex-col gap-1">
          <h3 class="text-sm font-semibold text-main">
            {{ advantage.title }}
          </h3>
          <p
            class="text-sm font-extralight leading-relaxed tracking-wide text-white/70"
          >
            {{ advantage.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- the counterweight. Muted, but present on purpose: a page that only
         argues one side is not useful to someone making a real decision. -->
    <aside
      class="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
    >
      <h3 class="flex items-center gap-2 text-sm font-semibold text-white/80">
        <UIcon
          name="lucide:info"
          class="size-4 shrink-0 text-white/40"
          aria-hidden="true"
        />
        {{ comparison.caveatHeading }}
      </h3>
      <p
        class="text-pretty text-sm font-extralight leading-relaxed tracking-wide text-white/65"
      >
        {{ comparison.caveat }}
      </p>
    </aside>
  </ServicesDetailSection>
</template>
