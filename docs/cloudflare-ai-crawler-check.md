# Cloudflare AI Crawler Check

Date: 2026-08-16

## Repository Policy

The repository controls the public crawler intent through `robots.txt`.

Allowed for public search and retrieval:

- Googlebot
- Bingbot
- OAI-SearchBot
- ChatGPT-User
- Claude-SearchBot
- Claude-User
- PerplexityBot
- Perplexity-User

Blocked for model training or broader model use unless Fabian explicitly approves:

- GPTBot
- ClaudeBot
- Google-Extended

The generated `robots.txt` also contains:

```txt
Content-Signal: search=yes, ai-input=yes, ai-train=no, use=reference
```

This documents the intended split: public search and user-triggered retrieval are allowed, training is not.

## What The Repository Can Validate

The repository validates that relevant crawler user agents receive HTTP 200 on public routes and do not receive `noindex` in production mode.

Automated command:

```bash
npm run audit:seo -- https://ki-packt-an.de production
```

Preview deployments must return noindex:

```bash
npm run audit:seo -- https://<preview>.pages.dev preview
```

## Cloudflare Dashboard Checks

The exact Cloudflare dashboard state is not stored in this repository. Manually verify:

- WAF custom rules do not block Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, Claude-User, PerplexityBot or Perplexity-User.
- Bot Fight Mode or Super Bot Fight Mode does not challenge verified search/retrieval bots.
- AI Crawl Control reflects the intended split: retrieval/search allowed, training blocked.
- Managed robots.txt does not remove or contradict the repository-managed `robots.txt` entries.
- Rate limiting does not block normal crawler access to `/`, `/wissen/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt` or `/llms-full.txt`.
- Preview deployments keep `X-Robots-Tag: noindex, nofollow`.
- Production does not send `X-Robots-Tag: noindex`.

## Sources

- OpenAI crawlers: https://developers.openai.com/api/docs/bots
- Cloudflare AI Crawl Control: https://developers.cloudflare.com/ai-crawl-control/
- Google-Extended: https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers#google-extended
