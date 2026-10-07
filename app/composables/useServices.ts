import type { Services } from '~/types/Service'

// Data lives at content/en/data/services.json so its path cannot collide with
// the /services page built from content/en/7.services.md.
export function useServices() {
  const { locale } = useI18n()

  return useAsyncData(
    'services',
    () =>
      queryContent<Services>('/data/services').locale(locale.value).findOne(),
    {
      watch: [locale],
    },
  )
}
