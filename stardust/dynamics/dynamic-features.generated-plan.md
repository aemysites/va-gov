<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-13T17:13:24.776Z · input stardust/current/_dynamics.json (2 pages, 20 findings) · target probe main--cd6de7e5--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-first-party-api-get-v0-feature-toggles | A | first-party API GET /v0/feature_toggles | 2/2 (reach 5/5) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (Failed to parse URL from main--cd6de7e5--aemcoder.aem.page/v0/feature_toggles)** |
| 2 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 2/2 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | a-unknown-third-party-host-browser-intake-ddog-gov-com | A | unknown third-party host browser-intake-ddog-gov.com | 1/2 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-first-party-api-get-v0-banners | A | first-party API GET /v0/banners/ | 1/2 (reach 1/5) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (Failed to parse URL from main--cd6de7e5--aemcoder.aem.page/v0/banners/)** |
| 5 | a-cms-app-settings-object-next-data | A | CMS / app settings object __NEXT_DATA__ | 1/2 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 6 | cr-client-framework-next | CR | client framework next | 1/2 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 7 | d-first-party-data-file-get-wdcvoice-n-onsite-onsitedata1791 | D | first-party data file GET /wdcvoice/{n}/onsite/onsiteData1791897796293.json | 1/2 (reach 5/5) | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (Failed to parse URL from main--cd6de7e5--aemcoder.aem.page/wdcvoice/1/onsite/ons)** |
| 8 | i18n-locale-variants-my-va | I18N | locale variants my-va | 2/2 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 9 | m-modal-trigger-va-overlay-trigger-chrome-only-button-conten | M | modal trigger va-overlay-trigger (chrome only) → button:content | 2/2 | rebuild-native | self | delivered-by-capture | chrome-interaction | none (the header contract is the spec) | output already carries "Veterans Crisis Line" |
| 10 | m-modal-trigger-aria-haspopup-chrome-only-div-content | M | modal trigger aria-haspopup (chrome only) → div:content | 2/2 (reach 10/5) | rebuild-native | self | delivered-by-capture | chrome-interaction | none (the header contract is the spec) | output already carries "VA Benefits and Health Care" |
| 11 | t-unknown-third-party-host-dap-digitalgov-gov | T | unknown third-party host dap.digitalgov.gov | 2/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 12 | t-unknown-third-party-host-prod-va-gov-assets-s3-us-gov-west | T | unknown third-party host prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com | 2/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 13 | t-unknown-third-party-host-s3-us-gov-west-1-amazonaws-com | T | unknown third-party host s3-us-gov-west-1.amazonaws.com | 2/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 14 | t-unknown-third-party-host-dsva-vagov-prod-cms-files-s3-us-g | T | unknown third-party host dsva-vagov-prod-cms-files.s3.us-gov-west-1.amazonaws.com | 2/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 15 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 2/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 16 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 2/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 17 | t-third-party-mount-div-data-widget-type-tag-manager-injecte | T | third-party mount <div data-widget-type> (tag-manager-injected widget) | 1/2 | embed-passthrough | needs-credential | pending | embed-passthrough | vendor account ids stay the owner's |  |
| 18 | t-unknown-third-party-host-siteimproveanalytics-com | T | unknown third-party host siteimproveanalytics.com | 1/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 19 | t-unknown-third-party-host-6319010-global-r2-siteimproveanal | T | unknown third-party host 6319010.global.r2.siteimproveanalytics.io | 1/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 20 | x-sign-in-account-links | X | sign-in / account links | 2/2 | decided-out | needs-backend | delivered-by-capture | decided-out | auth / commerce on the new host? | output already carries "https://public.govdelivery.com/accounts/" |

## Triage

- **Ships autonomously (reproducibility `self`):** 4 row(s) — read-settings, settled-dom-snapshot, sheet-sync.
- **One owner decision batch:** 13 row(s) — which tier for the target host; consumer on the migrated pages? · inspect the XHR, add a vendor row · scope of the locale trees · which tags run on the new host; property ids · vendor account ids stay the owner's.
- **Already delivered by the capture pipeline:** 3 row(s) — no work.
- **Host-bound on the target:** 3 of 3 probed API paths — the off-origin data work.

## Phases

- **tags** — 8
- **detect** — 3
- **off-origin data** — 2
- **interactive** — 2
- **capture** — 1
- **data** — 1
- **locale wave** — 1
- **embeds** — 1
- **register** — 1
