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
  Fabricated claims are a tender-disqualifying risk.
- **Accreditations block ([about.html](about.html)) ships EMPTY.** No GIRS /
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

## Stack

- Plain HTML + CSS. **No framework, no build step, no CMS, no external fonts,
  no CDN dependencies.** Deployed from GitHub to **Cloudflare Pages**, output
  directory = repo root.
- Header/footer are **duplicated in every HTML file** (no build step). A
  change to nav or the statutory footer must be applied to all six pages:
  index, services, about, contact, privacy, 404.
- One inline `<script>` exists (contact page, form timestamp). The CSP in
  [_headers](_headers) therefore allows `script-src 'unsafe-inline'`; if
  scripts move to a file, tighten it.

## Layout

| Path | What |
|---|---|
| `*.html` | The six pages. Copy is scaffolding: `[PROVIDE: …]` markers need real content; example sentences are marked as placeholders in comments. |
| `styles.css` | Single stylesheet. Palette in `:root` — charcoal + PE-pipe yellow accent; accent is decorative only (rules/markers), `--accent-ink` is the AA-safe text variant. |
| `functions/api/contact.js` | Cloudflare Pages Function. Plain-POST contact form → Resend API → `CONTACT_TO`. Honeypot (`website` field) + fast-submit check. Redirects to `/contact.html#sent` / `#error`; CSS `:target` shows the message, so it works with no JS. Env vars: `RESEND_API_KEY` (secret), `CONTACT_TO`, `CONTACT_FROM`. |
| `_headers` | Security headers incl. CSP. |
| `sitemap.xml`, `robots.txt` | `/api/` disallowed in robots. |
| `DEPLOY.md` | Wes's manual go-live steps + content checklist. |

## SEO / privacy posture

- Unique title + meta description + OG tags per page; canonical URLs on
  `https://ninetygroup.co.uk`. Organization JSON-LD on index only,
  deliberately minimal — extend (address, telephone, logo) only with real data.
- **No analytics, no cookies, no cookie banner.** The privacy notice says so.
  If analytics are ever added: prefer a cookieless tool (Cloudflare Web
  Analytics / Plausible) → update the privacy notice's "what we collect"
  section and add the script host to the CSP; no consent banner needed if
  genuinely cookieless. Anything cookie-based (GA4) additionally requires a
  PECR consent banner blocking the script until opt-in.

## Future: customer portal

A portal will be added **on the same domain** later. Kept in mind:

- The static site claims only the six pages + `/api/contact`; a portal can
  live at `/portal/` (same Pages project, more functions) or on a subdomain
  (e.g. `portal.ninetygroup.co.uk`, separate project) — nothing in the current
  structure blocks either.
- `robots.txt` already disallows `/api/`; add the portal path when it exists.
- The CSP in `_headers` applies site-wide (`/*`) and is strict — a portal
  with JS/app needs its own scoped header block.
- Auth, database etc. are entirely unbuilt; no assumptions baked in.

## State (2026-08-25)

Scaffold complete, git-initialised, **not yet pushed or deployed** — repo
creation, Pages project, Resend setup and domain attachment are Wes's manual
steps in DEPLOY.md. All copy is placeholder scaffolding awaiting real content
from Drew.
