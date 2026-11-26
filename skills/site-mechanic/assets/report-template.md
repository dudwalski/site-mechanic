# Report template

Write in the user's language, in plain language (`G-copy.md`, G3): direct, most important first, short sentences, numbers instead of adjectives ("12 px #AAAAAA on white – 2.3:1, required 4.5:1", not "hard to see"). Keep it tight: skip empty sections and layers without findings, but list unchecked layers in "Unknowns". Keep section names (translated) and order – it makes reports comparable. Zero findings in a section is valid – then one sentence on what was checked.

```md
## Scope
- Audit date; mode (Audit / Improve / Quick) and layers in scope
- What was checked: project type (landing / site / platform), code version (repo, branch, commit or archive name), live URLs, pages and paths, views (desktop/mobile, widths), states
- Tools run, with versions (`check-versions.mjs`: pinned or newer in the same line)
- Tools not run and why (one line)
- Assumptions made without the user's answer (if any)
- Main-task path (H4): which task, on which views, where you stopped
- Layer coverage:

| Layer | State | Based on |
|---|---|---|
| A–K, one row each | Checked / Partial / Not checked | material and tools, e.g. "code + mobile-check", "screenshot only" |

## Verdict
**Max 4 sentences:** design thesis or its absence, main visual problem (name the cluster if any), the most serious defect from any layer, and what to do first.

## To remove
One line per element or cluster, most visible first (max 12): `[ID] what → remove / merge / replace within the existing system – where`. Slop from A and G only; evidence is in the tables below. Elements protected by the brand file don't go here.

## Visual findings
| ID | Priority | Class | Pattern (ID) | Evidence | Harm | Remove or fix | Evidence status | Confidence |
|---|---|---|---|---|---|---|---|---|

## Other layers
| ID | Layer | Priority | Problem | Evidence | Fix | Evidence status | Reference |
|---|---|---|---|---|---|---|---|
(Layers B–K. Reference = WCAG criterion, OWASP category, WSG number and name, Core Web Vitals metric, Google docs or version-data source – where applicable)

## What works – keep
- 2–5 concrete elements that are good and specific to this project (with evidence: selector, section, quote). No generic praise. This list protects the site's character from "fixes" that flatten it into a template.

## Technology inventory
(only when layer I is in scope; max 10 rows, problems first)
| Technology | Detected version | Detection evidence | Current version / status (source, date) | Assessment |
|---|---|---|---|---|

## Unknowns
- Per layer: what couldn't be checked and what data would make it possible

## Single biggest improvement
One sentence.

## Implementation – paste-ready prompt
(the block below, ready to copy into the chat that builds the project)
```

Column values:
- **Coverage state:** *Checked* – the material allowed judging the layer; *Partial* – only part (e.g. code without the live site); *Not checked* – no data or out of scope. "No findings" only with *Checked*; with *Partial*/*Not checked* the gaps go to "Unknowns" – never write "no problems".
- **ID:** layer letter + number (A1, B1, K1…), reused in the implementation block.
- **Class:** Slop pattern / Defect / Off-brand. **Evidence status:** Confirmed / Code risk / To confirm. **Confidence** (visual only): High / Medium from the catalogue; Low with partial evidence (e.g. screenshot only).

## The implementation block

Purpose: the user pastes it into the chat or tool building the project (Claude Code, Cursor, a project chat) and that executor applies the fixes without reading the whole report. It must be self-contained.

1. **Only what the executor can do alone.** Tasks come from findings that are Confirmed or Code risk. To-confirm findings, `[TO FILL IN]` content, Direction (new font, palette, layout) and legal matters go to "Owner decisions – don't implement".
2. **Concrete:** file and line (or selector, component), the exact change with values (colour with contrast, size, attribute), in the project framework's terms (Astro component, Tailwind class) when known.
3. **Checkable "Done when"** per task: axe rule gone, `scrollWidth` ≤ 320 at 320 px, contrast ≥ 4.5:1, Impeccable no longer reports rule X, link goes to Y.
4. **Order:** P0 → P1 → Removals (slop) → P2 → P3. Systemic findings as one task in the shared component or stylesheet.
5. **Boundaries:** "Don't change" list from "What works – keep" and the brand file. No new libraries, fonts or colours outside the brand file.
6. **Nothing invented:** no new marketing copy, numbers or testimonials; missing content as `[TO FILL IN: …]` under decisions.
7. **Length:** max 15 tasks. Gather remaining P3 into one "minor polish" task or omit and say how many.
8. **Language** as the report. In Improve mode the block contains only what the skill did not implement itself.

````md
```text
You are applying fixes to [name; type: landing/site/platform; stack: …]. These tasks come from an audit on [date]. Do them in order, one at a time, and check "Done when" after each. If a condition can't be met, stop and explain – don't work around it.

Working rules:
- Don't change: [list from "What works – keep" and the brand file].
- Don't add libraries, fonts, colours or marketing copy.
- Don't invent content. Where data is missing, leave [TO FILL IN].

Tasks:
1. [ID] [Priority] [Short title]
   Where: [file:line / selector / component]
   Change: [exactly what to what]
   Done when: [checkable condition]
2. …

Owner decisions – don't implement, just remind me at the end:
- [ID] [what needs deciding and why]

At the end list: changed files, the check result for each task (met / not met and why), and what you didn't do.
```
````

In Improve mode add "Change plan" after the audit report (format: `improve.md`, U2), and at the end "Change log" and "Diff report" (U6).
