# SEO/GEO Audit

Date: 2026-08-16

## Before

The previous merged state already had a strong SEO/GEO base:

- 13 indexable pages.
- Static HTML content.
- Canonicals, sitemap, social metadata and JSON-LD.
- OpenAI retrieval distinction for OAI-SearchBot, ChatGPT-User and GPTBot.
- `llms.txt` and `llms-full.txt`.
- Preview noindex protection.

## Changes

### Crawler Policy

`robots.txt` now explicitly documents a broader retrieval/search split:

- OAI-SearchBot allowed.
- ChatGPT-User allowed.
- GPTBot blocked.
- Claude-SearchBot allowed.
- Claude-User allowed.
- ClaudeBot blocked.
- PerplexityBot allowed.
- Perplexity-User allowed.
- Google-Extended blocked.
- Content signal added for search/reference use while keeping AI training blocked.

Reason: public search and user-triggered retrieval should work; model training should remain blocked unless Fabian explicitly approves it.

### Authority Content

Added OpenClaw authority pages:

- `/wissen/openclaw-sicher-betreiben/`
- `/wissen/openclaw-microsoft-365-oauth-email/`
- `/wissen/openclaw-selbst-hosten-docker-backup-monitoring/`
- `/wissen/openclaw-dsgvo-datenfluesse-modelle-unternehmensdaten/`

Added original research page:

- `/wissen/prompt-injection-test-ki-agent-email/`

### Original Research

Created reproducible test script:

```bash
npm run research:prompt-injection
```

Measured result:

- 20 total test cases.
- 15 attack cases.
- 5 benign cases.
- 12 correctly blocked attack cases.
- 0 false positives.
- 3 false negatives.
- 80 percent block rate.

The article clearly states that this measured the deterministic pre-tool policy layer and not a live LLM.

### Structured Data

All generated pages continue to include:

- `WebSite`
- `ProfessionalService`
- `Person`
- page type (`WebPage`, `CollectionPage` or `ProfilePage`)
- `Article` for knowledge articles
- `BreadcrumbList` for deeper pages
- `Service` for service pages

Article `dateModified` is now `2026-08-16`.

### Documentation

Added:

- `docs/cloudflare-ai-crawler-check.md`
- `docs/entity-model.md`
- `docs/google-search-console-checklist.md`
- `docs/authority-roadmap.md`
- `docs/seo-geo-audit.md`

## Validation Plan

Run locally:

```bash
npm run research:prompt-injection
npm run build
npm run check
npm run audit:seo -- http://127.0.0.1:4173 production
git diff --check
```

Run after Cloudflare Preview is available:

```bash
npm run audit:seo -- https://<preview>.pages.dev preview
```

## Manual Follow-Up

- Check Cloudflare AI Crawl Control/WAF dashboard manually.
- Check Google Search Console after production deployment.
- Resubmit sitemap and inspect new cornerstone/research URLs.
