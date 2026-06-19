# High-Risk Content Audit

Audit inventory date: 2026-06-19

This audit classifies operational risk and provenance. It does not claim that live official-source verification was completed because source access was unavailable during the audit.

## Risk Classification

| Area | Records | Risk | Current status | Required handling |
| --- | ---: | --- | --- | --- |
| Emergency contacts | 10 | Critical | Source check required | Keep 112 primary; show sources and review status; recheck every 30 days |
| Official portals | 10 | High | Government-domain inventory | Recheck ownership, redirects, and availability every 90 days |
| Tourism places | 124 | High when operational | Variable information | Treat fees, timings, permits, closures, and access as indicative |
| Seasonal guidance | 8 regions | Medium | Planning guidance | Never present as live weather, road, tide, ferry, or forest status |
| Cultural guidance | Curated notes | Medium | Editorial guidance | Review for regional nuance and avoid presenting custom as universal law |
| Phrase translations | Curated phrases | High in SOS use | Human language review required | Avoid medical diagnosis or legal promises; keep source and target visible |

## Emergency Policy

- `112` is the single primary emergency action in the interface.
- Specialist and legacy short codes are secondary and may vary by network, jurisdiction, or service availability.
- Every displayed emergency contact links to an official verification portal.
- Cached records must show their audit date and must not imply live verification.

## Tourism Policy

- Exact prices and opening times should not be added without an official source and a review date.
- Existing timings and costs are labeled indicative.
- Restricted, forest, border, high-altitude, tide-dependent, and permit-controlled trips require confirmation before departure.
- Google Maps is for directions only and does not verify access, safety, opening, or legal permission.

## Review Schedule

- Emergency numbers: every 30 days and after any government service announcement.
- Tourism operational information: every 90 days and before peak travel seasons.
- Seasonal guidance: every 180 days, with live conditions checked by the traveller.
- Official links: automated link check in deployment CI when available.
