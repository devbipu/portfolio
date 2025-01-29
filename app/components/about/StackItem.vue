<script setup lang="ts">
import type { PropType } from 'vue'
import type { Stack } from '~/data/stack'

defineProps({
  item: {
    type: Object as PropType<Stack>,
    required: true,
  },
  size: {
    type: String,
    default: 'size-8',
    required: false,
  },
  btnCSS: {
    type: String,
    default: 'p-6',
    required: false,
  },
})
</script>

<template>
  <UTooltip :text="item.name">
    <SpotlightCard white :class="btnCSS" data-animate>
      <NuxtLink
        :to="item.link"
        target="_blank"
        :aria-label="item.name + ' link'"
        class="flex gap-2"
      >
        <component
          :is="item.logo"
          class="text-main"
          :class="[size, item.logo.includes('Color') ? '' : 'text-main']"
          :font-controlled="false"
          :alt="item.name + ' logo'"
          :filled="item.logo.includes('Color')"
          :aria-label="item.name + ' logo'"
        />
      </NuxtLink>
    </SpotlightCard>
  </UTooltip>
</template>
