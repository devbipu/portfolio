import { assessTraffic } from '~/utils/botSignals'
import { resolveCampaignContext } from '~/utils/campaignContext'
import type { TrafficAssessment } from '~/utils/botSignals'
import type { CampaignContext } from '~/utils/campaignContext'

/**
 * Loads Google Tag Manager - and with it GA4 - only once a visit looks like a
 * person, then hands GTM the campaign and referrer details of that visit.
 *
 * GTM is configured with `enabled: false` in `nuxt.config.ts`, so nothing is
 * requested from Google until this plugin calls `enable()`. Visits that never
 * clear the gate never reach Analytics at all, so they cannot be counted as
 * users.
 */

type DataLayer = Record<string, unknown>[]

/** Events that only a person (or their input device) produces. */
const ENGAGEMENT_EVENTS = [
  'pointerdown',
  'pointermove',
  'keydown',
  'wheel',
  'touchstart',
] as const

/** Visible time that counts as a read, for visitors who never move anything. */
const DWELL_MS = 3000

function getDataLayer(): DataLayer {
  const scope = window as unknown as { dataLayer?: DataLayer }
  scope.dataLayer ??= []
  return scope.dataLayer
}

function seedDataLayer(
  context: CampaignContext,
  assessment: TrafficAssessment,
): void {
  getDataLayer().push({
    ...context,
    traffic_quality: assessment.quality,
    traffic_score: assessment.score,
    bot_signals: assessment.signals.join(',') || 'none',
  })
}

export default defineNuxtPlugin({
  name: 'devbipu:analytics',
  // Runs after the GTM module plugin, so `useGtm()` is already available.
  enforce: 'post',
  setup(nuxtApp) {
    const gtm
      = useGtm()
        ?? (nuxtApp.vueApp.config.globalProperties.$gtm as
        | ReturnType<typeof useGtm>
        | undefined)

    const context = resolveCampaignContext()
    const assessment = assessTraffic()
    const noop = () => {}

    if (!gtm || assessment.quality === 'bot') {
      if (import.meta.dev) {
        console.info(
          '[analytics] tag not loaded',
          gtm ? assessment.signals : ['gtm-unavailable'],
        )
      }
      return {
        provide: {
          analytics: { context, quality: assessment.quality, track: noop },
        },
      }
    }

    // Queued before the container loads, so GTM replays it and the GA4 tag on
    // "All Pages" can read every value as a Data Layer Variable.
    seedDataLayer(context, assessment)

    let settled = false
    let dwellTimer: number | undefined
    const teardown: Array<() => void> = []

    const stopWatching = () => {
      window.clearTimeout(dwellTimer)
      dwellTimer = undefined
      teardown.forEach(off => off())
      teardown.length = 0
    }

    const activate = (trigger: string) => {
      if (settled) return
      settled = true
      stopWatching()

      getDataLayer().push({
        event: 'human_verified',
        engagement_trigger: trigger,
      })
      gtm.enable(true)

      if (import.meta.dev) {
        console.info(`[analytics] tag loaded via ${trigger}`, {
          quality: assessment.quality,
          signals: assessment.signals,
          context,
        })
      }
    }

    const scheduleDwell = () => {
      if (settled || dwellTimer || document.visibilityState !== 'visible') return
      dwellTimer = window.setTimeout(() => activate('dwell'), DWELL_MS)
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        scheduleDwell()
        return
      }
      // Hidden again before the dwell completed - start the clock over.
      window.clearTimeout(dwellTimer)
      dwellTimer = undefined
    }

    for (const type of ENGAGEMENT_EVENTS) {
      const onEngage = () => activate('interaction')
      window.addEventListener(type, onEngage, { passive: true, capture: true })
      teardown.push(() =>
        window.removeEventListener(type, onEngage, { capture: true }),
      )
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    teardown.push(() =>
      document.removeEventListener('visibilitychange', onVisibilityChange),
    )

    // Speculation-rules prefetch: wait until the page is actually shown.
    const doc = document as Document & { prerendering?: boolean }
    if (doc.prerendering) {
      const onShown = () => scheduleDwell()
      document.addEventListener('prerenderingchange', onShown, { once: true })
      teardown.push(() =>
        document.removeEventListener('prerenderingchange', onShown),
      )
    }
    else {
      scheduleDwell()
    }

    return {
      provide: {
        analytics: {
          context,
          quality: assessment.quality,
          /**
           * Push a GA4 event with the campaign context attached. A deliberate
           * action is itself proof of a person, so it opens the gate too.
           */
          track(event: string, params: Record<string, unknown> = {}) {
            activate('conversion')
            gtm.push({ event, ...context, ...params })
          },
        },
      },
    }
  },
})
