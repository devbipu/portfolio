<script setup lang="ts"></script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 sm:gap-2">
    <div
      class="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-2"
    >
      <UTooltip :text="$t('global.cv')">
        <SpotlightButton>
          <a
            class="white-gradient relative flex items-center justify-center gap-2 transition-all duration-200"
            href="/assets/Biplob-Shaha-full-stack-developer-Resume.pdf"
            download
          >
            {{ $t('global.cv') }}
            <UIcon
              name="heroicons-arrow-down-tray"
              class="size-5 text-white/80"
              aria-hidden="true"
            />
          </a>
        </SpotlightButton>
      </UTooltip>
      <!-- <MeetingButton /> -->
    </div>
  </div>
</template>

<style scoped></style>
