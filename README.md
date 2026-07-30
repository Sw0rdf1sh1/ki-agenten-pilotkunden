# KI-Agenten Pilotkunden Landing Page

Static GitHub Pages landing page for Fabian Georgi's AI agent pilot offer.

## Positioning

- German-first landing page for pilot customers.
- Public offer as Fabian Georgi, sole proprietor.
- Uses CODIKI pricing anchors with a 50% pilot customer discount.
- Lead capture is intentionally static: the form opens an email to `hello@georgi.digital`.

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
The intended custom domain is:

```text
ki-agenten.georgi.digital
```

DNS must point that host to GitHub Pages before enabling the custom domain.
