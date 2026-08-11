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

The homepage remains the commercial entry point. The new SEO/GEO architecture adds dedicated pages for specific search intent instead of inflating the homepage.

### New URLs

- `https://ki-packt-an.de/ki-assistenten-unternehmen/`
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
- `FAQPage` only where visible FAQ content exists

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

It contains 13 canonical indexable URLs and no preview, query parameter, redirect or noindex URLs.

## Validation Results

- `npm run build`: passed
- `npm run check`: passed for 13 indexable pages
- `git diff --check`: passed
- Local HTTP checks: all 13 pages plus `robots.txt`, `sitemap.xml`, `llms.txt` and `llms-full.txt` returned HTTP 200
- Internal static link check: passed
- JSON-LD parsing: passed for all generated pages
- Tidy HTML check: only warnings for modern attributes such as `loading`, `decoding` and `aria-current`
- Lighthouse local homepage mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100
- Lighthouse local homepage desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 100
- Lighthouse local service page desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 100
- JavaScript-free text rendering via `lynx`: core content is visible for homepage, service page and Prompt Injection article

## Preview And Indexing

- `_headers` contains a Cloudflare Pages preview rule for `https://*.pages.dev/*` with `X-Robots-Tag: noindex, nofollow`
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

## External Sources Checked

- OpenAI crawler documentation: `https://platform.openai.com/docs/bots`
- Cloudflare Pages preview deployment documentation: `https://developers.cloudflare.com/pages/configuration/preview-deployments/`
- Cloudflare Pages headers documentation: `https://developers.cloudflare.com/pages/configuration/headers/`
- OWASP GenAI Security Project, LLM01 Prompt Injection: `https://genai.owasp.org/llmrisk/llm01-prompt-injection/`
