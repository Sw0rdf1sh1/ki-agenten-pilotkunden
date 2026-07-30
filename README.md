# KI packt an Landing Page

Static GitHub Pages landing page for Fabian Georgi's `KI packt an` pilot offer.

## Positioning

- German-first landing page for practical AI assistant pilots under `ki-packt-an.de`.
- Public offer as Fabian Georgi, sole proprietor.
- Uses CODIKI pricing anchors with a 50% pilot customer discount.
- Lead capture is intentionally static: the form opens an email to `hello@georgi.digital`.
- `ki-im-team.de` and `ki-mitdenker.de` are reserved as later redirect domains.
- Messaging focuses on controlled AI assistance for real workflows, not autonomous black-box agents.

## Local Preview

```bash
python3 -m http.server 8080
```

Open `http://127.0.0.1:8080`.

## Validation

```bash
npm run check
```

## Deployment

The repository deploys through GitHub Pages using `.github/workflows/pages.yml`.
The primary domain is:

```text
https://ki-packt-an.de/
```

The fallback GitHub Pages URL is:

```text
https://sw0rdf1sh1.github.io/ki-agenten-pilotkunden/
```

DNS must point `ki-packt-an.de` to GitHub Pages before the custom domain can serve traffic.
