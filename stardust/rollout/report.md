# Rollout report — https://www.va.gov/ → aem-eds (2026-10-13)

```
rollout — www.va.gov → aem-eds (main--cd6de7e5--aemcoder.aem.live)
==================================================
Pages       5 total · 5 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale
Templates   2 (landing 1/1 · program 4/4)
Blocks      15 total · 15 converted · 0 pending
Quality     health 100/100 · open P1 0 / P2 0 / P3 0 (1 source-parity P2: index has no JSON-LD on the source either)
Pixel table prototypes 2/2 PASS (1440 + 360) · deployed 1440 5/5 PASS (pixel-only 5/5) · 360 5/5 via documented overrides (pixel-only 0/5) — gates/{prototypes,all}-{1440,360}/summary.md
To deliver  none
Content     0 pages awaiting content track
```

**What's missing:** nothing pending, stale or failed. The 360 official rows exceed the pixel bar only because gate-all shoots the origin headed and the EDS side headless; same-browser recaptures pass (2.79–8.4 %) and are recorded beside the official numbers in `stardust/replica/gates/all-360/overrides.json`.

**Optimize:** run-1 P2 4 (no JSON-LD on the 4 program hubs) → fixed in G-aem by carrying the source JSON-LD as a `JSON-LD` metadata row; run-2 P1 0 · P2 0 · P3 0.

**Links:** 89 out-of-scope links repointed to www.va.gov; 254 distinct hrefs, 0 × 404.

## Dynamic parity (from `stardust/qa/dynamics-report.md`, replayed on aem.live)

16 checks over 16 features · pass 16 · fail 0.

| feature | class | status | owner decision |
|---|---|---|---|
| header mega menu, mobile drawer, Crisis Line overlay, gov banner accordion | M | done | — |
| header search + home search box | S | interim | posts to www.va.gov/search/ until search is hosted on the new origin |
| home email signup (GovDelivery USVACHOOSE) | F | done | — |
| sign in / My VA | X | interim | links to www.va.gov/sign-in |
| language assistance links | I18N | interim | links to the Spanish resources on www.va.gov |
| /v0/banners site alert | A | interim | API tier for the target host |
| tags + analytics (GTM, GA/Ads, DAP, Siteimprove, Datadog …) | T | scaffolded-awaiting-owner | consent-gated; owner enables per vendor |
| Medallia onsite feedback | D | scaffolded-awaiting-owner | feedback survey vendor on the new host |
| /v0/feature_toggles | A | interim | API tier for the target host |
| all 5 pages boot without uncaught exceptions | CR | done | — |
