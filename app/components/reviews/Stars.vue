<script setup lang="ts">
const props = defineProps({
  rating: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    default: 'size-4',
  },
})

const stars = computed(() =>
  Array.from({ length: 5 }, (_, index) => ({
    key: index,
    fill: `${Math.max(0, Math.min(1, props.rating - index)) * 100}%`,
  })),
)
</script>

<template>
  <div
    class="flex items-center gap-0.5"
    role="img"
    :aria-label="`Rated ${rating} out of 5`"
  >
    <span
      v-for="star in stars"
      :key="star.key"
      class="relative inline-block shrink-0"
      :class="size"
    >
      <UIcon
        name="i-heroicons-star-solid"
        class="absolute inset-0 text-white/15"
        :class="size"
      />
      <span
        class="absolute inset-y-0 left-0 overflow-hidden"
        :style="{ width: star.fill }"
      >
        <UIcon
          name="i-heroicons-star-solid"
          class="text-amber-400"
          :class="size"
        />
      </span>
    </span>
  </div>
</template>
