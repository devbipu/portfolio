<script setup lang="ts">
const { locale } = useI18n()

const { data: projects } = await useAsyncData(
  'projects',
  () =>
    queryContent('/projects').locale(locale.value).sort({ release: -1 }).find(),
  {
    watch: [locale],
  },
)

const projectModal = reactive({
  status: false,
  data: {},
})

console.log(projectModal)
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <h3 class="font-newsreader italic text-white-shadow text-xl">
      {{ $t('navigation.works') }}
    </h3>
    <div class="flex w-full flex-col gap-4">
      <div
        v-for="project in projects?.filter((work) => work.featured)"
        :key="project.name"
        role="button"
        @click="
          () => {
            projectModal.status = true
            projectModal.data = project
          }
        "
        class="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 hover:bg-secondary hover:text-main"
        :aria-label="'go to ' + project.name + ' project website'"
      >
        <span class="whitespace-nowrap">
          {{ project.name }}
        </span>
        <div class="mx-2 h-[0.1px] w-full bg-muted" />
        <span class="whitespace-nowrap text-muted">
          {{
            project.release === 'soon'
              ? $t('global.soon') + '...'
              : project.release
          }}
        </span>
      </div>
    </div>
    <div @click="useRouter().push('/works')">
      <span
        class="font-newsreader italic text-white-shadow cursor-pointer text-sm"
      >
        {{ $t('global.see_more') }}
      </span>
    </div>
    <UModal
      v-model="projectModal.status"
      :ui="{
        width: 'sm:max-w-7xl w-[48rem]',
      }"
      :transition="false"
    >
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h5
                class="text-xl font-normal leading-6 text-gray-900 dark:text-white"
              >
                Project Name: {{ projectModal.data?.name }}
              </h5>
              <h6 class="text-muted" v-if="projectModal.data?.role">
                My Role: {{ projectModal.data?.role }}
              </h6>
            </div>

            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="projectModal.status = false"
            />
          </div>
        </template>

        <div>
          <UCarousel
            ref="carouselRef"
            arrows
            v-slot="{ item }"
            :items="[projectModal.data?.image]"
            :ui="{ item: 'basis-full' }"
            class="rounded-lg overflow-hidden"
            indicators
          >
            <img :src="item" class="w-full" draggable="false" />
          </UCarousel>
          <div class="mt-4">
            <div class="flex items-center flex-wrap justify-start gap-4">
              <AboutStackItem
                size="size-6"
                btnCSS="p-4"
                v-for="item in projectModal.data?.stacks"
                :key="item.name"
                :item
              />
            </div>
          </div>
          <div class="mt-4">
            <ContentQuery
              v-slot="{ data }"
              :path="projectModal.data?._path"
              :locale="locale"
              find="one"
            >
              <template v-if="data.body.children.length > 0">
                <ContentRenderer :value="data"> </ContentRenderer>
              </template>
            </ContentQuery>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-end">
            <UTooltip :text="$t('global.email')" :shortcuts="['⌘', 'O']">
              <SpotlightButton>
                <NuxtLink
                  class="white-gradient relative flex items-center justify-center gap-2 transition-all duration-200"
                  to="/contact"
                >
                  {{ $t('global.preview') }}
                  <UIcon
                    name="heroicons-arrow-top-right-on-square"
                    class="size-5 text-white/80"
                    aria-hidden="true"
                  />
                </NuxtLink>
              </SpotlightButton>
            </UTooltip>
          </div>
        </template>

        <!-- <Placeholder class="h-32" /> -->
      </UCard>
    </UModal>
  </div>
</template>

<style scoped></style>
