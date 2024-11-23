<script setup lang="ts">
// import { NuxtImg } from '#build/components'
const { appName } = useAppConfig()

defineProps({
  isText: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: 16,
  },
})
</script>

<template>
  <NuxtLink
    to="/"
    class="flex shrink-0 items-center"
    aria-label="Go back to home page"
  >
    <NuxtImg
      class="block w-auto"
      src="/devbipu-logo-footr.png"
      :class="size ? 'h-' + size : 'h-6'"
    />

    <span v-if="isText" class="ml-1 text-xs font-semibold">
      {{ appName }}
    </span>
  </NuxtLink>
</template>
