// A service is a thing I sell, described in the client's terms: what it is,
// what lands in their hands, and roughly what it costs in money and time.
// Price and timeline are optional strings, not numbers - "From $1,500" and
// "2-4 weeks" are honest ranges, and a blank value simply renders nothing.
export type Service = {
  title: string
  description: string
  icon: string
  // Links the listing card to content/en/services/<slug>.md. Without it the
  // card renders as plain copy rather than a dead link.
  slug?: string
  deliverables?: string[]
  stack?: string[]
  startingAt?: string
  timeline?: string
  featured?: boolean
}

export type Services = {
  title: string
  subtitle: string
  services: Service[]
}

export type ServiceCta = {
  label: string
  to: string
}

export type ServiceHero = {
  headline: string
  subline: string
  highlights?: string[]
  primaryCta?: ServiceCta
  secondaryCta?: ServiceCta
}

export type ServiceSection = {
  heading: string
  intro?: string
  note?: string
}

export type ServiceProblems = ServiceSection & {
  items: string[]
}

export type ServiceModule = {
  title: string
  icon: string
  description: string
}

export type ServiceModules = ServiceSection & {
  items: ServiceModule[]
}

// `workflow` is rendered as a left-to-right chain of stages, so the order of
// the array is the order of the real-world process.
export type ServiceIndustry = {
  title: string
  icon: string
  workflow?: string[]
  features?: string[]
}

export type ServiceIndustries = ServiceSection & {
  items: ServiceIndustry[]
  // Trades the same system suits, named without implying a ready-made product
  // exists for them today.
  others?: string[]
  othersNote?: string
}

export type ServiceAdvantage = {
  title: string
  icon: string
  description: string
}

// `caveat` is deliberately part of the type: the section is not allowed to
// render as one-sided advocacy with no honest counterweight.
export type ServiceComparison = ServiceSection & {
  advantages: ServiceAdvantage[]
  caveatHeading: string
  caveat: string
}

export type ServiceProcessStep = {
  title: string
  description: string
}

export type ServiceProcess = ServiceSection & {
  steps: ServiceProcessStep[]
}

export type ServiceOwnership = ServiceSection & {
  copy: string
  points: string[]
}

export type ServicePricing = ServiceSection & {
  copy: string
  cta?: ServiceCta
}

export type ServiceClosing = ServiceSection & {
  copy: string
  primaryCta?: ServiceCta
  secondaryCta?: ServiceCta
}

export type ServiceFaq = ServiceSection & {
  questions: { title: string, answer: string }[]
}

export type ServiceDetail = {
  title: string
  // What goes in <title>, when the service's own name is not the phrase a
  // business owner would actually search for. Falls back to `title`.
  seoTitle?: string
  description: string
  hero: ServiceHero
  problems?: ServiceProblems
  modules?: ServiceModules
  industries?: ServiceIndustries
  comparison?: ServiceComparison
  process?: ServiceProcess
  ownership?: ServiceOwnership
  pricing?: ServicePricing
  closing?: ServiceClosing
  faq?: ServiceFaq
}
