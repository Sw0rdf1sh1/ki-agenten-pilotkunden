# SEO, GEO/AEO and AI Search Report

Date: 2026-08-11

## Production Audit Before Changes

- Homepage `https://ki-packt-an.de/`: HTTP 200
- HTTP to HTTPS: `http://ki-packt-an.de/` returns 301 to `https://ki-packt-an.de/`
- www canonicalization: `https://www.ki-packt-an.de/` returned HTTP 200 before this change, not a redirect to the non-www canonical host
- Homepage title before change: `KI-Assistenten für Unternehmen | Einrichtung, Integration und Betrieb`
- Meta description before change: present, longer than the new target description
- Canonical before change: `https://ki-packt-an.de/`
- Meta robots before change: `index, follow`
- Open Graph before change: basic tags present, no dedicated social image dimensions
- Twitter/X Card before change: missing
- Favicon before change: inline SVG data URL
- `robots.txt` before change: allowed `*`, referenced the sitemap, included Cloudflare Managed Content and disallowed `GPTBot`; no explicit `OAI-SearchBot` block
- `sitemap.xml` before change: only homepage
- JSON-LD before change: single `Service` block
- hreflang: none
- Visible content without client-side JavaScript: available in static HTML
- 404 behavior before change: unknown URLs returned homepage HTML with HTTP 200
- Images before change: provider portrait had WebP `srcset`, fixed dimensions and alt text

## Implemented Architecture

The homepage remains the commercial entry point for `KI-Assistenten für Unternehmen`. Follow-up review showed that `/ki-assistenten-unternehmen/` competed too closely with the homepage, so the page was removed from the indexable architecture and redirected to `/`.

### New URLs

- `https://ki-packt-an.de/email-assistent/`
- `https://ki-packt-an.de/openclaw-fuer-unternehmen/`
- `https://ki-packt-an.de/ki-assistent-crm-erp/`
- `https://ki-packt-an.de/ki-assistent-betrieb-betreuung/`
- `https://ki-packt-an.de/wissen/`
- `https://ki-packt-an.de/wissen/was-ist-ein-ki-agent/`
- `https://ki-packt-an.de/wissen/ki-agenten-im-mittelstand/`
- `https://ki-packt-an.de/wissen/ki-email-assistent-sicher-einsetzen/`
- `https://ki-packt-an.de/wissen/ki-agent-kosten/`
- `https://ki-packt-an.de/wissen/ki-agent-sicherheit-prompt-injection/`
- `https://ki-packt-an.de/fabian-georgi/`

### Redirects

- `https://ki-packt-an.de/ki-assistenten-unternehmen/` -> `https://ki-packt-an.de/` (`301`)

## Metadata Overview

- Homepage title: `KI-Assistenten für Unternehmen | KI packt an`
- Homepage meta description: `KI-Assistenten für Unternehmen: Wir richten Agenten ein, verbinden E-Mail, CRM, ERP und Dokumente und betreuen den laufenden Betrieb.`
- Every indexable page has:
  - self-referencing canonical on `https://ki-packt-an.de/`
  - `index, follow` for production
  - individual title and description
  - Open Graph title, description, URL, site name and image
  - Twitter/X `summary_large_image`
  - one logical H1
  - crawlable static HTML content
  - JSON-LD

## Structured Data

Used Schema.org types:

- `WebSite`
- `ProfessionalService`
- `Person`
- `WebPage`
- `CollectionPage`
- `ProfilePage`
- `Service`
- `Article`
- `BreadcrumbList`

Not used:

- `Product`
- `AggregateRating`
- `Review`
- `Event`
- `JobPosting`
- fake testimonials, fake ratings or invented availability data

## robots.txt

```txt
User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Disallow: /

Sitemap: https://ki-packt-an.de/sitemap.xml
```

OpenAI crawler note: official OpenAI documentation distinguishes `OAI-SearchBot` for ChatGPT Search from `GPTBot` for model training. Allowing `GPTBot` is not required for appearance in ChatGPT Search; `OAI-SearchBot` must be crawlable and must also pass firewall/WAF rules.

## llms.txt

`/llms.txt` is implemented as a compact public Markdown overview. It links only to pages that exist in this branch and documents the service pages, knowledge pages, provider page and the ChatGPT Search crawler distinction.

`/llms-full.txt` is generated from public page content only. It does not include prompts, secrets, internal infrastructure details, form submissions or private data.

## Sitemap

Sitemap URL:

`https://ki-packt-an.de/sitemap.xml`

It contains 12 canonical indexable URLs and no preview, query parameter, redirect or noindex URLs.

## Validation Results

- `npm run build`: passed
- `npm run check`: passed for 12 indexable pages
- `npm run audit:seo -- http://127.0.0.1:4173 production`: passed for 12 routes
- `git diff --check`: passed
- Local HTTP checks: all 12 indexable pages plus `robots.txt`, `sitemap.xml`, `llms.txt` and `llms-full.txt` returned HTTP 200
- Internal static link check: passed
- JSON-LD parsing: passed for all generated pages
- Tidy HTML check: only warnings for modern attributes such as `loading`, `decoding` and `aria-current`
- Lighthouse local homepage mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100
- Lighthouse local homepage desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 100
- Lighthouse local service page desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 100
- Lighthouse local follow-up homepage mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100
- Lighthouse local follow-up costs article desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 100
- Lighthouse local follow-up OpenClaw page desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 100
- Lighthouse local Praxiswissen mobile: Performance 100, Accessibility 95, Best Practices 100, SEO 100
- JavaScript-free text rendering via `lynx`: core content is visible for homepage, service page and Prompt Injection article

## Preview And Indexing

- `_headers` contains a Cloudflare Pages preview rule for `https://*.pages.dev/*` with `X-Robots-Tag: noindex, nofollow`
- `functions/_middleware.js` injects `<meta name="robots" content="noindex,nofollow">` and `X-Robots-Tag: noindex, nofollow` for `.pages.dev` preview hosts
- `_redirects` contains a non-www canonical redirect from `https://www.ki-packt-an.de/*` to `https://ki-packt-an.de/:splat`
- Cloudflare Pages documentation states preview deployments include `X-Robots-Tag: noindex` by default.
- Pull Request preview checked after deployment:
  - `https://feature-seo-geo-ai-search.ki-agenten-pilotkunden.pages.dev/`
  - Homepage and representative subpages returned HTTP 200
  - `robots.txt`, `sitemap.xml`, `llms.txt` returned HTTP 200
  - Preview responses included `X-Robots-Tag: noindex`
  - Lighthouse Preview homepage mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 69
  - Lighthouse Preview service page desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 66
  - Preview SEO score is lower by design because the preview is blocked from indexing

## Manual Follow-up Outside The Repository

- Verify Cloudflare Pages preview URL returns `X-Robots-Tag: noindex`
- Verify production does not return `X-Robots-Tag: noindex`
- Verify Cloudflare redirect rule for `www.ki-packt-an.de` works after deployment
- Check Cloudflare Bot Fight Mode, WAF, rate limits, User-Agent blocks and IP rules for `OAI-SearchBot`
- Submit sitemap in Google Search Console
- Submit sitemap in Bing Webmaster Tools
- Run Google Rich Results Test on production URLs
- Run Schema.org Validator on production URLs
- Use Search Console URL Inspection for the most important new URLs

## Follow-up SEO/GEO Refinements

- Homepage now directly links all generated indexable subpages from the visible `Themen und Unterseiten` section.
- Knowledge articles were expanded beyond FAQ-length summaries:
  - `/wissen/ki-agent-kosten/` now includes real KI packt an prices with `zzgl. USt.`, eight cost blocks, three scenarios and underestimated cost drivers.
  - `/wissen/was-ist-ein-ki-agent/` now includes a comparison table, an enterprise e-mail example and a section explaining when classic automation is preferable.
  - `/wissen/ki-agent-sicherheit-prompt-injection/` now includes a concrete malicious e-mail example, defense-in-depth flow and technical controls.
  - `/wissen/ki-agenten-im-mittelstand/` and `/wissen/ki-email-assistent-sicher-einsetzen/` were expanded with process-selection and operational safety criteria.
- Technical pages were deepened:
  - `/openclaw-fuer-unternehmen/` now explains deployment architecture, Docker/server operation, secrets, agent roles, tools, monitoring, updates, backups, model providers and production operation.
  - `/ki-assistent-crm-erp/` now covers API vs. database access, webhooks, service accounts, OAuth scopes, rate limits, idempotency and audit trails.
  - `/ki-assistent-betrieb-betreuung/` now covers health checks, log monitoring, cost limits, token/API usage, model changes, regression tests, backups, recovery, secrets rotation and incident handling.
- Own technical diagrams were added as HTML/CSS:
  - E-mail assistant flow
  - Agent/e-mail classification flow
  - OpenClaw architecture
  - CRM/ERP integration flow
  - Prompt Injection defense-in-depth flow
- `FAQPage` markup was removed; visible FAQs remain where useful, but structured data focuses on WebPage, Service, Article, BreadcrumbList, Person and ProfessionalService.
- `scripts/audit-seo.mjs` was added for HTTP-based SEO regression checks in production and preview modes.

## Unterseiten- und Mobile-Navigation-Follow-up

Decision per subpage:

- `/`: kept as the primary commercial homepage for KI assistants in companies.
- `/ki-assistenten-unternehmen/`: removed from the indexable structure and redirected to `/` to avoid search-intent cannibalization.
- `/email-assistent/`: kept and repositioned around the visitor question: how a shared mailbox assistant would actually work.
- `/openclaw-fuer-unternehmen/`: kept and repositioned for technical buyers evaluating productive OpenClaw setup, hosting and operation.
- `/ki-assistent-crm-erp/`: kept and focused on controlled data access without full CRM/ERP access.
- `/ki-assistent-betrieb-betreuung/`: kept and focused on what happens after go-live: monitoring, regression tests, recovery and cost control.
- `/wissen/`: kept as `Praxiswissen`, with decision-oriented entry questions and a process-fit checklist.
- Knowledge articles: kept as practical decision resources, with visible author/date metadata and stronger takeaways.
- `/fabian-georgi/`: kept as a trust page explaining who builds and operates the solution.

Mobile navigation was rebuilt as an off-canvas drawer:

- Header shows the `KI packt an` wordmark and a compact menu button.
- Drawer width is `min(88vw, 380px)` and height is `100dvh`.
- The page background receives a dark backdrop.
- Body scroll is locked while the drawer is open.
- Drawer closes via close button, backdrop, Escape and link selection.
- Focus moves into the drawer on open and returns to the menu button on close.
- Focus trapping keeps keyboard navigation inside the drawer.
- `Leistungen` is an accordion with E-Mail-Assistent, OpenClaw, CRM & ERP and Betrieb & Betreuung.
- `Einsatz prüfen` is a dedicated drawer CTA instead of a regular text link.

Mobile browser checks:

- Widths checked: 320, 360, 375, 390, 430 and 768 px.
- Representative page screenshots were captured for Praxiswissen, E-Mail-Assistent, OpenClaw, CRM/ERP and Betrieb & Betreuung.
- H1 line counts at 390 px are now 3-4 lines for the tested subpages.
- Breadcrumbs are visually smaller on mobile and use `›`.
- Drawer accessibility checks covered `aria-expanded`, `aria-controls`, `aria-hidden`, Escape close, focus return, focus trap and body scroll lock.

## External Sources Checked

- OpenAI crawler documentation: `https://platform.openai.com/docs/bots`
- Cloudflare Pages preview deployment documentation: `https://developers.cloudflare.com/pages/configuration/preview-deployments/`
- Cloudflare Pages headers documentation: `https://developers.cloudflare.com/pages/configuration/headers/`
- OWASP GenAI Security Project, LLM01 Prompt Injection: `https://genai.owasp.org/llmrisk/llm01-prompt-injection/`

## 2026-08-15 Technical SEO/GEO Hardening Pass

- Added `/wissen/produktive-ki-agenten-openclaw-mittelstand/` as a cornerstone article for productive KI agents with OpenClaw in the German Mittelstand.
- The new article defines when a KI agent is production-ready, explains OpenClaw as an operating environment, covers internal-only customer systems, and names mandatory safety boundaries.
- `/openclaw-fuer-unternehmen/` now explicitly covers the case where CRM, ERP, databases, file servers or shop backends are only reachable inside the customer network.
- `robots.txt` now explicitly allows both `OAI-SearchBot` for ChatGPT Search and `ChatGPT-User` for user-triggered ChatGPT retrieval, while keeping `GPTBot` disallowed.
- Structured data now adds `knowsAbout` on the organization and person nodes and `about`/`keywords` on page and article nodes.
- Article `dateModified` was moved to `2026-08-15` and is checked in `npm run check`.
- `llms.txt` and `llms-full.txt` include the new cornerstone article and explicitly describe the OAI-SearchBot/ChatGPT-User/GPTBot distinction.
- `scripts/audit-seo.mjs` now validates crawler access for Googlebot, OAI-SearchBot and ChatGPT-User, JSON-LD type coverage, and current article review dates.
- Search Console cannot be queried from this repository alone. Validation remains: sitemap and URL inspection should be performed in Google Search Console after deployment.
