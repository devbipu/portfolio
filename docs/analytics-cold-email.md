# Cold-mail analytics: bot filtering & referrer reporting

How bipu.dev keeps automated traffic out of GA4, and how to see which cold mail
a visit came from.

## 1. What the code does

`app/plugins/analytics.client.ts` owns when Google Tag Manager loads.
`nuxt.config.ts` sets `gtm.enabled: false`, so **nothing is requested from
Google until the plugin decides the visit looks human**. A filtered visit never
reaches GA4, so it cannot be counted as a user.

Every visit is classified by `app/utils/botSignals.ts`:

| Verdict | What it means | What happens |
| --- | --- | --- |
| `bot` | A hard signal fired: `navigator.webdriver`, a bot/headless user agent, an automation global (`_phantom`, `domAutomation`, ChromeDriver keys), or a `webdriver` attribute on `<html>` | GTM is never loaded. Zero hits. |
| `suspect` | Two or more weak signals: no `navigator.languages`, no plugins on a desktop Chrome UA, missing `window.chrome`, single CPU core, software GPU (SwiftShader/llvmpipe), zero-size window (while visible) or screen, touch/UA mismatch | Sent, tagged `traffic_quality=suspect` so it can be segmented out |
| `human` | Everything else | Sent, tagged `traffic_quality=human` |

Visits that are not hard-blocked still have to clear an **engagement gate**
before GTM loads:

- any `pointerdown`, `pointermove`, `keydown`, `wheel` or `touchstart` → loads
  immediately, `engagement_trigger=interaction`
- otherwise 3 seconds of _visible_ dwell time → `engagement_trigger=dwell` (the
  timer is paused and restarted while the tab is hidden, and waits for
  `prerenderingchange` on a prefetched page)
- a conversion pushed through `$analytics.track()` →
  `engagement_trigger=conversion`

This is the part that actually matters for cold mail. Mail-security link
scanners (Outlook SafeLinks, Proofpoint, Mimecast, Barracuda) drive real
headless Chrome, fetch the page in under a second, never touch an input device,
and then close it. GA4's own bot filter does not catch them, because it only
excludes bots that identify themselves in the
[IAB/ABC Spiders & Bots list](https://support.google.com/analytics/answer/9888366).

`app/utils/campaignContext.ts` captures the campaign details of the first touch
and keeps them in `sessionStorage`, so a contact-form submit three pages later
is still credited to the mail that brought the visitor in.

### Tracking a conversion

```ts
const { $analytics } = useNuxtApp()

$analytics.track('generate_lead', { form: 'contact' })
```

The campaign context is attached automatically.

## 2. One-time GTM setup

The plugin pushes everything to `dataLayer` _before_ the container loads, so GTM
replays it and the values are available to tags firing on All Pages. They still
have to be declared.

**a. Create Data Layer Variables** — Variables → New → Data Layer Variable, one
per name below (variable name and data layer key the same):

```
traffic_quality      bot_signals          traffic_score
engagement_trigger   page_referrer        referrer_domain
referrer_type        landing_page         landing_query
utm_source           utm_medium           utm_campaign
utm_content          utm_term             utm_id
click_id             prospect_id
```

**b. Attach them to the GA4 tag** — open the tag that loads GA4 (named _Google
Tag_, or _GA4 Configuration_ on older containers) and add each one under
**Shared event parameters** (legacy containers: _Fields to set_). Use the same
names as the parameters, e.g. parameter `referrer_type` → value
`{{referrer_type}}`.

Keep the tag on its existing _Initialization – All Pages_ / _All Pages_ trigger.
No blocking trigger is needed — bots never load the container, so the trigger
never fires for them.

> `page_referrer` is a GA4 built-in name. Setting it from the data layer keeps
> the referrer intact even though the tag now fires a few seconds after the page
> loaded.

**c. Optional** — if you want a tag to fire only on verified traffic, there is
now a `human_verified` event in the data layer to trigger on.

## 3. One-time GA4 setup

**a. Register the dimensions** — Admin → Data display → **Custom definitions** →
Create custom dimension, scope **Event**, for each parameter you want in
reports:

| Dimension name | Event parameter |
| --- | --- |
| Traffic quality | `traffic_quality` |
| Bot signals | `bot_signals` |
| Engagement trigger | `engagement_trigger` |
| Referrer domain | `referrer_domain` |
| Referrer type | `referrer_type` |
| Prospect ID | `prospect_id` |
| Landing query | `landing_query` |

Registration is **not retroactive** — a dimension only collects data from the
day you create it. The limit is 50 event-scoped dimensions on a standard
property.

The UTM parameters do **not** need custom dimensions; GA4 maps them to its
built-in campaign dimensions on its own.

**b. Exclude your own visits** — Admin → Data collection and modification → Data
streams → your stream → Configure tag settings → **Define internal traffic**
(add your IP), then Admin → Data filters → _Internal traffic_ → set to
**Active**. GA4 data filters only support internal traffic, developer traffic
and web hostname — there is no way to filter on a custom dimension, so anything
you want gone has to be stopped client-side (section 1) or excluded in the
report (section 5).

## 4. Link format for the campaign

Tag every link in the mail. Most mail clients strip the referrer, which is why
untagged cold-mail clicks land in GA4 as `direct / none` — the UTMs are the only
reliable source.

```
https://bipu.dev/services/lawn-care-business-manager
  ?utm_source=coldmail
  &utm_medium=email
  &utm_campaign=lawncare-2026-10
  &utm_content=batch-a
  &pid=a7f3c2
```

| Parameter | Use it for | Shows in GA4 as |
| --- | --- | --- |
| `utm_source` | where the click came from (`coldmail`) | Session source |
| `utm_medium` | always `email` | Session medium |
| `utm_campaign` | one value per send (`lawncare-2026-10`) | Session campaign |
| `utm_content` | the variant or batch you are testing | Session manual ad content |
| `utm_term` | the segment or niche | Session manual term |
| `pid` | opaque per-recipient id | `prospect_id` dimension |

Keep `utm_source` and `utm_medium` identical across a whole send, or GA4 splits
one campaign across several rows.

**Do not put an email address, name or company name in `pid` or any UTM.** GA4
prohibits personal data and can delete the property over it. Use a random or
hashed id you can look up in your own sending list.

## 5. Reading the report

- **Which mail worked** — Reports → Acquisition → **Traffic acquisition**,
  switch the dimension to _Session campaign_, add _Session manual ad content_ as
  a secondary dimension.
- **Referrer per visit** — Explore → blank exploration, dimensions _Referrer
  domain_ and _Referrer type_ (or the built-in _Page referrer_), metrics
  _Sessions_ and _Users_. Expect `direct` for most mail clients; `webmail` is a
  Gmail or Outlook web user.
- **Per recipient** — same exploration with _Prospect ID_.
- **Drop the questionable traffic** — add a filter `Traffic quality` exactly
  matches `human`, or `Engagement trigger` exactly matches `interaction` for the
  strictest view. `Bot signals` tells you which heuristic fired.

A useful sanity check: the share of sessions with
`engagement_trigger = interaction` versus `dwell`. A send where almost
everything is `dwell` with `suspect` signals is a send that mostly reached
scanners, not people.

## 6. Verifying it works

1. `npm run dev`, open the site, and watch the console. The plugin logs
   `[analytics] tag loaded via interaction` or
   `[analytics] tag not loaded [...]` in dev only.
2. Confirm nothing loads early: DevTools → Network, filter `googletagmanager`,
   reload and do not touch the mouse or keyboard. The request should appear only
   after ~3s.
3. Confirm a bot is blocked: run the page in headless automation
   (`npx playwright screenshot https://bipu.dev out.png`) and check the server
   or network log — no `googletagmanager` request should be made, because
   `navigator.webdriver` is set.
4. GTM **Preview** mode and GA4 **DebugView** both work normally: you move the
   mouse while testing, so the gate opens immediately.
5. In GA4 Realtime, check the event parameters on a `page_view`.

## 7. Known limits

- Heuristics, not proof. A scanner that drives a full Chrome profile and
  synthesizes mouse movement will still get through — it will usually carry
  `suspect` signals, which is why those are reported rather than hidden.
- Real visitors who open the page, read nothing and leave inside 3 seconds
  without touching an input device are not counted. That is a deliberate trade:
  on a cold-mail campaign those are far more likely to be scanners.
- GA4 never cleans history. Everything here applies from deploy onward.
- Hits that reach GA4 through the Measurement Protocol, or any other tag outside
  this container, are unaffected.
