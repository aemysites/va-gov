# Dynamic features — detected (2026-10-13T17:12:58.719Z)

Pages probed: /, /health-care/ · settle 5000 ms · width 1440 · reach from 5/5 crawled pages

Evidence only. Every row must receive a disposition in `stardust/dynamic-features.md` (`dynamics-plan.mjs` drafts it).

| id | class | feature | pages | reach | evidence | hint |
|---|---|---|---|---|---|---|
| a-first-party-api-get-v0-feature-toggles | A API / personalisation / settings | first-party API GET /v0/feature_toggles | 2/2 | 5/5 | GET /v0/feature_toggles?cookie_id → 200 | api |
| a-cms-app-settings-object-datalayer | A API / personalisation / settings | CMS / app settings object dataLayer | 2/2 |  |  | settings |
| a-unknown-third-party-host-browser-intake-ddog-gov-com | A API / personalisation / settings | unknown third-party host browser-intake-ddog-gov.com | 1/2 |  | browser-intake-ddog-gov.com | inspect |
| a-first-party-api-get-v0-banners | A API / personalisation / settings | first-party API GET /v0/banners/ | 1/2 | 1/5 | GET /v0/banners/?path → 200 | api |
| a-cms-app-settings-object-next-data | A API / personalisation / settings | CMS / app settings object __NEXT_DATA__ | 1/2 |  |  | settings |
| cr-client-framework-next | CR client-rendered | client framework next | 1/2 |  |  | framework |
| d-first-party-data-file-get-wdcvoice-n-onsite-onsitedata1791 | D sheet / data file | first-party data file GET /wdcvoice/{n}/onsite/onsiteData1791897796293.json | 1/2 | 5/5 | GET /wdcvoice/{n}/onsite/onsiteData1791897796293.json → 200 | data |
| i18n-locale-variants-my-va | I18N locale | locale variants my-va | 2/2 |  | https://www.va.gov/my-va/ | locale |
| m-modal-trigger-va-overlay-trigger-chrome-only-button-conten | M modal / interactive | modal trigger va-overlay-trigger (chrome only) → button:content | 2/2 |  | Talk to the Veterans Crisis Line now<br>Veterans Crisis Line | chrome-interaction |
| m-modal-trigger-aria-haspopup-chrome-only-div-content | M modal / interactive | modal trigger aria-haspopup (chrome only) → div:content | 2/2 | 10/5 | VA Benefits and Health Care<br>About VA | chrome-interaction |
| t-unknown-third-party-host-dap-digitalgov-gov | T tag / consent | unknown third-party host dap.digitalgov.gov | 2/2 |  | dap.digitalgov.gov | inspect |
| t-unknown-third-party-host-prod-va-gov-assets-s3-us-gov-west | T tag / consent | unknown third-party host prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com | 2/2 |  | prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com | inspect |
| t-unknown-third-party-host-s3-us-gov-west-1-amazonaws-com | T tag / consent | unknown third-party host s3-us-gov-west-1.amazonaws.com | 2/2 |  | s3-us-gov-west-1.amazonaws.com | inspect |
| t-unknown-third-party-host-dsva-vagov-prod-cms-files-s3-us-g | T tag / consent | unknown third-party host dsva-vagov-prod-cms-files.s3.us-gov-west-1.amazonaws.com | 2/2 |  | dsva-vagov-prod-cms-files.s3.us-gov-west-1.amazonaws.com | inspect |
| t-tag-manager-google-tag-manager | T tag / consent | tag manager: Google Tag Manager | 2/2 |  | www.googletagmanager.com | tags |
| t-analytics-google-analytics-ads | T tag / consent | analytics: Google Analytics / Ads | 2/2 |  | www.google-analytics.com | tags |
| t-third-party-mount-div-data-widget-type-tag-manager-injecte | T tag / consent | third-party mount <div data-widget-type> (tag-manager-injected widget) | 1/2 |  | data-widget-type | tags |
| t-unknown-third-party-host-siteimproveanalytics-com | T tag / consent | unknown third-party host siteimproveanalytics.com | 1/2 |  | siteimproveanalytics.com | inspect |
| t-unknown-third-party-host-6319010-global-r2-siteimproveanal | T tag / consent | unknown third-party host 6319010.global.r2.siteimproveanalytics.io | 1/2 |  | 6319010.global.r2.siteimproveanalytics.io | inspect |
| x-sign-in-account-links | X auth / commerce | sign-in / account links | 2/2 |  | https://public.govdelivery.com/accounts/USVA/subscriber/new/ | decided-out |
