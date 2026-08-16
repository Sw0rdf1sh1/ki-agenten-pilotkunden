# Entity Model

Date: 2026-08-16

## Current Public Entity Structure

The site should consistently express this relationship:

```text
Fabian Georgi / georgi.digital
  -> KI packt an
  -> future CODIKI transition
```

## JSON-LD IDs

Canonical website:

```text
https://ki-packt-an.de/#website
```

Current offer / provider entity:

```text
https://ki-packt-an.de/#organization
```

Although the schema type is `ProfessionalService`, the ID is kept stable as `#organization` because the site represents the current public service offer, not a separate legally claimed company entity.

Person:

```text
https://ki-packt-an.de/fabian-georgi/#person
```

This ID is reused as author, founder and visible technical contact.

## Current Publisher / Author Rule

- `Article.author` points to Fabian Georgi.
- `Article.publisher` points to the current `KI packt an` service entity.
- Service pages use the current provider entity.
- CODIKI is not represented as the current operating provider until Fabian explicitly approves that public transition.

## Future CODIKI Transition

When CODIKI becomes the public operating provider:

- add a distinct CODIKI organization entity with its own stable `@id`;
- keep Fabian Georgi as Person and author where accurate;
- update publisher/provider references in one controlled pass;
- avoid changing article URLs only for the entity transition;
- document the legal and editorial reason in this file.

## Public Profile Links

Currently used:

- https://georgi.digital/

No LinkedIn, GitHub or CODIKI URLs are invented in schema. Add only real, public, approved profiles.
