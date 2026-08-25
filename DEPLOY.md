# DEPLOY.md — Ninety Utilities Ltd website

Ordered manual steps. Everything here is done by you (Wes) in GitHub,
Cloudflare and Resend dashboards — nothing is automated.

---

## ⚠ Before anything: DNS records that must NOT be touched

Both `ninetygroup.co.uk` and `nine-ty.co.uk` are already carrying live,
authenticated Microsoft 365 email. The following existing records must not be
modified, deleted or "cleaned up" at any point during this deployment:

- **MX** records (mail routing)
- **autodiscover** CNAME
- **SPF** TXT record on the root (`v=spf1 …`)
- **DKIM** CNAMEs (`selector1._domainkey`, `selector2._domainkey`)
- **DMARC** TXT (`_dmarc`, currently `p=none`)

Every step below only **adds** records. If any dashboard flow offers to
"replace existing records", decline it.

---

## 1. Create the GitHub repo and push

```bash
cd ~/Projects/Claude/Ninety
git add -A
git commit -m "Initial site scaffold"
gh repo create ninety-utilities-site --private --source . --push
```

(Or create the repo in the GitHub UI and `git remote add origin … && git push -u origin main`.)

## 2. Create the Cloudflare Pages project

1. Cloudflare dashboard → **Workers & Pages → Create → Pages →
   Connect to Git** → select `ninety-utilities-site`.
2. Build settings: **Framework preset: None**, build command **empty**,
   output directory **`/`** (repo root). No build step exists.
3. Deploy. Verify the site at the `*.pages.dev` URL, including `/404` and the
   contact page rendering (the form won't send yet — env vars come in step 4).

## 3. Set up Resend for the contact form

1. Create/sign in to Resend → **Domains → Add domain** → `ninetygroup.co.uk`.
2. Resend will show DNS records to add. These are **additive** and safe, but
   check them against the list at the top before saving:
   - A TXT + CNAME pair on a **subdomain** Resend specifies for DKIM
     (e.g. `resend._domainkey`) — fine, it does not collide with the
     Microsoft `selector1`/`selector2` DKIM records.
   - An MX + TXT (SPF) on a **send subdomain** (e.g. `send.ninetygroup.co.uk`)
     — fine, it is on a subdomain, **not** the root. Do **not** add or edit
     any SPF/MX on the root domain itself.
3. Wait for the domain to verify in Resend, then create an **API key**
   (sending access only).

## 4. Set the Pages environment variables

Cloudflare Pages project → **Settings → Variables and Secrets** (Production):

| Name | Value | Type |
|---|---|---|
| `RESEND_API_KEY` | the key from step 3 | **Secret** |
| `CONTACT_TO` | `info@ninetygroup.co.uk` | Plain text |
| `CONTACT_FROM` | `website@ninetygroup.co.uk` (or any address on the verified domain — it does not need a mailbox) | Plain text |

Redeploy (Deployments → Retry) so the function picks them up, then test the
form end-to-end on the `*.pages.dev` URL and confirm the email lands in
`info@`.

## 5. Attach the custom domain

1. Pages project → **Custom domains → Add** → `ninetygroup.co.uk`.
   Cloudflare adds the apex record itself (a CNAME-flattened record) since DNS
   is already on Cloudflare. This adds one record; it does not touch MX/TXT.
2. Repeat for `www.ninetygroup.co.uk`.
3. Verify `https://ninetygroup.co.uk` and `https://www.ninetygroup.co.uk`
   both serve the site over HTTPS.

## 6. Redirect nine-ty.co.uk → ninetygroup.co.uk

Do this as a Redirect Rule on the `nine-ty.co.uk` zone (not by pointing it at
Pages):

1. `nine-ty.co.uk` zone → **DNS**: add a **proxied** (orange-cloud) `A` record
   for `@` pointing to `192.0.2.1` and a proxied `CNAME` `www` →
   `nine-ty.co.uk`. (The dummy IP is fine — the redirect rule fires at the
   edge before any origin is contacted. Add these; change nothing else, and
   leave all mail records alone.)
2. Same zone → **Rules → Redirect Rules → Create**:
   - When: **Hostname** *contains* `nine-ty.co.uk` — or expression:
     `(http.host eq "nine-ty.co.uk") or (http.host eq "www.nine-ty.co.uk")`
   - Then: **Dynamic** redirect, expression
     `concat("https://ninetygroup.co.uk", http.request.uri.path)`,
     status **301**, preserve query string **on**.
3. Test: `curl -I https://nine-ty.co.uk/about.html` → expect
   `301` with `Location: https://ninetygroup.co.uk/about.html`.

## 7. Post-launch checks

- [ ] Form submits and lands in info@ (check spam folder first time).
- [ ] `#sent` / `#error` messages display (test with JS disabled too).
- [ ] 404 page serves on a bad URL on the custom domain.
- [ ] `https://ninetygroup.co.uk/sitemap.xml` and `/robots.txt` serve.
- [ ] Send/receive a normal email to confirm M365 mail is unaffected.
- [ ] Optional: submit the sitemap in Google Search Console (verify the
      domain via a **TXT record Google specifies** — additive, safe).

## Before go-live content checklist

- [ ] Replace every `[PROVIDE: …]` placeholder in the HTML.
- [ ] Statutory footer: company number, place of registration, registered
      office — on **every** page (it's duplicated per file).
- [ ] Privacy notice: retention period + "last updated" date.
- [ ] Phone number (or remove the phone rows until one exists).
- [ ] Confirm NO accreditation logo/name is live without a held certificate.
