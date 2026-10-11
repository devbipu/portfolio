/**
 * Captures where a visit came from so it can be sent to GA4 as event
 * parameters, and keeps that first touch for the rest of the session.
 *
 * Cold-mail clicks usually arrive with an empty `document.referrer` - mail
 * clients strip it - which is why GA4 files them under `direct / none`. The
 * UTM parameters on the link are the reliable source, the referrer is the
 * fallback for the webmail clients that do send one.
 */

export type ReferrerType =
  | 'direct'
  | 'internal'
  | 'webmail'
  | 'search'
  | 'social'
  | 'referral'

export type CampaignContext = {
  landing_page: string
  landing_query: string
  page_referrer: string
  referrer_domain: string
  referrer_type: ReferrerType
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  utm_term: string
  utm_id: string
  click_id: string
  prospect_id: string
}

const STORAGE_KEY = 'devbipu:campaign'

const WEBMAIL = /mail\.|outlook\.|webmail|roundcube|zimbra|proton\.me|hey\.com/i
const SEARCH
  = /google\.|bing\.|duckduckgo\.|yahoo\.|yandex\.|baidu\.|ecosia\.|brave\.com|startpage\./i
const SOCIAL
  = /facebook\.|instagram\.|linkedin\.|lnkd\.in|t\.co|twitter\.|x\.com|reddit\.|youtube\.|pinterest\.|tiktok\.|threads\.|whatsapp\.|telegram\.|discord\./i

/** Click identifiers worth keeping, in priority order. */
const CLICK_IDS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'li_fat_id']

/** Query keys a cold-mail link may use to identify the recipient. */
const PROSPECT_KEYS = ['pid', 'prospect', 'lead', 'contact', 'recipient', 'rid']

function classifyReferrer(domain: string): ReferrerType {
  if (!domain) return 'direct'
  if (domain === window.location.hostname) return 'internal'
  if (WEBMAIL.test(domain)) return 'webmail'
  if (SEARCH.test(domain)) return 'search'
  if (SOCIAL.test(domain)) return 'social'
  return 'referral'
}

function firstValue(params: URLSearchParams, keys: string[]): string {
  for (const key of keys) {
    const value = params.get(key)
    if (value) return value.slice(0, 100)
  }
  return ''
}

function readFromLocation(href: string, referrer: string): CampaignContext {
  const url = new URL(href)
  const params = url.searchParams

  let referrerDomain = ''
  try {
    referrerDomain = referrer ? new URL(referrer).hostname : ''
  }
  catch {
    referrerDomain = ''
  }

  const get = (key: string) => params.get(key)?.slice(0, 100) ?? ''

  return {
    landing_page: url.pathname,
    landing_query: url.search,
    page_referrer: referrer,
    referrer_domain: referrerDomain,
    referrer_type: classifyReferrer(referrerDomain),
    utm_source: get('utm_source'),
    utm_medium: get('utm_medium'),
    utm_campaign: get('utm_campaign'),
    utm_content: get('utm_content'),
    utm_term: get('utm_term'),
    utm_id: get('utm_id'),
    click_id: firstValue(params, CLICK_IDS),
    prospect_id: firstValue(params, PROSPECT_KEYS) || get('utm_content'),
  }
}

function readStored(): CampaignContext | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CampaignContext) : null
  }
  catch {
    return null
  }
}

function store(context: CampaignContext): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context))
  }
  catch {
    // Private mode or blocked storage: attribution just stays per-pageview.
  }
}

/**
 * Resolve the campaign context for this session. A hit that carries campaign
 * parameters or an external referrer starts a new first touch; otherwise the
 * stored first touch is reused so a conversion deeper in the site is still
 * credited to the mail that brought the visitor in.
 */
export function resolveCampaignContext(
  href: string = window.location.href,
  referrer: string = document.referrer,
): CampaignContext {
  const current = readFromLocation(href, referrer)
  const isFirstTouch
    = Boolean(current.utm_source || current.utm_campaign || current.click_id)
      || (current.referrer_type !== 'internal'
        && current.referrer_type !== 'direct')

  if (isFirstTouch) {
    store(current)
    return current
  }

  const stored = readStored()
  if (stored) return stored

  store(current)
  return current
}
