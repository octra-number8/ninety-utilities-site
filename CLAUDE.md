# Ninety Utilities Ltd — website

Informational site for **Ninety Utilities Ltd**, a newly incorporated UK gas
infrastructure contractor (pipe-laying subcontractor to gas distribution
networks and developers — comparable sector to KLT Utilities, but early-stage).
Built on behalf of Wes's brother Drew, who owns the business.

## Hard rules

- **The legal entity is Ninety Utilities Ltd.** Never write "Ninety Group" in
  copy or statutory text — the domain (`ninetygroup.co.uk`) is a container,
  not a claim. There is only one company.
- **Not an energy supplier.** Nothing may imply the company sells gas or
  electricity. The footer states this explicitly — keep it.
- **No invented track record.** The company is new. Do not invent or accept
  without evidence: services, accreditations, client names, coverage areas,
  project values, years of (company) experience, fleet/plant, statistics.
  Fabricated claims are a tender-disqualifying risk. The brand guide's own
  rule agrees: capability figures must be real and dated.
- **Accreditations block ([safety.html](safety.html)) ships EMPTY.** No GIRS /
  NRSWA / SSIP / Gas Safe / ISO logo or "member of" claim goes live until the
  certificate is held and in date. The rule is written in an HTML comment at
  the block.
- **Mail DNS is off-limits.** Microsoft 365 is live on both domains (MX,
  autodiscover, SPF, DKIM, DMARC). Never generate, modify or advise on
  mail-related DNS. Any hosting DNS additions must be listed separately and
  flagged as additive-only. See the warning block at the top of
  [DEPLOY.md](DEPLOY.md).
- Wes performs all account/dashboard actions himself (GitHub, Cloudflare,
  Resend). Produce instructions, not actions.
- Generic mailbox is **hello@ninetygroup.co.uk** (shared M365 mailbox;
  drew@ and accounts@ also exist but don't appear on the site).

## Brand (guidelines v1.0, Aug 2026 — source: Wes's Downloads/ninety.html)

The identity is two ninety-degree corners framing the name: **top-left ink,
bottom-right orange — a fixed pair, never a full box, never swapped**. The
name is one plain word ("Ninety"), "Utilities" tracked uppercase beneath
(stacked) or regular grey beside it (horizontal, used in the header). The 90
icon (see [assets/favicon.svg](assets/favicon.svg)) is for square crops only.

- Colours: ink `#1D1D1F`, brand orange `#EE7D00` (mark + non-text accents
  ONLY), Action `#C25E00` (buttons and any orange text — AA on white),
  secondary text `#6E6E73`, page `#F5F5F7`, line `#ECECEE`, outline `#D6D6DB`.
  Orange is an emphasis budget — corner, primary button, live status.
- Type: Hanken Grotesk 400–800 throughout; IBM Plex Mono for anything
  referenced or measured (job numbers, diameters, dates, phone numbers).
  Display 30/800, heading 24/700, subhead 16/700, body 14/400 (≤34em,
  left-aligned, never justified), label 11.5/500/.26em tracked uppercase
  (the one typographic signature). **Self-hosted** from `assets/fonts/`
  (files not yet added — see DEPLOY.md; system fallbacks until then).
- Layout: 1200px max, page `#F5F5F7`, white cards with 1px `#ECECEE` border
  and 16px radius. Header 72px white → solid ink on scroll (site.js). Sections
  alternate white/grey; **at most one ink section per page** and it holds the
  emergency contact block. Footer is ink with reversed lockup and the 24-hour
  escape number (National Gas Emergency Service 0800 111 999) at 24px.
- Corner device as page framing: **max twice per page** (hero statement, one
  pull quote/stat, active card state). CSS classes `.lockup` / `.corner-frame`
  in [styles.css](styles.css).
- Buttons: ONE primary per view, filled `#C25E00`, 10px radius, ≥44px tall,
  outcome labels ("Start an enquiry", never "Submit"). Secondary = 1px
  `#D6D6DB` outline.
- Motion: 120ms state changes, 200ms reveals; no parallax, no carousels, no
  scroll counters. The mark-assembly animation (guide §5) is NOT implemented —
  it's for a preloader/video sting only, max once per session, and honours
  `prefers-reduced-motion`.
- Imagery: real photography only, no stock, mark never directly on an image.
  None exists yet — spaces are left empty rather than filled.
- Conventions: dates DD/MM/YYYY, £, en-GB, **no emoji anywhere**.

## Stack

- Plain HTML + CSS + one small JS file. **No framework, no build step, no
  CMS, no CDN dependencies.** Deployed from GitHub to **Cloudflare Pages**,
  output directory = repo root.
- Header/footer are **duplicated in every HTML file**. A nav or footer change
  must be applied to all nine pages: index, mains-renewal, connections,
  safety, works, careers, contact, privacy, 404. (They were generated once by
  a throwaway script; the repo itself has no build step.)
- [assets/site.js](assets/site.js): header ink-on-scroll + form timestamp.
  Progressive enhancement only — everything works with JS off. CSP in
  [_headers](_headers) is `script-src 'self'` (no inline scripts — keep it
  that way).

## Pages (structure per brand guide §6)

| Page | Job |
|---|---|
| `index.html` | One-line statement, capability figures (real+dated or omitted), route the two audiences (networks/PCs vs developers/homeowners), ink emergency section. |
| `mains-renewal.html` | Method, diameters/materials, reinstatement standard, typical programme. |
| `connections.html` | Domestic / commercial / multi-plot routes: what to supply + lead time. |
| `safety.html` | H&S policy, CDM 2015, streetworks competence, training, incident record, EMPTY accreditations block, who to call in emergency. |
| `works.html` | "Works in your street" — public/resident-facing, plain English. |
| `careers.html` | Vacancies by depot with tickets required; honest "none right now" default. |
| `contact.html` | Escape line above everything, enquiry form, direct details. |
| `privacy.html`, `404.html` | Standard; both noindex. |

Header nav: Mains renewal · Connections · Safety · Careers + "Start an
enquiry" Action button. Works-in-your-street and Privacy are footer links.

## Contact form

Plain-POST to `functions/api/contact.js` (Pages Function) → Resend API →
`CONTACT_TO` (hello@). Honeypot (`website` field) + fast-submit check
(`form_ts`, tolerated if absent). Redirects to `/contact.html#sent` /
`#error`; CSS `:target` reveals the message — works with no JS. Env vars:
`RESEND_API_KEY` (secret), `CONTACT_TO`, `CONTACT_FROM`.

## SEO / privacy posture

- Unique title/description/OG per page, canonicals on
  `https://ninetygroup.co.uk`, sitemap (7 indexable pages), robots disallows
  `/api/`. Organization JSON-LD on index only, minimal — extend only with
  real data.
- **No analytics, no cookies, no banner.** If analytics are added: cookieless
  (Cloudflare Web Analytics / Plausible) → update privacy notice + CSP only;
  cookie-based (GA4) additionally needs a PECR consent banner blocking the
  script until opt-in.

## Future: customer portal

Planned on the same domain. Portal can live at `/portal/` (same project) or
`portal.ninetygroup.co.uk` (separate project). robots.txt already disallows
`/api/`; add the portal path when real. The strict site-wide CSP in
`_headers` will need its own scoped block for an app. Nothing else baked in.

## State (25/08/2026)

Brand applied per guidelines v1.0; nine-page structure built; all copy is
`[PROVIDE: …]` scaffolding awaiting Drew's real content. Font files not yet
in `assets/fonts/`. Committed locally, **not pushed or deployed** — Wes's
manual steps are in DEPLOY.md. Phone number not chosen. `_brandguide.html`
is a local gitignored copy of the brand guide for reference.
