---
name: site-mechanic
description: Audits and improves existing websites, mockups, screenshots and front-end code. Removes "AI slop" (generic, templated look and copy) and checks WCAG 2.2 accessibility, mobile-first behaviour, performance, passive security, dead code, SEO/GEO, copy and plain language, build quality, technology stack, cookie consent and manipulative design (dark patterns, EU consumer law incl. the proposed Digital Fairness Act). Ends the report with a ready-to-paste implementation prompt for the chat or tool that builds the project. Use when the user asks to audit, review, assess or improve a specific landing page, site, platform or project ("looks AI-generated", "what should I fix", "improve this page", "AI slop audit", "design review"), in any language, including Polish ("zrób audyt strony", "popraw stronę", "wygląda jak z AI"). Not for building a new site from scratch.
license: MIT – see LICENSE (includes third-party licenses)
compatibility: Full audit needs a shell with Node.js 22.22.2+ or 24.15+ and npm registry access; optional Chrome/Chromium (mobile-check, axe-browser) and Python 3 (pip-audit). Without a shell it works on screenshots and code pasted into the chat, with narrower layer coverage.
metadata:
  version: "3.2"
  author: Michał Dudwał
  language: en (reports in the user's language)
---

# Site Mechanic

Goal: the site looks deliberate and fitted to its subject, and real defects are gone. Default flow: the user gives a project (landing page, site or platform) → analyse layers A–K → report what is wrong and how to fix it, ending with an implementation prompt the user pastes into the chat or tool building the project.

Knowledge date in these files: 20.11.2026. Dated facts are listed in `references/sources.md`; read it only if more than 6 months have passed or a finding rests on a fast-changing fact.

## Modes

| Mode | Trigger | Output |
|---|---|---|
| **Audit** (default: "check", "assess", "audit", "review") | diagnosis | report per `assets/report-template.md` with the implementation prompt; change nothing |
| **Improve** ("fix", "improve", "implement") | changes to the project | audit → plan → consent → changes → verification → re-audit; read `references/improve.md` before planning |
| **Quick** ("quick look", "first impression") | short diagnosis | visual layer only (max 5 findings) + P0s checkable at once (`noindex`, secret in code, form over HTTP, main action unreachable by keyboard or on a phone); no tech inventory; list unchecked layers |

Unclear mode → ask in step 0. Improve always starts with an audit (or, given a fresh report from this skill, with re-confirming its findings in the current code).

## Core rules (every mode)

1. **Never guess whether AI made it.** Describe patterns and their harm, never authorship.
2. **No scores or grades.** Priorities P0–P3 only.
3. **Every finding needs evidence** from the material: selector or file:line, component, screenshot region, HTTP header, tool output or quoted text.
4. **Zero findings is a valid result.** Limits are ceilings, not targets.
5. **A pattern is a signal, not a verdict.** Report a visual signal only if it fails the removal test. A cluster with one cause is stronger evidence than single hits.
6. **The brand file wins.** What DESIGN.md, a brand book or confirmed tokens define is intentional – check conformance instead. Tokens in code alone are not a brand file without user confirmation or independent evidence (`A-visual.md`, A0). The brand file does not exempt other layers (a low-contrast brand colour is still a B finding).
7. **Never claim compliance** ("WCAG/OWASP/GDPR/EAA compliant", "fast", "AI-optimised"). Report likely non-conformance, risks and measurements with their source.
8. **Separate checked from assumed.** Every finding has an evidence status. What could not be seen, run or measured goes to "Unknowns"; the report has a layer coverage table. "No issue found" ≠ "not checked". Never invent numbers.
9. **Remove first.** Delete or merge before restyling or adding. New font, palette, layout, library or animation only with explicit consent (Improve: "Direction").
10. **Never invent content** – no numbers, testimonials, clients, logos, awards or product claims. Mark gaps `[TO FILL IN: …]` (in the report language, e.g. `[DO UZUPEŁNIENIA: …]`).
11. **Security is passive only.** No attacks, fuzzing, password cracking, logging in or scanning others' systems. Public scanners (e.g. HTTP Observatory) only with consent.

**Evidence status:** **Confirmed** (seen, measured, or tool output verified by hand) · **Code risk** (follows from code, effect not measured) · **To confirm** (needs data you lack, e.g. whether a testimonial is real). Visual and copy findings also carry **Confidence** from the catalogue (High/Medium/Low), lowered one level on partial evidence (e.g. screenshot only). Catalogue-Low signals are reported only inside a cluster or with clear harm.

## Files – what to read when

| File | Read |
|---|---|
| `references/tools.md` | before running any command; when there is no network or Node |
| `references/A-visual.md` | always (main layer; includes the reference design principles, A5) |
| `references/B-accessibility.md`, `C-performance.md`, `D-security.md`, `E-code-economy.md`, `F-visibility.md`, `G-copy.md`, `H-quality.md`, `I-technology.md`, `J-privacy.md`, `K-mobile.md` | only layers in scope |
| `references/improve.md` | Improve mode only, before the plan |
| `references/sources.md` | only for source review, version-line updates or a fast-changing fact |
| `assets/report-template.md` | before writing the report |
| `assets/DESIGN-template.md` | when the user wants to create a brand file |
| `scripts/check-versions.mjs` | start of every audit: which tool versions to use |
| `scripts/axe-browser.mjs` / `axe-scan.mjs` | accessibility in a real browser / static fallback without a browser |
| `scripts/mobile-check.mjs` | layer K in Chrome with phone emulation, plus screenshots |
| `scripts/slop-sweep.mjs` | step 2: search source for every visual and copy catalogue signal (no dependencies) |

Layers: **A** visual (AI slop, main) · **B** accessibility · **C** performance and sustainability · **D** security · **E** code economy · **F** SEO, GEO, AEO · **G** copy · **H** build quality · **I** technology · **J** privacy, consent and fair design · **K** mobile first. All by default; only those named if the user narrows scope.

## Step 0 – Scope, inputs, consent (always first)

1. **Inventory inputs** for "Scope": rendered page (URL, screenshots), source, HTTP headers, robots.txt/sitemap/structured data, brand file, PageSpeed/Lighthouse report, Search Console data, HAR.
2. **Read the brand file** if any (A0). If the only brand source is tokens in code, ask whether they are the brand identity.
3. **Check the environment**: shell, Node version, network access to the site, Chrome/Chromium. Run `check-versions.mjs`. No network or mobile view → ask for substitutes now (`tools.md`, T1; `K-mobile.md`, K0).
4. **Set scope by project type** – each view on desktop (~1440 px) and phone (390 px; 320 px for layout):
   - **Landing** – whole page, all sections and form states.
   - **Site** – home, main landing/offer, a typical product or service page, a form page, 404.
   - **Platform** (web app, shop, dashboard) – entry and sign-up/login, the main task end to end, one list and one detail view, settings, empty/error/loading states. With a repo: shared components and styles – put systemic findings there.
   Repeated findings across views are reported once, as systemic.
5. **Ask in one batch** – max 3 questions with options, only what you cannot determine: mode, page set, whether code tokens are the brand, phone screenshots (no mobile view), consents (public scan, untested tools, where Improve may write).
6. **Unattended:** mode from the request, pages from point 4, code tokens unconfirmed, no public scans, no untested tools. State these assumptions at the top of the report.

No screenshots, code or site access → ask for them; do not start.

## Audit

**Step 1 – Automated checks** (if you can run commands; `tools.md`). Tool output is a lead: confirm each in the material, drop false alarms (especially what the brand file allows), group repeats. A tool fails → note it in "Scope" and continue manually.

**Step 2 – Visual layer (the main layer – give it the most attention).** With source code, start with the **slop sweep**: `node <skill-path>/scripts/slop-sweep.mjs <dir>` – hits are leads for the catalogue, not findings; without code, go through the A3 tables on screenshots. Then the **design thesis**: one sentence on what the main view is for and what in it is specific to this product. No answer in the material → finding for the verdict (interchangeability); material too partial to judge → "Unknowns". Then `A-visual.md`: clusters first, then single signals – does the page open with something specific to this product or a layout that fits any product? Finally the A5 control questions; a "no" is a lead to confirm in the right layer, not a finding of its own. Remove ornaments, keep conventions: the goal is a simpler page, not an unusual one (A6).

**Step 3 – Other layers.** Go through the in-scope layer files. If the site has a main action, walk the main-task path (`H-quality.md`, H4) on desktop, phone and keyboard. Report each problem **once**, in its owning layer; elsewhere only refer to it:

| Problem | Owner | Referenced in |
|---|---|---|
| Marquee, carousel or animation without pause | B (2.2.2) | A |
| Content invisible at rest (opacity 0 until JS) | H1 (P1) | A (M5), B if hidden from screen readers |
| Gradient text / text on glow with weak contrast | B (1.4.3) | A (C2/C3) |
| Emoji or icon as the only label | B (1.1.1, 4.1.2) | A (L11) |
| Fake or unverified proof (numbers, testimonials, logos, portraits) | G1 | A (IM2, IM3, IM7) |
| Outdated library with a known vulnerability | D (A03) | I |
| Redundant or duplicated library | E | C, I |
| Cookie banner obscuring focus | B (2.4.11) | J |
| Fake scarcity, fake urgency, fake notifications | J2 | G1 only if the number is claimed as fact |
| Hard cancellation or refusal, hidden price or renewal terms | J2 | H4 (main-task path) |
| Persuasion tactic used dishonestly (decoy plan, identity shaming, fake progress) | J3 → the row it names | – |
| Heavy animation, video, effects | C | A (M1–M4) |
| Leftover template favicon or link preview | F4 | H |
| Phone: horizontal scroll, zoom blocked, small targets, hover/gesture-only content, mobile menu | K (with WCAG number) | B |
| Mobile Core Web Vitals | C | K |
| Content hidden on phones vs desktop | K | F |

**Step 4 – Removal test** (visual, copy, code economy). For each candidate: what information, action, hierarchy, state or brand meaning does it carry? Would removing it improve clarity without losing that role? Yes → remove or merge. No → smallest fix within the existing system. Propose a replacement only when removal would cause a real loss.

**Step 5 – Class, priority, limits.** Class: **Slop pattern** (generic default or decoration without a role), **Defect** (recognised usability, accessibility, security, performance, visibility, content or function problem), **Off-brand** (deviation from the brand file; usually P2).
- **P0** – blocks the task; severe accessibility barrier; exposed secret; unsupported component with known or actively exploited vulnerabilities; data sent over HTTP; **confirmed** fake proof ("Acme", "John Doe", stock photo as a client); site accidentally de-indexed.
- **P1** – materially harms understanding, trust, access, security, speed or visibility; also proof **to confirm** (numbers, testimonials, logos without source).
- **P2** – repeated slop, inconsistency or waste that weakens the product.
- **P3** – minor polish or good practice with small impact.

Limits (ceilings): visual layer **max 12** findings (Quick: 5); other layers **P0 and P1 always**, P2+P3 **max 2 per layer**. Group repeats into one systemic finding; drop low-impact ones rather than lengthen the list.

**Step 6 – Report.** Follow `assets/report-template.md`, in the user's language. Put "To remove" right after the verdict, always include "What works – keep", and end with the implementation prompt (in Quick mode: P0/P1 only). Then offer, without doing it, to switch to Improve.

## Improve (summary – full rules in `references/improve.md`)

Audit → plan in four categories (**Fixes** P0–P1, **Removals** of slop, **Polish** P2–P3, **Direction** – new font, palette, layout, hero concept, animations; always separate consent) → one consent question → changes on a copy, one at a time → verify each with the tool that found it → re-audit with a before/after diff → hand-over.

## Feedback style

- Plain language (`G-copy.md`, G3): most important first, short sentences, verbs, no passive voice or jargon.
- Lead with evidence, not taste. Name the pattern or criterion and its concrete harm. Numbers, not adjectives.
- Don't flatten character: if your fixes would turn the page into a template, you went too far – put what is good and distinctive in "What works – keep". No aesthetic is universally bad. No generic compliments.
- Cite a standard only when it directly supports the finding.
- Legal matters (GDPR, ePrivacy, accessibility acts/EAA, consumer law, the proposed DFA): "risk – for legal review", never a verdict.
