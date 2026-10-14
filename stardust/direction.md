---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-13T16:26:37Z
  againstInput: https://www.va.gov/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.va.gov/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-10-13T16:26:37Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Decision: out-of-scope internal links → source site (SCOPE EXTENSION, rollout E2-link-audit)

Decided 2026-10-13 (hands-off). The declared scope is exactly 5 pages (`/`, `/health-care`,
`/housing-assistance`, `/life-insurance`, `/family-and-caregiver-benefits`); `stardust/state.json` holds
those 5 rows and `site.captureGaps` is empty, so every other va.gov target is outside the declared caps —
SCOPE EXTENSION, repointed regardless of count, never delivered.

- Rule: a root-relative href whose path is not one of the 5 pages is rewritten to the absolute source URL
  `https://www.va.gov<path>` (query/fragment and trailing slash kept). Links among the 5 pages stay
  root-relative and extensionless. Chrome docs (`/nav`, `/footer`) already followed the rule (in-scope
  root-relative, everything else absolute) and were not changed.
- Repointed: **89 hrefs, 71 distinct targets** across the 5 page docs (index 17, health-care 30,
  housing-assistance 23, life-insurance 10, family-and-caregiver-benefits 9). Sample:
  `/health-care/eligibility`, `/health-care/how-to-apply`, `/housing-assistance/home-loans/loan-types`,
  `/life-insurance/options-eligibility`, `/family-and-caregiver-benefits/survivor-compensation`,
  `/resources/homeless-help`, `/claim-or-appeal-status`, `/disability`, `/education`, `/records`.
  Full list: `stardust/.work/rollout/e2/repoint.json`.
- Every href in the 5 pages + nav + footer was GET-checked (254 distinct, 253 < 400; the one exception is
  `https://www.facebook.com/VeteransAffairs` answering 400 to non-browser clients — external, same href
  as the source, not a 404). Redeployed via deploy-batch (`stardust/deploy/ledger-e2.json`).
