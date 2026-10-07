<script setup lang="ts">
import type { PropType } from 'vue'
import { NuxtLink } from '#components'
import type { Service } from '~/types/Service'

const props = defineProps({
  service: {
    type: Object as PropType<Service>,
    required: true,
  },
})

// Price and timeline are optional and often blank while a rate is being
// decided, so the footer only exists when there is something true to put in it.
const startingAt = computed(() => props.service.startingAt?.trim() ?? '')
const timeline = computed(() => props.service.timeline?.trim() ?? '')
const hasMeta = computed(() => !!startingAt.value || !!timeline.value)

// A card only becomes a link once its detail page exists in
// content/en/services/, so a slugless service can never render a dead link.
const to = computed(() =>
  props.service.slug ? `/services/${props.service.slug}` : null,
)

// The real component, not the string 'NuxtLink': a string only resolves for
// globally registered components, and SSR silently emits a literal <NuxtLink>
// element when it cannot resolve one - which renders a card nobody can click.
const wrapper = computed(() => (to.value ? NuxtLink : 'article'))
</script>

<template>
  <SpotlightCard
    white
    class="h-full"
  >
    <component
      :is="wrapper"
      :to="to ?? undefined"
      :aria-label="to ? `${service.title} service details` : undefined"
      class="group flex h-full flex-col gap-4 p-5"
      :class="to ? 'cursor-pointer' : ''"
    >
      <!-- icon + title -->
      <div class="flex items-start gap-3">
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5"
        >
          <UIcon
            :name="service.icon"
            class="size-5 text-white/80"
            aria-hidden="true"
          />
        </div>
        <h3 class="mt-1.5 text-base font-semibold text-main">
          {{ service.title }}
        </h3>
      </div>

      <p class="font-extralight leading-relaxed tracking-wide text-white/75">
        {{ service.description }}
      </p>

      <!-- what the client actually receives -->
      <div
        v-if="service.deliverables?.length"
        class="grow"
      >
        <p class="mb-2 text-xs uppercase tracking-wider text-muted">
          {{ $t('services.deliverables') }}
        </p>
        <ul class="flex flex-col gap-1.5">
          <li
            v-for="item in service.deliverables"
            :key="item"
            class="flex items-start gap-2 text-sm font-extralight text-white/70"
          >
            <UIcon
              name="i-heroicons-check"
              class="mt-0.5 size-4 shrink-0 text-white/40"
              aria-hidden="true"
            />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <ul
        v-if="service.stack?.length"
        class="flex flex-wrap gap-1.5"
      >
        <li
          v-for="tech in service.stack"
          :key="tech"
          class="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-muted"
        >
          {{ tech }}
        </li>
      </ul>

      <footer
        v-if="hasMeta || to"
        class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t border-white/10 pt-4"
      >
        <div
          v-if="hasMeta"
          class="flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          <div
            v-if="startingAt"
            class="flex flex-col"
          >
            <span class="text-xs text-muted">
              {{ $t('services.starting_at') }}
            </span>
            <span class="white-gradient-tb text-sm font-semibold">
              {{ startingAt }}
            </span>
          </div>
          <div
            v-if="timeline"
            class="flex flex-col"
          >
            <span class="text-xs text-muted">
              {{ $t('services.timeline') }}
            </span>
            <span class="text-sm font-medium text-white/80">
              {{ timeline }}
            </span>
          </div>
        </div>

        <span
          v-if="to"
          class="ml-auto flex items-center gap-1.5 text-sm text-muted transition-colors duration-300 group-hover:text-main"
        >
          {{ $t('services.learn_more') }}
          <UIcon
            name="i-heroicons-arrow-right"
            class="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </footer>
    </component>
  </SpotlightCard>
</template>
