# Authority Roadmap

Date: 2026-08-16

## Principle

`ki-packt-an.de` should not become a generic AI SEO site. Authority should come from technical clarity, reproducible tests, concrete architectures and honest operational limits.

## Existing Cluster

- Homepage: commercial entry point for KI assistants in companies.
- `/email-assistent/`: practical low-friction entry process.
- `/openclaw-fuer-unternehmen/`: OpenClaw hub for productive company use.
- `/ki-assistent-crm-erp/`: controlled CRM/ERP integration.
- `/ki-assistent-betrieb-betreuung/`: operation after go-live.
- `/wissen/`: knowledge hub.

## New OpenClaw Authority Articles

- `/wissen/openclaw-sicher-betreiben/`
- `/wissen/openclaw-microsoft-365-oauth-email/`
- `/wissen/openclaw-selbst-hosten-docker-backup-monitoring/`
- `/wissen/openclaw-dsgvo-datenfluesse-modelle-unternehmensdaten/`

These articles are linked from the OpenClaw hub and from relevant service/knowledge pages.

## Original Research

Implemented first research article:

- `/wissen/prompt-injection-test-ki-agent-email/`

Measured source:

- `scripts/prompt-injection-research.mjs`
- `docs/prompt-injection-research-results.json`

The first test intentionally reports limitations: it measured a deterministic pre-tool safety layer, not a live model.

## Next Research Candidates

Only publish when measured with real data:

- work saved by a KI email assistant;
- human-review rate by case category;
- token and API cost per handled mailbox event;
- false-positive and false-negative rates after expanding the prompt-injection corpus.

## Editorial Rules

- No fake statistics.
- No invented customer references.
- No internal strategy labels on public pages.
- No mass-produced keyword variants.
- Prefer primary technical sources.
- Keep each article independently quotable with concrete claims.
