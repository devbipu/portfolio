/**
 * Client-side bot heuristics, used to keep automated traffic out of GA4.
 *
 * None of this is a guarantee. It targets the only automation that actually
 * reaches Analytics: headless browsers that execute JavaScript - mail security
 * link scanners, link checkers, preview fetchers and scrapers. Anything that
 * does not run JS never loads the tag in the first place.
 */

export type TrafficQuality = 'human' | 'suspect' | 'bot'

export type TrafficAssessment = {
  quality: TrafficQuality
  signals: string[]
  score: number
}

/** User agents that are never worth measuring. */
const BOT_UA
  = /bot|crawl|spider|slurp|scrape|fetcher|monitor|headless|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix|pingdom|uptime|validator|facebookexternalhit|embedly|proofpoint|barracuda|mimecast|urlscan|safelinks|python|axios|curl|wget|okhttp|java\/|go-http|node-fetch/i

/** Globals injected by automation frameworks. */
const AUTOMATION_GLOBALS = [
  '__nightmare',
  '_phantom',
  'callPhantom',
  '__selenium_unwrapped',
  '__webdriver_evaluate',
  '__driver_evaluate',
  '__fxdriver_evaluate',
  'domAutomation',
  'domAutomationController',
  '_Selenium_IDE_Recorder',
]

/** Signals strong enough to drop the visit entirely. */
function hardSignals(): string[] {
  const signals: string[] = []
  const nav = window.navigator

  if (nav.webdriver === true) signals.push('webdriver')
  if (BOT_UA.test(nav.userAgent)) signals.push('bot-ua')
  if (!nav.userAgent) signals.push('no-ua')
  if (AUTOMATION_GLOBALS.some(key => key in window)) {
    signals.push('automation-global')
  }
  if (document.documentElement.hasAttribute('webdriver')) {
    signals.push('webdriver-attribute')
  }
  try {
    const driverKey = Object.keys(document).some(key =>
      /cdc_|selenium|webdriver/i.test(key),
    )
    if (driverKey) signals.push('chromedriver')
  }
  catch {
    // Accessing document keys can throw in locked-down contexts; ignore.
  }

  return signals
}

/** A software renderer is a good hint that nobody is looking at the screen. */
function rendererSignal(): string | null {
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    if (!gl) return 'no-webgl'

    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()

    return /swiftshader|llvmpipe|softpipe|mesa offscreen|basic render/i.test(
      renderer,
    )
      ? 'software-gpu'
      : null
  }
  catch {
    return null
  }
}

/** Weaker signals: reported, but not enough on their own to drop the visit. */
function softSignals(): string[] {
  const signals: string[] = []
  const nav = window.navigator
  const ua = nav.userAgent
  const claimsChrome
    = /chrome\/\d/i.test(ua) && !/edg|opr|samsungbrowser/i.test(ua)
  const claimsMobile = /mobile|android|iphone|ipad/i.test(ua)

  if (!nav.languages?.length) signals.push('no-languages')
  if (claimsChrome && !('chrome' in window)) signals.push('no-chrome-object')
  if (claimsChrome && !claimsMobile && !nav.plugins?.length) {
    signals.push('no-plugins')
  }
  if (claimsMobile && nav.maxTouchPoints === 0) signals.push('touch-mismatch')
  if ((nav.hardwareConcurrency ?? 0) <= 1) signals.push('single-core')
  // Only meaningful while the page is on screen; a background tab reports 0.
  if (
    document.visibilityState === 'visible'
    && (!window.outerWidth || !window.outerHeight)
  ) {
    signals.push('no-chrome-ui')
  }
  if (!screen.width || !screen.height) signals.push('no-screen')

  const renderer = rendererSignal()
  if (renderer) signals.push(renderer)

  return signals
}

/**
 * Classify the current visit.
 *
 * `bot` means drop it, `suspect` means send it but tag it so it can be
 * segmented out in reports, `human` is the normal path.
 */
export function assessTraffic(): TrafficAssessment {
  const hard = hardSignals()
  if (hard.length) return { quality: 'bot', signals: hard, score: 100 }

  const soft = softSignals()
  const score = Math.min(soft.length * 25, 75)

  return {
    quality: soft.length >= 2 ? 'suspect' : 'human',
    signals: soft,
    score,
  }
}
