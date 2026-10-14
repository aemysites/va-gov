# Journal — VA.gov replica migration

## Extract prep — 5 planned pages captured live (2026-10-13)
- crawl.mjs `--pages` over the 5 site-plan URLs, `--dynamics`: 5/5 captured headless, 0 failed, no bot wall; 4 pages hydrated (Next.js), 6 same-site data endpoints.
- Two templates: `landing` (home, `index`) and `program` (4 benefit hub pages, archetype `health-care`).
- style-census at 1440 + 360; fonts Source Sans Pro Web + Bitter (SIL OFL) network-captured as woff2; source CSS saved under `current/assets/css/`.
- cap-probe: hub shell capped at 1024px; home bands fluid with a 1024px module cap (register candidate, kept as captured).
- Header contract recorded (`stardust/chrome/header-contract.json`): 1440 — 3 hover menus + search; 390 — drawer, 55 states.

## Extract — complete, handing to preserve-direction (2026-10-13)
Provenance 5/5 live. Vision check ok on all 5.

## Dynamics detect / classify / triage — 23 rows, all dispositioned (2026-10-13)
Header menus, drawer, banner accordion, crisis overlay ship native; search passes through to the source search; email signup posts to GovDelivery; APIs, tags, auth and feedback take interim tiers with named owner decisions (`stardust/dynamic-features.md`).

## Preserve direction — verbatim promotion, empty register (2026-10-13)
current/PRODUCT.md, DESIGN.md, DESIGN.json promoted verbatim to the project root; `stardust/direction.md` records PRESERVE mode; inconsistency register empty (pure replica). No target breakpoints. Dynamic surface triaged (above).

## Recreate — health-care (benefit hub archetype) passes the gate (2026-10-13)
- Capture gap closed: hub link lists, On-this-page, cards and accordions live in shadow DOM (va-link, va-on-this-page, va-card); added a composed-tree Playwright capture (`pages/<slug>.flat.html`) and a renderer (`stardust/replica/build/render-hub.mjs`) that carries content verbatim into re-authored markup — reusable for the 3 sibling hubs.
- Shared canon: `prototypes/assets/canon.css` (tokens, self-hosted Source Sans Pro + Bitter, gov banner, crisis line, header ≥768 / mobile header <768, footer + mobile accordions, crisis modal), `chrome.js` (mega menu from the header contract, drawer, search, modal).
- Gate: 1440 → 6.06% → 4.53% → 1.65%, Δh −2; 360 → 10.90% → 5.10%, Δh −6; 0 structural 🔴 both; clip 0; overflow ok; chrome crops header 0.14%/1.22%, footer 1.89%/1.44%; cap-probe PASS.
- Fixes off the instruments: header banner 12px margin, crisis arrow box, alert last-p margin, `<br></br>` double break, accordion li margins, footer column margins, separators (flex rows), lang row margin.
- Motion: link hover colour/background 300ms implemented (parity); header scroll-morph dead on live.

## Source-fidelity gate — home page (landing archetype) passes; both archetypes gated (2026-10-13)
- Home prototype rendered by `stardust/replica/build/render-home.mjs` from `pages/index.flat.html` (content verbatim) + `prototypes/assets/home.css` (values lifted from `home-{1440,360}-tree.txt` and the source CSS: hero gradient, JEykya split background, blog image crop, email-signup widths) + `home.js` (site-banner close). Shared canon/chrome reused unchanged.
- Gate: 1440 → 8.43% (Δh +16) → 1.33%, Δh −1; 360 → 12.32% (Δh −20, overflow +8) → 2.80%, Δh −1; 0 structural 🔴; clip 0; overflow ok; chrome crops header 0.23%/1.22%, footer 1.24%/1.81%.
- Fixes off the instruments: banner paragraph bottom margin kept in the alert (+17px), top-pages li padding dropped (−36px at 360), row gutters clipped (overflow).
- cap-probe at 2560: 1 ✗ is a probe false-red (live feedback row's only leaf is a shadow va-button); both sides measure x 768 w 1024 — recorded in progress.json.
- Prototype table (`gate-all --stage prototype`) 2/2 PASS at 1440 and 360. Motion: gov-toggle hover + banner close implemented; scroll-morph dead.

## Migrate plan — page map and render order (2026-10-13)
- Page map: 5 entries, 0 collisions (`/` → index.html, four hubs → `<slug>/index.html`). Units: `archetypes` (index, health-care) now; `program` (3 sibling hubs) after the program archetype is live and gated on the preview origin; `report` last.

## Rollout A-inventory — 2 archetypes inventoried, siblings join after render (2026-10-13)
- `inventory.mjs --state` mapped state URLs with a trailing slash (`/health-care/`) against the migrated path (`/health-care`) and duplicated the archetype (`health-care-x`); re-ran without `--state` so the roster holds the 2 migrated archetypes, and the 3 program siblings enter coverage when the `program` render unit writes them (inventory re-run then). DA target aemcoder/cd6de7e5@main, live host main--cd6de7e5--aemcoder.aem.live.

## Rollout B-block — 15 distinct blocks, representative-first plan (2026-10-13)
- 16 block instances → 15 conversions (feedback shared by both templates). health-care converts breadcrumbs, hub-title, on-this-page, alert, link-list, rail-card, accordion, feedback, portraits; index converts site-alert, home-hero, home-tasks, news-promo, hub-grid, email-signup and reuses feedback.

## Rollout B2-dynamic — fresh detect matches the curated inventory (2026-10-13)
- Re-ran detect on `/` and `/health-care/` (20 findings, same as Phase 2) and the triage draft against the target origin (self 4, owner batch 13, already delivered 3, host-bound 3/3). `stardust/dynamic-features.md` (23 curated rows, every row dispositioned) stands unchanged; the self rows ship with the foundation and home blocks.

## C-deliver foundation — chrome live and gated, foundation frozen (2026-10-13)
- One foundation subagent built styles, fonts (Source Sans Pro, Bitter), header and footer blocks, and the /nav and /footer documents (live, noindex). Lint ok, code synced.
- Gate on the preview origin: header band 0.14% / 1.22%, footer band 2.01% → 1.40% (1440; separator padding 10px instead of 10/11) / 1.05% (360); 768 overflow 1010 → 768.
- Header contract: 48 errors → 1 (mega menu geometry and promos, keyboard, drawer drill-down, search) → the remaining one was a source capture taken before its promo loaded; the live header was re-explored (contract replaced, old kept as .prev) → 1 new close-path error (gov banner click-outside) fixed → 0 errors / 7 warnings, exit 0.
- `foundation-freeze.mjs freeze`: 18 files.

## C-deliver archetype-program — Health care hub live and gated on the preview origin (2026-10-13)
- 9 blocks (breadcrumbs, hub-title, on-this-page, alert, link-list, rail-card, accordion, feedback, portraits) + 12 icons; /health-care PUT → preview → live; block-roundtrip --ew 40/40 editable; lint 0; encoder for siblings at stardust/.work/rollout/probes/encode-program.mjs.
- Gate on preview: 1440 3.62% Δh -1 PASS. 360 official row 12.44% Δh -106 — gate-all shoots the origin headed (real Chrome) and the EDS side headless, and the two tiers wrap 360px text differently (≈100px of height on both sides). Same-browser recapture: 4.95% Δh -5 PASS → documented override in gates/all-360/overrides.json (number kept beside it). Expect the same at 360 for the sibling hubs and gate-all.
- One foundation request queued.

## Migrate render program — 3 sibling hubs rendered from the Health care archetype (2026-10-13)
- housing-assistance 9/9 modules, life-insurance 8/9 (no alert), family-and-caregiver-benefits 8/9 (no on-this-page); 5 variant classes; content counts match (1 logged deviation: family disclosure trigger link → summary). Gates variance-probe, content-count, content-fidelity recorded.
- Encoder gaps for the delivery cluster: promo images not yet in DA, family `<details>` alert flattened, `rail-card background` variant not carried, `<b>` dropped in link-list descriptions. Sibling-variant CSS lives inline in the drafts (stardust/.work/migrate/siblings/) and must move into the blocks.

## C-deliver archetype-landing — home page live and gated on the preview origin (2026-10-13)
- 6 new blocks (site-alert, home-hero, home-tasks, news-promo, hub-grid, email-signup), reused portraits and feedback (new `action-only` variant; health-care re-checked). Home dynamic rows shipped: search → va.gov/search, GovDelivery email form, sign-in link.
- Gate on preview: 1440 4.95% Δh -12 PASS; 360 official 10.64% Δh -27 (same headed-origin/headless-EDS tier mismatch) → same-browser 2.79% Δh -2 → override in gates/all-360/overrides.json. block-roundtrip --ew 47/47; 0 foundation requests.

## C-deliver program cluster — 3 sibling hubs live (2026-10-13)
- housing-assistance, life-insurance, family-and-caregiver-benefits PUT → preview → live; encoder extended (variant classes, `<details>` alert as 3 rows, `<b>` kept, tel aria-label via title); promo images uploaded to DA; alert/rail-card variant CSS in block CSS.
- Gates 1440: 3.77 / 3.48 / 5.87%; 360 official 11.95 / 12.65 / 13.89% from the headed-origin/headless-EDS tier mismatch, same-browser 4.79 / 8.4 / 2.79% → overrides. health-care re-gate unchanged.
- Project copy of davids-model-lint.mjs now allows `sms:` hrefs (source link `sms:838255` flagged as a path). Coverage rows added via inventory.mjs + update-coverage.

## C-final foundation request + gate-all — roster gated on the published origin (2026-10-13)
- Applied the one queued foundation request (hub two-column section layout moved from hub-title.css to styles/styles.css), re-frozen, pushed; numbers unchanged afterwards (pixel-neutral).
- gate-all on aem.live (origin captures reused, EDS re-shot): 1440 5/5 PASS (3.48–5.87%); 360 5/5 delivered via documented overrides (headed-origin/headless-EDS tier mismatch). update-coverage --gate: 0 flips.

## C-deliver — ended: 5/5 pages live and gated (2026-10-13)
- All six units done (foundation, archetype-program, archetype-landing, program, gate-all, final). Freeze check clean. Next: rollout D onward (verify, link audit, optimize, dashboard), then replica handoff end after done-check.

## Migrate render + state-and-report — 5/5 pages placed (2026-10-13)
- Units archetypes and program done; report written to stardust/migrate/report.txt (2 archetype + 3 sibling, all deployed). The "broken" column counts links to source pages outside the 5-page scope — they are handled by the link audit (E2).

## D-site — sitemap, redirects, root (2026-10-13)
- assemble --verify-origin exit 0: sitemap served 5 = assembled 5. /redirects.json live (4 trailing-slash rows, no `/` row); `/` 200 on .page and .live; /nav, /footer already noindex.

## D2-dynamic — parity replayed on aem.live (2026-10-13)
- stardust/dynamics/parity.json 16 features, dynamics-check 16/16 pass. Search/sign-in point to va.gov (link checks). Crisis modal + email signup confirmed by a blocking browser probe (no live GovDelivery submit).

## E-full-site — 5/5 verified (2026-10-13)
- verify.mjs 5/5 verified after E2; coverage --gate 5/5 at both widths; headless render of / and /health-care clean at 1440/360.

## E2-link-audit — out-of-scope links repointed (2026-10-13)
- 89 links (71 distinct pages) outside the 5-page scope repointed to https://www.va.gov/<path> (named decision in direction.md); 5 pages re-PUT + published; 254 distinct hrefs fetched, 0 × 404 (facebook answers 400 to scripts, identical to source).

## F-optimize — no open P1 (2026-10-13)
optimize.mjs --all on main--cd6de7e5--aemcoder.aem.live: 5 pages + site checks, P1 0 · P2 4 · P3 0. The 4 P2s are missing JSON-LD on the 4 program hubs (source has it → platform-migration, for G-aem); index's missing JSON-LD is source parity. Gate: no open P1.

## G-aem — source JSON-LD restored on the program hubs (2026-10-13)
autofix-aem could not place JSON-LD (no-file: content lives under stardust/.work/rollout). Each hub's single source `application/ld+json` block (verbatim from stardust/current/pages/<slug>.html) added as a `JSON-LD` row of the page metadata block (stardust/.work/rollout/g-aem/content), re-PUT + published via deploy-batch --force; aem.live serves it in the head and it parses. Re-run: optimize P1 0 · P2 0 (4 fixed, index parity only), verify 5/5.

## H-report — rollout report + learnings (2026-10-13)
stardust/rollout/report.md: 5/5 verified, 15/15 blocks, health 100, P1/P2/P3 0, 1440 5/5 PASS, 360 5/5 via overrides, dynamics 16/16. stardust/learnings.md: 3 pending entries (autofix content root, JSON-LD metadata row, 360 headed/headless tier mismatch).

## I-dashboard — dashboard written, header parity recorded (2026-10-13)
dashboard.mjs → stardust/rollout/dashboard/index.html + data.json: identified 5 · prototyped 5 · deployed 5 · optimised 4 (index carries the source-parity JSON-LD P2). done-check asked for a header comparison: chrome-explore on aem.live/health-care (1440,390) vs stardust/chrome/header-contract.json → chrome-compare --profile replica 0 errors, 7 warnings (build-only open states, depth budget) → stardust/chrome/header-parity.json. done-check's remaining `pages_not_live:4` probes `/<hub>/` (folder-index convention from the migrated tree); the delivered documents live at `/<hub>` and `/<hub>/` answers the documented 301 from the redirects sheet (D-site), so every page is live at its delivered path (200 on aem.live). The runner's done-check reports only `rollout_incomplete`.

## Handoff — complete (2026-10-13)
migrate → deploy → rollout finished A–I for the 5 planned pages: all live on main--cd6de7e5--aemcoder.aem.live, verified, 1440 5/5 PASS, 360 5/5 via documented overrides, optimize 0 open, dynamics 16/16, header parity 0 errors. Runner done-check: complete, no gaps.
