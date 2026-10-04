import type { Reviews } from '~/types/Review'

// Data lives at content/en/data/reviews.json so its path cannot collide with
// the /reviews page built from content/en/6.reviews.md.
export function useReviews() {
  const { locale } = useI18n()

  return useAsyncData(
    'reviews',
    () => queryContent<Reviews>('/data/reviews').locale(locale.value).findOne(),
    {
      watch: [locale],
    },
  )
}
