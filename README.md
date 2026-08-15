# KI packt an Landing Page

Static GitHub Pages landing page for Fabian Georgi's `KI packt an` pilot offer.

## Positioning

- German-first landing page for practical AI assistant pilots under `ki-packt-an.de`.
- Public offer as Fabian Georgi, sole proprietor.
- Uses CODIKI pricing anchors with a 50% pilot customer discount.
- Lead capture uses a Cloudflare Pages Function at `/api/contact` and sends email through Resend.
- `ki-im-team.de` and `ki-mitdenker.de` are reserved as later redirect domains.
- Messaging focuses on controlled AI assistance for real workflows, not autonomous black-box agents.

## Local Preview

```bash
python3 -m http.server 8080
```

Open `http://127.0.0.1:8080`.

The local static preview does not execute Cloudflare Pages Functions. Use Cloudflare Pages branch previews
or `wrangler pages dev` when the contact endpoint needs to be tested locally.

## Local Editing With Lando

```bash
lando start
```

Open `https://ki-agenten-pilotkunden.lndo.site`.

The Lando appserver uses Node 20, runs `npm install --no-package-lock`, builds the static pages with `npm run build`,
and serves the repository through the local static server on port `8080`.

Useful commands:

```bash
lando npm install
lando build
lando check
lando audit-seo
```

## Validation

```bash
npm run check
```

## Contact Form

The contact form is handled by `functions/api/contact.js`.

Cloudflare Pages environment variables/secrets:

```text
RESEND_API_KEY=<secret>
CONTACT_FROM_EMAIL=KI packt an <leads@ki-packt-an.de>
CONTACT_TO_EMAIL=hello@georgi.digital
```

`CONTACT_TO_EMAIL` is optional and defaults to `hello@georgi.digital`. The sender domain used in
`CONTACT_FROM_EMAIL` must be verified in Resend before production mail can be delivered reliably.

## Deployment

The repository deploys through Cloudflare Pages.
The primary domain is:

```text
https://ki-packt-an.de/
```

Use branch previews to test pull requests before merging.
