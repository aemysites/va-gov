# Dynamics parity check — https://main--cd6de7e5--aemcoder.aem.live — 2026-10-13T20:09:24.899Z

Replayed 16 checks over 16 features · pass 16 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| header mega menu | M | done | dom-count | PASS | 2 × header .lvl1 (min 1) |  |
| header mega menu | M | done | dom-count | PASS | 9 × header .vetnav-level2 (min 9) |  |
| mobile menu drawer | M | done | dom-count | PASS | 1 × header .m-menu-btn (min 1) |  |
| mobile menu drawer | M | done | dom-count | PASS | 12 × header .m-hub (min 9) |  |
| Veterans Crisis Line overlay | M | done | dom-count | PASS | 2 × header .crisis-open (min 2) |  |
| Veterans Crisis Line overlay | M | done | dom-count | PASS | 1 × #crisis-modal[role=dialog] #crisis-title (min 1) |  |
| gov banner "Here’s how you know" accordion | M | done | dom-count | PASS | 2 × header .gov-toggle[aria-controls] (min 2) |  |
| header search + home search box | S | interim | dom-count | PASS | 1 × form.d-search-form[action="https://www.va.gov/search/"] (min 1) |  |
| header search + home search box | S | interim | dom-count | PASS | 1 × form.home-tasks-search[action="https://www.va.gov/search/"] (min 1) |  |
| home email signup (GovDelivery USVACHOOSE) | F | done | dom-count | PASS | 1 × form.email-signup-form[action*="govdelivery.com/accounts/USVACHOOSE/subscribers/qualify"][method=post] input[name=email][required] (min 1) |  |
| sign in / My VA | X | interim | dom-count | PASS | 3 × a[href="https://www.va.gov/sign-in"] (min 1) |  |
| language assistance links | I18N | interim | dom-count | PASS | 2 × a[href="https://www.va.gov/asistencia-y-recursos-en-espanol"] (min 1) |  |
| /v0/banners (site alert) | A | interim | dom-count | PASS | 1 × .site-alert (min 1) |  |
| tags + analytics (GTM, GA/Ads, DAP, Siteimprove, Datadog intake, tag-manager widget mount, S3 asset hosts — 10 detect rows) | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 14 gated host pattern(s) before consent |  |
| tags + analytics (GTM, GA/Ads, DAP, Siteimprove, Datadog intake, tag-manager widget mount, S3 asset hosts — 10 detect rows) | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 14 gated host pattern(s) before consent |  |
| all 5 pages boot without uncaught exceptions | CR | done | no-page-errors | PASS | none on 5 page(s) |  |

## Features without checks

- /v0/feature_toggles (A) — interim · owner: API tier for the target host
- dataLayer (A) — done
- __NEXT_DATA__ (A) — done
- Next.js client framework (CR) — done
- Medallia onsite feedback (D) — scaffolded-awaiting-owner · owner: feedback survey vendor on the new host
