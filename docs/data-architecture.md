# Data Architecture

## Principle

Pages consume repository functions, not raw content arrays. Raw files remain authoring sources; repositories normalize their different shapes into stable records for the UI.

## Repositories

### Tourism

`src/data/repositories/tourismRepository.js`

- Combines core, hidden, and regional expansion records into one catalog.
- Normalizes regions, access, category, hidden status, and detail keys.
- Resolves names, descriptions, timing, fees, official sources, and map links.
- Exposes region options, category options, ID lookup, and filtered queries.
- Adds a normalized `route` profile to every destination: access type, validated destination/trailhead points, readiness, and validation errors.

### Route access (Phase 1)

`src/data/routeAccess.js`

- Classifies every destination as `road_accessible`, `trek_only`, or `road_then_trek`.
- Validates coordinates against the supported West Bengal and Sikkim coverage box.
- Refuses to mark a destination live-route-ready until its required destination or trailhead coordinates exist.
- Keeps explicit access exceptions in one auditable override table; Buxa currently uses `road_then_trek`.

Author a road destination like this:

```js
route: {
  accessType: 'road_accessible',
  destination: { lat: 26.7271, lng: 88.3953 },
}
```

For a mixed road and walking destination, also supply the point where road routing must stop:

```js
route: {
  accessType: 'road_then_trek',
  destination: { lat: 26.75, lng: 89.58 },
  trailhead: { lat: 26.72, lng: 89.56 },
}
```

### Phrases

`src/data/repositories/phraseRepository.js`

- Indexes phrases and location contexts by ID.
- Resolves location recommendations without repeated array scans.
- Provides category/search queries and emergency-group matching.
- Every phrase has one `translations` object containing `en`, `bn`, `ne`, and `hi`.

### Emergency

`src/data/repositories/emergencyRepository.js`

- Filters contacts and official sites by geographic scope.
- Joins each emergency contact with its provenance URL.

## Required Shapes

Tourism records require `id`, `name`, `type`, a valid region, Bengali/Nepali/Hindi descriptions, an English description or fallback, and timing/fee detail fallbacks.

Phrase records require a unique ID, valid category, and translations for English, Bengali, Nepali, and Hindi. Location contexts may reference only existing phrase and category IDs.

Emergency contacts require a unique ID, dialable number, four-language name and description, and an HTTPS official-source mapping.

## Validation

Run:

```bash
npm run validate:data
```

Validation also runs automatically before every production build. Broken IDs, references, localized fields, operational details, or provenance links fail the build.
