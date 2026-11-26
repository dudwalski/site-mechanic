# Improve mode

Goal: apply the audit's changes to the project, verify each and show the before/after difference. "Maximum improvement" means **every justified change with evidence and verification** – not the most changes, and not a new look without consent.

## U0. Boundaries and where changes go

- **Change only what you can access:** files sent in the chat, a user folder connected to the session, or a repo. Never change the live site, CMS or hosting – give step-by-step instructions or a patch instead.
- **Never edit the uploaded original.** Work on a copy and hand back the changed files.
- In a user folder or repo ask in step 0 where to write: a) a project copy next to the original (recommended), b) in place (only if under git with a clean tree – check `git status`), c) patches only (`.diff`).
- No commits, pushes, deploys or publishing unless asked. No new dependencies, framework or build-tool changes without separate consent.
- All core rules in SKILL.md apply – especially never inventing content (rule 10).
- Never add persuasion tactics (scarcity, urgency, social proof widgets, decoy plans…) – only remove or correct manipulative ones (`J-privacy.md`, J3).

## U1. Entry audit

Audit per SKILL.md (full, unless the user narrowed layers). Given a report from this skill, re-confirm every finding in the current code and drop those gone. Show the audit before the plan. P2/P3 limits don't apply to the plan (they can enter as Polish) but still apply to the report.

## U2. Change plan

Every item comes from a finding with evidence.

| Category | Covers | Consent |
|---|---|---|
| **Fixes** | P0–P1 defects from all layers (accessibility, security, indexing, hidden content, overflow, diacritics in a fallback font) | shared plan consent |
| **Removals** | slop from A and G, dead code from E, redundant libraries – per the removal test | shared plan consent |
| **Polish** | P2–P3: brand-file conformance, typography, H details, F4 metadata | shared plan consent |
| **Direction** | new font, palette, section layout, hero concept, new animations or effects, rewritten copy | always separate, explicit (U8) |

Order: Fixes P0 → Fixes P1 → Removals (by cluster, one cause at a time) → Polish → Direction. Within a category, dependencies first (remove a library before rewriting the component that used it).

```md
| # | Category | Finding | Change | Location | Priority | Risk | How I'll verify |
|---|---|---|---|---|---|---|---|
| 1 | Fix | B: 1.1.1 missing alt (3 images) | descriptive alt; decorative alt="" | index.html:42, 57, 88 | P1 | low | axe: no `image-alt` |
```

Content you can't fix without the owner (real testimonials, numbers, product descriptions, alt text for product photos you don't know) goes in the plan as "needs content from the user"; leave `[TO FILL IN: …]` in code only with consent – otherwise leave it unchanged.

## U3. Consent

One question with options, e.g. a) Fixes + Removals + Polish (recommended), b) Fixes P0–P1 only, c) selected items (give numbers). Ask about Direction separately (U8). Unattended: only P0–P1 Fixes that change neither look nor content; leave the rest as a plan.

## U4. Making changes

0. **Wiring snapshot first** (when there are `.html` files – source or built, e.g. Astro `dist/`): `npx --yes impeccable@<version> detect --before <files.html>`. It records links, forms, fields, buttons, handlers, IDs, scripts and label bindings in `.impeccable/wiring/` **in the current directory** (with its own `.gitignore`) – run `--before` and `--kept` from the same, preferably temp, directory so nothing is added to the project. With a build step: on the pre-change build output.
1. **One change at a time** → verify (U5) → next. Plans over ~15 items: show progress after each category.
2. **Smallest change that removes the problem.** No reformatting whole files, no needless renames, no touching unrelated code.
3. **Within the existing system:** project conventions, existing tokens and variables, brand file. New values (colour, radius, spacing) only in Direction.
4. **Platform before library:** native elements (`<button>`, `<dialog>`, `<details>`) and CSS instead of JS if they pass the no-loss test (`E-code-economy.md`, E1) and Baseline fits the required browsers.
5. **Motion:** every animation you keep or fix gets a `prefers-reduced-motion: reduce` variant showing a stable end state.
6. **Change log:** per item – file, what changed, why (finding ID), verification result.
7. A change fails verification or breaks something → **revert it**, log it, move on.

## U5. Verifying each change

- **The tool that found it:** Impeccable (rule gone), `axe-browser.mjs`/`axe-scan.mjs` (violation gone), retire/npm audit (vulnerability gone), purgecss/knip (no references to removed code).
- **No regressions:** the same tools show no new findings in changed files.
- **Wiring kept:** `npx --yes impeccable@<version> detect --kept <files.html>` (rebuild first if there is a build). Exit 0 = nothing lost; 1 = element missing ("MISSING" list – revert or justify in the log if removal was the goal, e.g. a redundant link); 2 = no snapshot for the file. Covers `.html` only, not source components (`.astro`, `.jsx`, `.vue`).
- **Project scripts:** if the project has `build`, `test` or `lint`, run them after each category – locally or in the sandbox, never on production.
- **Look:** with a screenshot tool or browser compare before/after on desktop and phone (390 px, plus 320 px for layout changes; `K-mobile.md`). Without one – log what the user should look at and where.
- **No-loss test** (E1) for everything removed.

## U6. Re-audit and diff report

After all changes, audit the same pages and layers with the same tool versions:

```md
## Diff report
| Finding | Before | After | Status |
|---|---|---|---|
| A: "Generic SaaS" cluster | P2 | – | gone |
| B: 1.4.3 hero contrast | P1 | P1 | remains – needs a colour decision (Direction) |
| H: card overflow at 320 px | – | P1 | new – change 7 reverted |
```

## U7. Hand-over

1. Changed files (or `.diff` patches) where agreed in U0; 2. change log; 3. diff report; 4. what remains and why (needs content, legal decision, Direction, server/CMS access); 5. one next step.

## U8. "Direction" (changing the look)

Propose only if (a) the user asks for maximum improvement, a new look or a refresh, or (b) the main slop cluster is caused by the whole visual layer and can't be removed without a replacement. Then:

1. **Brand file first.** None → propose creating `DESIGN.md` (`assets/DESIGN-template.md`); all Direction decisions go there and code uses them via tokens.
2. **Ground it in the subject:** product, audience, main task, things specific to the industry (materials, vocabulary, imagery). If a `frontend-design` skill is available in the session, read it first.
3. **Max 3 directions with a recommendation.** Each: palette of 4–6 named hex colours with roles, typefaces and roles, layout concept (1–2 sentences), one memorable element; everything else calm.
4. **Reference principles, not looks.** Justify each direction with A5 principles (`A-visual.md`), e.g. "one accent, navigation quieter than content". Never "in the style of" a brand. Brand sources for the principles are below.
5. **Plan critique.** Before showing it: would a similar request for a different product produce the same plan? If yes, it's a default – fix it and say what you changed. If it follows from this product, say so.
6. **Slop-for-slop test.** Check each direction against the A2 clusters. Swapping a purple gradient for cream + serif + terracotta/sage trades one default for another – reject unless the brand calls for it.
7. **Typeface conditions:** web-use licence (e.g. OFL); needed diacritics (Polish: `latin-ext`); max 2 families and only used weights; WOFF2; `font-display`.
8. **Contrast** of every text/background pair checked before implementing (4.5:1 / 3:1).
9. **Copy** as variants to approve; never replace the brand voice yourself.
10. After approval: `DESIGN.md` first, then tokens, then components – with full verification (U5) and re-audit (U6).

**Brand sources for A5 principles** (checked 20.11.2026, summarised in our own words; recheck after 05.2027):

| Brand | Principles | Source |
|---|---|---|
| Apple | HIG's eight principles (restored 8.06.2026): purpose, agency (freedom, easy undo), responsibility (safety, privacy, transparency), familiarity, flexibility, simplicity, care, delight – not to be confused with decoration | developer.apple.com/design/human-interface-guidelines/design-principles |
| Duolingo | details build trust; consistency only when the repeated element communicates; simplifying must not cost clarity; small deliberate set of text styles; space instead of boxes; constant voice, situational tone | blog.duolingo.com/core-tabs-redesign; design.duolingo.com |
| Linear | "don't compete for attention you haven't earned"; "structure should be felt, not seen"; quality covers the whole experience | linear.app/blog/behind-the-latest-design-refresh (12.03.2026); linear.app/blog/why-is-quality-so-rare |
| Pentagram | idea before form – without an idea design becomes decoration; the idea comes from the subject; identity is a system, not a logo | partner interviews (M. Willer – Creative Bloq; M. Bierut – "How to", Design Week) |
| Muji | "no brand, good quality": material selection, streamlined process, reduced packaging; simplicity as the result of thought; on a site: real material, short path, little "packaging" around content | muji.com/jp/about/en; muji.eu/pages/about-muji.html |
| Airbnb | DLS principles (2016): unified, universal, iconic, conversational (motion that communicates) | airbnb.design/building-a-visual-language; airbnb.design/the-way-we-build |
| Aesop | considered design improves lives; respect for function and place – fit and add rather than impose; nothing superfluous | aesop.com/philosophy-on-design.html |
| Notion | restraint – not every feature shouts; incremental change; new capabilities where users already work; spacing by fixed rules | Fortune interview with R. Hunt (12.06.2026); notion.com/blog/updating-the-design-of-notion-pages |
| Stripe | colour accessibility predictable from the system, not trial and error; accessible and vibrant at once; perceptually uniform scales | stripe.com/blog/accessible-color-systems |
| Framer | hierarchy says what to do next; speed; mobile by how people really use it; accessibility before effects; simpler navigation; frictionless forms | framer.com/blog/ux-website-design-principles |
