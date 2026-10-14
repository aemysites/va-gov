# Dynamic features — VA.gov replica (5 pages)

Source: `stardust/current/_dynamics.json` (detect on `/` and `/health-care/`, reach from the crawl) and
`stardust/dynamics/dynamic-features.generated-plan.{md,json}` (23 rows, target origin
`main--cd6de7e5--aemcoder.aem.page`). Every row has a disposition; the static recreation continues regardless.

## Listings contract
None — no listing, card feed or query-index-fed band exists on the 5 pages in scope.

## Features

| id | class | feature | disposition | reproducibility | status / interim tier |
|---|---|---|---|---|---|
| chrome-menu | M | header mega menu (3 hover menus at 1440) | rebuild-native | self | ships in header block; header contract is the spec |
| chrome-drawer | M | mobile menu drawer (drill-down) | rebuild-native | self | ships in header block |
| m-…-va-overlay-trigger | M | Veterans Crisis Line overlay (header strip button) | rebuild-native | self | ships: modal with the captured crisis-line content |
| m-…-aria-haspopup | M | gov-banner "Here’s how you know" accordion | rebuild-native | self | ships in header block |
| chrome-search | S | header search + home "Search" box | embed-passthrough | self | interim: submits to the source site search `https://www.va.gov/search/?query=` (the source search covers all of VA.gov; an index over 5 migrated pages would be a regression). Decision named: **search backend on the new host**. |
| form-email-signup | F | home "Sign up to get the latest VA updates" (GovDelivery `USVACHOOSE` qualify POST) | embed-passthrough | self | form posts to the same GovDelivery action as the source; no PII stored on the new host |
| x-sign-in-account-links | X | Sign in / My VA / My HealtheVet | link-out (interim) | needs-backend | interim: links/button to the VA.gov sign-in at the source origin. Decision named: **authentication on the new host** (not decided-out — owner decision pending) |
| a-…-feature-toggles, a-…-banners | A | `/v0/feature_toggles`, `/v0/banners/` (host-bound on target) | static-snapshot | needs-business-decision | interim: the captured state is rendered statically (banners as captured). Decision named: **API tier for the target host** |
| a-…-datalayer, a-…-next-data, cr-client-framework-next | A/CR | Next.js data + dataLayer | static-snapshot | self | content rendered statically; framework not ported |
| d-…-wdcvoice-onsite | D | Medallia/onsite feedback data (Feedback button) | embed-passthrough | needs-business-decision | interim: Feedback button rendered, no survey wired. Decision named: **feedback survey vendor on the new host** |
| i18n-locale-variants-my-va | I18N | language assistance links (Español, Tagalog, other) | link-out | needs-business-decision | links point to the source-language pages on VA.gov (out of scope for this 5-page run) |
| t-* (GTM, GA/DAP, Siteimprove, Datadog intake, S3 asset hosts) | T/A | tags and analytics | embed-passthrough | needs-business-decision | scaffolded OFF (martech only on request). S3 asset hosts: assets self-hosted on the new site. Decision named: **which tags run on the new host** |

## Decision batch (owner)
1. Search backend on the new host (interim: source-site search passthrough).
2. Authentication / account on the new host (interim: link-out to VA.gov sign-in).
3. API tier for feature toggles and banners (interim: captured static state).
4. Feedback survey vendor (interim: button rendered, not wired).
5. Tags and analytics on the new host (interim: none).
6. Locale scope (interim: language links to the source).

## Register
No design deltas — dynamic interim tiers are behaviour, not design.
