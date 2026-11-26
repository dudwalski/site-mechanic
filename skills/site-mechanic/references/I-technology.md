# I – Technology stack

Goal: find what the site is built with (CMS, framework, builder, JS/CSS libraries, plugins, third-party services, platform features) and judge whether each is **current, maintained, proven and fit for purpose**. Unsupported components with known vulnerabilities are reported jointly with D. List detected technologies in the report's "Technology inventory" (max 10 rows, problems first).

## I1. Rules

- **Never state "latest version" or support status from memory.** Check on audit day (registry, endoflife.date, project site) and give source and date; otherwise "unchecked".
- **Detection is a finding with evidence** – say how you know (file path, header, meta tag, package.json entry). Don't guess versions – "version unknown".
- **Popularity is a signal, not proof of quality.** Niche tech isn't a defect if maintained and fit for the need.
- **Never recommend migrating to another technology unprompted.** First update within the same technology or remove what's redundant.

## I2. Detection (passive)

| Source | Reveals |
|---|---|
| `package.json`, lockfile, `composer.json`/`.lock`, `requirements.txt` | exact dependencies and versions (best evidence) |
| Meta `generator`, paths (`/wp-content/`, `/_next/`, `/_astro/`) | CMS, framework, builder |
| Script and style URLs | libraries, often versions (`jquery-3.6.0.min.js`, `@5.3.2` in a CDN URL) |
| HTTP headers (`Server`, `X-Powered-By`, CDN headers) | server, language, platform, CDN (version disclosure – also D) |
| Cookie names, globals, comments | CMS, analytics, plugins |
| retire.js | known JS libraries, versions, vulnerabilities |
| Fingerprint databases (webappanalyzer – continuation of Wappalyzer data, WhatWeb) | broad detection; untested – consent only, results as leads |

Minified bundles often hide names and versions; no detection ≠ absence.

## I3. Assessment criteria

| Criterion | How to check | Data sources |
|---|---|---|
| **Support (EOL)** | does the version line still get (security) fixes | endoflife.date (site and API), release policy |
| **Deprecation** | officially deprecated package or feature | `npm view <pkg> deprecated`, project site, MDN |
| **Distance from current** | how many majors behind | `npm view <pkg> version`, `npm outdated` |
| **Maintenance** | last release, activity, number of maintainers | `npm view <pkg> time`, repo, deps.dev, OpenSSF Scorecard ("Maintained" = activity in last 90 days) |
| **Known vulnerabilities** | reports against the used version | retire.js, `npm audit`, `composer audit`, `pip-audit`, OSV (via deps.dev) – details in D |
| **Popularity and track record** | widely used in similar projects | registry downloads, dependents (deps.dev), HTTP Archive / Web Almanac, W3Techs |
| **Web platform features** | do used HTML/CSS/JS features have broad support | Baseline (`web-features`, MDN): "Widely available" – safe; "Newly available" – usually fine, check required browsers; "Limited availability" – needs fallback or progressive enhancement. Offline check: `tools.md` |
| **Language/runtime version** | server PHP, Node, Python in a supported line (if visible) | endoflife.date; WSG 3.15 "Use the latest stable language version" |
| **Fit for purpose** | not too heavy or duplicated | e.g. SPA framework for a simple brochure site, two libraries for one job (jQuery next to React, two analytics) – link to C and E |
| **Lock-in risk** | closed builder or plugin hampering change and export | vendor terms, export options |

## I4. Priorities (working rules of this skill, not an industry standard – present as judgement)

| Situation | Priority |
|---|---|
| Unsupported **and** known vulnerabilities | P0 (also in D) |
| Unsupported (EOL), no known vulnerabilities | P1 |
| Officially deprecated package or plugin | P1 |
| No releases or activity for long, no maintainers (likely abandoned) | P2 |
| Duplicated or too heavy for the job | P2 (link to C and E) |
| Supported but at least one major behind | P3 |
| Limited-availability feature without fallback | P2 if it breaks something important; else P3 |

WordPress and similar: check core, theme and each plugin separately (plugin page on wordpress.org: last update, tested-with version) – an abandoned plugin is often a bigger risk than outdated core.
