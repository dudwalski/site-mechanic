# Tools and environment

## T1. Environment and network

**Node:** tools run in the auditor's environment, not the audited project. Requires **Node 22.22.2+ or 24.15+** (24 LTS recommended; jsdom 31 sets this floor). `check-versions.mjs` checks engine requirements. Run `node --version`.

**Network:** many sandboxes reach only package registries and GitHub, not arbitrary sites – then `curl <url>`, Impeccable URL scans and HTTP Observatory fail. Model fetch tools (e.g. WebFetch) return processed text without headers or raw HTML, so they cannot replace `curl` for no-JS HTML or headers.

No site access → ask the user (max 3 at once, most important first):
1. **Screenshots** of every in-scope page: desktop ~1440 px and phone ~390 px, full length.
2. **Raw HTML** ("View source" → save) or the project source.
3. **Response headers**: `curl -sI https://address` or DevTools Network → Headers for the document.
4. Optional: PageSpeed Insights report (mobile), HAR from a clean session before touching the cookie banner, robots.txt, sitemap.xml.

No way to resize the window or capture device-mode screenshots → ask for phone screenshots in step 0 (`K-mobile.md`, K0).

## T2. Running rules

- Get versions at the start of each audit: `node <skill-path>/scripts/check-versions.mjs` (add `--json` for machine output); use the "USE" column and record versions in "Scope". Versions below are the tested baseline. The script also checks Node against each tool's `engines`. No registry access → use pinned versions and say so.
- Tools marked untested: only with user consent, results with extra caution. No tools outside this table without consent.
- Audit mode: never install into the audited project or globally. Helpers go in a temp directory; `npx --yes <pkg>@<version>` uses the npm cache, not the project.
- Pick dependency tools by the project's ecosystem files. No manifest (static site, WordPress without server access): retire.js on JS files plus manual version checks.
- Tool output is a lead: confirm, drop false alarms, group repeats.

## T3. Tool table

| Layer | Tool (baseline) | Needs | Status |
|---|---|---|---|
| A (+B, G, H, K) | `impeccable@4.10.0 detect` | Node | tested on files/dirs; URL scan (`--viewport`) untested |
| A, G | `scripts/slop-sweep.mjs` | Node | tested on test pages (26.11.2026) |
| Improve | `impeccable detect --before` / `--kept` (wiring check, `.html` only) | Node | tested |
| B | `axe-core@4.14.1` + `playwright-core@1.65.1` via `scripts/axe-browser.mjs` | Node 20+, Chrome | tested |
| B | `axe-core@4.14.1` + `jsdom@31.0.1` via `scripts/axe-scan.mjs` (static) | Node 22.22.2+ | tested; contrast returns "incomplete" |
| B | axe DevTools, Lighthouse | browser | untested |
| D, I | `retire@6.1.1` | Node 22.12+ | tested |
| I | `npm view <pkg> version deprecated time engines` | Node | tested |
| D, I – Node | `npm audit --omit=dev`, `npm outdated` | package.json + lockfile | tested |
| D, I – Python | `pip-audit@2.10.1 -r requirements.txt` | Python | tested |
| D, I – PHP | `composer audit --locked`, `composer outdated --locked --direct` | Composer 2.4+, lockfile | untested |
| E | `purgecss@9.1.0`, `knip@6.46.1` (knip needs package.json) | Node 22.12+ | tested |
| E | Chrome DevTools Coverage | browser | untested |
| C, K | PageSpeed Insights / Lighthouse (mobile) | browser | untested; if you can't run it, ask for the report |
| K | `playwright-core@1.65.1` via `scripts/mobile-check.mjs` | Node 20+, installed Chrome | tested |
| K | DevTools device mode, real phones (iOS Safari, Android Chrome) | devices | manual; emulation lacks real touch and on-screen keyboard |
| F | `curl -s <url>` (no-JS HTML), `curl -sI <url>` (headers) | network | standard; Rich Results Test untested |
| D | HTTP Observatory (developer.mozilla.org/observatory) | browser | untested; consent only – scan history is public |
| H, I, K | `web-features` (Baseline status offline; always latest – it's data) | Node | tested |
| I | webappanalyzer, WhatWeb, deps.dev, OpenSSF Scorecard, endoflife.date | various | untested |

## T4. Commands and notes

Commands show baseline versions – substitute those from `check-versions.mjs`.

### Impeccable

```bash
npx --yes impeccable@4.10.0 detect --json --no-inline-ignores <file|dir>
npx --yes impeccable@4.10.0 detect --list-rules --json   # rule catalogue (62: 31 slop, 31 quality)
```
- **Exit code 2 = patterns found**, not an error; 0 = none. JSON items: `antipattern`, `name`, `category` (`slop`/`quality`), `severity`, `file`, `line`, `snippet`.
- Linked CSS is read; a directory scan may report one hit twice (HTML and CSS) – group by rule and selector.
- `--no-inline-ignores`: don't honour `impeccable-disable*` comments in code you audit; `--report-unused-ignores` lists needless ones.
- Brand file: slop rules are never switched off by `DESIGN.md` (A0). `--no-design-system` disables loading it.
- URL scan: `--viewport 390x844` for mobile. **Hides known consent banners by default** – add `--no-consent-hiding` for B (2.4.11) and J.
- `--no-advisory` hides advisory rules (e.g. `em-dash-overuse`).
- `--before` / `--kept`: Improve-mode wiring check (`improve.md`, U4–U5); `.html` only; snapshot goes to `.impeccable/wiring/` in the current directory, so run both from the same directory.
- Copy rules work on English only – check other languages by hand (G).
- `quality` rules belong to layers B and H, not A.
- `flat-type-hierarchy` counts only CSS-declared sizes and ignores browser default heading sizes – it gave false alarms on pages without custom heading sizes. Confirm the scale with `getComputedStyle` before reporting.

### Slop sweep (no dependencies)

```bash
node <skill-path>/scripts/slop-sweep.mjs <file|dir> [--max 3] [--json]
```
Regex search for the code signals of catalogues A and G (incl. Polish buzzwords); skips `node_modules`, `.git`, minified files. Output per signal: count, files, first locations. Leads only – confirm visually, filter what the brand file allows, look for clusters. Complements Impeccable (covers signals Impeccable has no rule for, e.g. T6, T7, L11, IM8, G1 template proof).

### axe in a real browser (preferred)

```bash
mkdir -p /tmp/axe-browser && cd /tmp/axe-browser
npm init -y >/dev/null && npm i --silent playwright-core@1.65.1 axe-core@4.14.1
node <skill-path>/scripts/axe-browser.mjs <file.html|URL> [--click <selector>]... [--keyboard 20] [--views mobile,desktop] [--offline] [--wait-for <selector>]
```
- Sees JS content, real styles (contrast) and post-click states (`--click` opens a menu, accordion, dialog). A click that changes the URL stops further clicks and marks the view incomplete (exit 4).
- `--keyboard n`: n Tab presses – focus order, `withoutIndicator`, `possibleTrap`. Leads for manual checking.
- No axe violations ≠ WCAG conformance.

### axe static fallback (no browser)

```bash
mkdir -p /tmp/axe-run && cd /tmp/axe-run
npm init -y >/dev/null && npm i --silent axe-core@4.14.1 jsdom@31.0.1
node <skill-path>/scripts/axe-scan.mjs <file.html|dir>
```
Runs no page scripts and loads no resources. `frameworkDetected` flags framework attributes; `mayBeFalsePositive` lists elements whose missing name may come from JS-inserted content – confirm in a browser.

### Mobile check

```bash
mkdir -p /tmp/mc-run && cd /tmp/mc-run
npm init -y >/dev/null && npm i --silent playwright-core@1.65.1
node <skill-path>/scripts/mobile-check.mjs <file.html|URL> --out <screenshot-dir> [--offline] [--chrome <path>]
```
- Needs installed Chrome/Chromium (common paths, `CHROME_PATH` or `--chrome`); does not download a browser.
- Fields: `desktopLayoutOnMobile` (no viewport meta – laid out at ~980 px), `zoomBlocked`, `horizontalScroll` and `overflowing`, `contentSpilling` (text spilling out of its box), `smallInputs` (<16 px), `fixedCovering`, `hiddenOnMobile` (visible on desktop, hidden at 390 px, incl. ancestor `opacity: 0`; matched by text, not DOM position).
- `smallTargets`: below 44 px (Apple; Material 48 dp). `below24` = below WCAG 2.5.8 minimum. `spacingOk` per WCAG: a 24 px circle centred on the small target intersects no other target or another small target's circle (`null` for targets ≥24 px). Other 2.5.8 exceptions (`inlineInText`, `nativeControl`, equivalent target, essential) – judge manually.
- `hoverReveal`: content revealed only by `:hover` outside `@media (hover: hover)`. `focusWithinAlternative`: `true` – a `:focus`/`:focus-within` rule exists (also inside `@media`, `@supports`, `@layer`); `false` – none in readable sheets; `null` – undecidable (`unreadableSheets`, e.g. cross-origin).
- **Completeness:** each profile has `complete` and `incompleteReasons`; `incompleteProfiles` and exit 4 mean a partial measurement – such findings are "To confirm". Late-loading or hydrated pages: `--wait-for <selector>` and/or `--settle-ms` (default 1000).
- `--offline` blocks network resources (local files); without it external fonts and scripts may change results.
- Screenshots without viewport or with overflow show the page zoomed out, as a phone would. Status: "Confirmed (emulation)"; touch, on-screen keyboard and iOS Safari stay in "Unknowns".
- **Don't substitute a desktop window resize**: headless Chrome without device emulation ignores viewport meta.

### retire.js

```bash
npx --yes retire@6.1.1 --path <dir-with-js> --outputformat json
```
Downloads its vulnerability DB at run time (needs GitHub access).

### Dependencies

- **npm:** `npm audit --omit=dev --json` in the project (needs lockfile; read-only). `npm outdated` shows "MISSING" without `node_modules` – then compare lockfile versions with `npm view <pkg> version`.
- **Python:** `pip-audit -r requirements.txt` (install in the auditor's env, e.g. `pipx install pip-audit==2.10.1`).
- **PHP:** `composer audit --locked`, `composer outdated --locked --direct`.

### purgecss and knip

```bash
npx --yes purgecss@9.1.0 --css <file.css> --content <html/js files>   # CSS without unused rules
npx --yes knip@6.46.1 --no-progress                                    # in a project with package.json
```
Input minus purgecss output = removal candidates. knip is read-only.

### Baseline status offline (web-features)

```bash
rm -rf /tmp/wf && mkdir -p /tmp/wf && cd /tmp/wf && F=$(npm pack web-features --silent) && tar xzf "$F" && echo "web-features: $F"
node -e "const d=require('./package/data.json');console.log(d.features['text-wrap-pretty'].status)"
```
`baseline: "high"` = widely available, `"low"` = newly available, `false` = limited availability.
