# Learnings — www.va.gov replica run (2026-10-13)

### autofix-aem cannot find delivered content kept under stardust/.work
- failure class: path-safety
- evidence: G-aem `autofix-aem.mjs --project . --dry-run` → `eds-jsonld … no-file` for all 4 findings; the delivered documents of this run live in `stardust/.work/rollout/<unit>/content/`, never in a project-root `content/`.
- proposed change: `skills/rollout/scripts/autofix-aem.mjs` — accept `--content <dir>` (or read the last deploy-batch ledger's content root) and say which dir it looked in on `no-file`.
- status: pending

### JSON-LD has a safe EDS placement: a `JSON-LD` metadata row
- failure class: capture-gap
- evidence: optimize flagged 4 hubs without JSON-LD though the source carries one `application/ld+json` each; autofix-aem marks JSON-LD placement `manual`. Adding the verbatim source JSON as a `JSON-LD` row of the page metadata block made aem.live serve it in `<head>` (parses; optimize P2 4 → 0).
- proposed change: `skills/deploy/SKILL.md` § metadata — carry source JSON-LD as a `JSON-LD` metadata row at conversion time; `autofix-aem.mjs` eds-jsonld fixer — apply that row instead of `manual`.
- status: pending

### gate-all at 360 compares a headed origin to a headless EDS capture
- failure class: capture-gap
- evidence: all 5 pages' official 360 rows 10.6–13.9 % with Δh up to −106 px; same-browser recaptures 2.79–8.4 %, Δh ≤ 5 → every 360 row delivered via `gates/all-360/overrides.json`. The two Chromium tiers wrap 360 px text differently.
- proposed change: `skills/replica/scripts/gate-all.mjs` — shoot both sides on the same tier when the origin needs `--headed` (or record the tier per side and re-shoot the EDS side headed automatically).
- status: pending

### done-check probes folder-index URLs the delivery served without a slash
- failure class: path-safety
- evidence: migrated tree `stardust/migrated/<hub>/index.html` → done-check probes `/<hub>/`; the run delivered the DA documents at `/<hub>` with a redirects-sheet row `/<hub>/` → `/<hub>` (301), so `pages_not_live:4` though all 4 answer 200 at `/<hub>`.
- proposed change: `skills/rollout/scripts/lib.mjs` `publicUrl` — prefer `delivery.deployedUrl`'s path when present; or `skills/deploy/SKILL.md` — deliver folder-index pages as `<hub>/index` so the served URL keeps the source's slash.
- status: pending
