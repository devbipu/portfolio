<script setup lang="ts">
// Shared wrapper for every section of a service detail page, so heading
// rhythm and spacing stay identical down the whole page.
defineProps({
  id: {
    type: String,
    default: undefined,
  },
  heading: {
    type: String,
    required: true,
  },
  intro: {
    type: String,
    default: '',
  },
  center: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <section
    :id="id"
    class="flex flex-col gap-6"
    :class="center ? 'items-center' : ''"
  >
    <div
      class="flex max-w-2xl flex-col gap-3"
      :class="center ? 'items-center text-center' : ''"
    >
      <h2
        class="font-newsreader text-balance text-2xl italic text-main sm:text-3xl"
      >
        {{ heading }}
      </h2>
      <p
        v-if="intro"
        class="text-pretty font-extralight leading-relaxed tracking-wide text-white/70"
      >
        {{ intro }}
      </p>
    </div>

    <slot />
  </section>
</template>
