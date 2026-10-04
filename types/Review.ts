// Deliberately minimal: a review carries the quote, the stars, and a generic
// description of the work. No client identity, no money, no contract metadata -
// none of that is collected, stored or rendered anywhere in this feature.
export type Review = {
  quote: string
  rating: number
  project?: string
  tags?: string[]
  featured?: boolean
}

export type ReviewStats = {
  rating?: number | null
  ratingCount?: number | null
  jobSuccess?: number | null
  jobs?: number | null
  hours?: number | null
  badge?: string
}

export type Reviews = {
  title: string
  subtitle: string
  profileUrl?: string
  stats?: ReviewStats
  reviews: Review[]
}
