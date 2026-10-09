// Deliberately minimal: a review carries the quote, the stars, a short client
// name and a generic description of the work. No money, no contract metadata,
// no company, no country - none of that is collected, stored or rendered
// anywhere in this feature. `client` is the one identifying field, and it is
// the shortened form Upwork itself publishes, never a full legal name.
export type Review = {
  quote: string
  rating: number
  client?: string
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

// The one attributed exception to the rule above. A recommendation letter is
// given to be shown, and this client gave explicit permission to publish his
// name, role and company - which is the whole reason it outweighs the
// anonymous quotes. Deliberately no `email`: the signed PDF carries the
// contact details, a scrapeable public page does not.
export type ReviewLetter = {
  excerpt: string
  body: string[]
  salutation?: string
  author: string
  role: string
  company: string
  date: string
  signature?: string
  pdf?: string
  projectUrl?: string
  rating?: number
}

export type Reviews = {
  title: string
  subtitle: string
  profileUrl?: string
  stats?: ReviewStats
  letter?: ReviewLetter
  reviews: Review[]
}
