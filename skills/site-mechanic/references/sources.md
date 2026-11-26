# Sources, dates and freshness

Read only for a source review (more than 6 months after 20.11.2026), a version-line update, or when a finding rests on a fast-changing fact.

## S1. What is live vs stored

| What | How | When |
|---|---|---|
| Auditor tool versions | `scripts/check-versions.mjs` – live from npm (PyPI for pip-audit) | every audit (step 0) |
| Audited site's library versions | live: `npm view`, `npm outdated`, endoflife.date – never from memory or these files | layers I and D |
| Baseline status of CSS/HTML features | latest `web-features` (`tools.md`, T4) | when a finding depends on it |
| Dates and statuses of standards and docs | stored in layer files; register below | manual review every 6 months; fast items at every audit that relies on them |

## S2. Register

Checked: **source** = primary document or tool data; **secondary** = consistent reports from several outlets; **memory** = not verified against a source in this version – verify at next review.

| Fact | Where | Checked | How to verify | Changes in |
|---|---|---|---|---|
| Tool baseline (impeccable 4.10.0, axe-core 4.14.1, jsdom 31.0.1, retire 6.1.1, purgecss 9.1.0, knip 6.46.1, playwright-core 1.65.1, pip-audit 2.10.1). Tested 19–20.11.2026 in a Claude sandbox (Node 22.23.5, Python 3.13, Chrome 153) on test pages with deliberate defects | T3, `check-versions.mjs` | source (npm, PyPI) | `check-versions.mjs` | days |
| Impeccable rules (62; every ID used in the skill) | A3, B3, G2, H1, K2 | 19.11.2026, source (`--list-rules`) | done by `check-versions.mjs` | days–weeks |
| Baseline statuses (`text-wrap`, gradient interpolation, `svh`/`dvh`, `safe-area-inset`, `enterkeyhint`, `inputmode`, interaction media queries, `scripting`, `font-variant-numeric`) | E1, H3, K1 | 20.11.2026, source (`web-features` 3.47.0) | `web-features` | weeks |
| Node support (18 ended 30.04.2025, 20 ended 30.04.2026; 24 LTS) | T1 | 19.11.2026, secondary | endoflife.date | months |
| EN 301 549 v4.1.1: published 2.09.2026, not yet cited in the EU Official Journal; v3.2.1 cited only for WAD; none under EAA | B2 | 20.11.2026, secondary (ETSI, trade press) | EU Official Journal, ETSI, AccessibleEU | **weeks** – citation expected late 2026 |
| EAA applies from 28.06.2025; Polish act (PAD, 26.04.2024), micro-enterprises exempt for services | B2 | 19.11.2026, secondary | ISAP, gov.pl | years |
| WCAG 2.2 – W3C Recommendation 5.10.2023 | B | memory | w3.org/TR/WCAG22 | years |
| Deque study: ~57% of issues, 16 of 50 criteria | B1 | 19.11.2026, source | deque.com | fixed (2021) |
| Core Web Vitals thresholds (LCP 2.5/4 s, INP 200/500 ms, CLS 0.1/0.25; p75) | C1 | 20.11.2026, secondary | web.dev | years |
| LCP stops after user interaction | C1 | memory | web.dev LCP article | years |
| WSG draft 24.09.2026, guideline numbers and names; WSG Impact Ratings (16.10.2026) | C3, E, I3, J, K1 | 19–20.11.2026, source | w3.org/TR/web-sustainability-guidelines/, w3.org/TR/wsg-ir/ | **weeks** – frequent drafts |
| OWASP Top 10:2025 (final 01.2026), category names | D | 19.11.2026, source + secondary | owasp.org/Top10 | years |
| Google guide on generative AI features (15.05.2026): requirements, Generative AI report, "ignore" list | F1, F3, F5 | 19.11.2026, source | developers.google.com/search | months |
| AI crawlers: OpenAI (`ChatGPT-User` since 12.2025), Anthropic, `Google-Extended`, Perplexity | F3 | 19.11.2026, secondary + docs | vendor docs | months |
| Google: Search Console AI toggle (3.06.2026, UK first) and shared AI-training robots.txt token (announced 30.10.2026, planned 2027, IETF AIPREF) | F3 | 20.11.2026, source (blog.google) + secondary | developers.google.com/search, blog.google | months |
| Vercel measurement: AI crawlers did not run JS (12.2024) | F2 | memory (date given in skill) | Vercel blog, newer data | months |
| GEO study (Aggarwal et al., KDD 2024): up to ~40% visibility | F1 | memory | arXiv / KDD 2024 | fixed |
| Mobile-first indexing; Mobile-Friendly Test and Mobile Usability report retired 1.12.2023; intrusive interstitials guidance | K0, K1 | 20.11.2026, source + secondary | developers.google.com/search | months–years |
| Apple HIG 44×44 pt, Material 48×48 dp; iOS auto-zoom on inputs below 16 px | K1 | 20.11.2026, secondary | Apple HIG, m3.material.io, iPhone test | years |
| Catalogue A sources: ANT (`frontend-design` text), MT (ARTICLE.md), UNS (data 2020–2026), APL | A1 | 19–20.11.2026, source (repos) | source repos | months |
| Polish electronic communications law (cookies) | J1 | 19.11.2026, secondary | ISAP | years |
| Digital Fairness Act proposal COM(2026) 1100 (11.11.2026): Art. 10 + Annex I points 53–62 (10 dark patterns), Arts. 17, 20–23; applies 12 months after entry into force | J2 | 26.11.2026, secondary (law-firm summaries of the proposal text) | EUR-Lex, Commission press release IP/26/2407, legislative train | **weeks** – Parliament and Council may change the list |
| Withdrawal function (CRD Art. 11a, Directive 2023/2673), applies from 19.06.2026; Polish transposition draft UC82 suspended as of 12.06.2026 | J2 | 26.11.2026, secondary | ISAP, RCL (draft UC82), UOKiK | **weeks** |
| Persuasion evidence grades: Many Labs 1 (Klein 2014: anchoring, framing replicated), prospect-theory replication in 19 countries (Ruggeri 2020), scarcity meta-analyses (Barton 2022; Ladeira 2023), decoy limits (Frederick, Lee & Baskin 2014; Yang & Lynn 2014), IKEA conceptual replication (Sarstedt 2017), towel-reuse non-replication (Bohner & Schlüter 2014), FITD meta-analysis, fresh start (Dai 2014), endowed progress (Nunes & Drèze 2006), clickbait studies, voter-noun replications (Gerber 2016, 2020), choice overload (Scheibehenne 2010; Chernev 2015) | J3 | 26.11.2026, source + secondary | papers named | years |
| First-impression research (Lindgaard 2006, Tuch 2012, Reinecke 2013/2014, Fogg 2003, Reber 2004, Elliot & Maier 2014) | A6 | 26.11.2026, source + secondary | papers named | fixed |
| PRA slop signals (arrows on every button, sparkle icons, dithering, "quiet", "real", staccato fragments) | A1, A3, G2 | 26.11.2026, secondary (practitioner lists, press) | newer practitioner lists, UNS updates | months |
| Omnibus rules: lowest 30-day price for reductions, fake-review ban, paid-ranking disclosure; UCPD blacklist | J2 | memory | EUR-Lex, UOKiK guidance | years |
| ING "Po prostu" 13 plain-language rules | G3 | 20.11.2026, source | ing.pl/o-banku/po-prostu | years |
| Reference brands' principles (Apple HIG 8.06.2026, Linear 12.03.2026, Notion interview 12.06.2026, others undated) | A5, `improve.md` U8 | 20.11.2026, source (Apple via dickwu/apple-design-skill copy; Pentagram and Notion via interviews) | URLs in U8 | months – recheck after 05.2027 |
| Ideas from dickwu/apple-design-skill (design thesis, "What works", plan critique) | A1 (APL), SKILL.md step 2, U8 | 20.11.2026, source (commit 91e1566, 13.11.2026) | github.com/dickwu/apple-design-skill | months |

## S3. Version selection (done by `check-versions.mjs`)

1. Newer release **in the same major line** → use the newest in that line (semver: non-breaking).
2. **New major** → stay on the pinned line and tell the user; a new line needs re-testing the skill.
3. Pinned version **deprecated** → newest in the same line, and tell the user.
4. **Impeccable** ships every few days and rule names may change in minors. The script compares the newer version's rules with `scripts/impeccable-rules-4.10.0.json`; if a rule the skill references is gone, it recommends the pinned version.
5. No registry access → pinned versions, noted in the report.

## S4. Reviews and updates

**Source review:** if more than 6 months have passed since 20.11.2026, go through S2 – "memory" and weeks-scale items first. Note differences in the report and propose a skill update (layer file change + new date here).

**Baseline update** (new major): test the tool on test pages with deliberate defects, change the version in `scripts/check-versions.mjs` and T3, and for Impeccable regenerate the rules file (`detect --list-rules --json`).
