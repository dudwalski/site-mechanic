# B – Accessibility (WCAG 2.2)

Default target: **WCAG 2.2 AA**; another level only on request.

## B1. What this layer can and cannot state

- It finds **likely non-conformance** with specific success criteria; it never certifies conformance (that needs manual keyboard, zoom and assistive-tech testing of whole flows).
- Automation catches only part: in Deque's study (WCAG 2.1 AA, axe-core rules) tools found ~57% of issues by count but in only 16 of 50 criteria.
- Always give number and name, e.g. "1.4.3 Contrast (Minimum)". Never "the site is WCAG compliant".

Priority: blocks keyboard or screen-reader users from the task (no keyboard access, keyboard trap, unlabelled fields in a key flow) → P0; other A/AA failures → P1; better-than-AA practice → P3.

## B2. Legal context (information only)

- The European Accessibility Act (Directive 2019/882) applies from 28.06.2025; in Poland via the act of 26.04.2024 (PAD). It covers e-commerce, among others; micro-enterprises are exempt for services.
- EN 301 549 v4.1.1 (ETSI, 2.09.2026) builds on WCAG 2.2 AA and targets the EAA. **Status 20.11.2026:** not yet cited in the EU Official Journal (expected late 2026); v3.2.1 (WCAG 2.1 AA) is cited only for the public-sector directive (WAD); no version is cited under the EAA. Check on audit day. Meeting WCAG 2.2 AA ≠ meeting the whole standard.
- If the site sells online, add one sentence: "risk – for legal review (EAA/national act)". Don't judge whether the business is covered.

## B3. Automated check

With Chrome use `scripts/axe-browser.mjs` (real browser: JS, CSS, phone and desktop, post-click states, Tab order); without – `scripts/axe-scan.mjs` (jsdom, no JS or external styles). Both use `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa` (the `EN-301-549` tag adds nothing for web pages: chapter 9 maps to WCAG 2.1 AA). axe results become findings only after confirmation.

jsdom limits: **contrast** returns "incomplete" – check in a browser or on real colours. **Framework-inserted content** (Alpine `x-text`/`x-html`, Vue `v-text`/`v-html`/`{{ }}`, Angular, Knockout `data-bind`) doesn't exist there, so missing-name violations (`button-name`, `link-name`, `label`, `image-alt` with `:alt`/`x-bind:alt`) on such elements are likely false alarms – listed in `mayBeFalsePositive`. Confirm in a browser before reporting; otherwise at most "Unknowns".

Impeccable's accessibility hits (`low-contrast`, `gray-on-color`, `skipped-heading`) are reported here, not in A.

## B4. Key AA criteria

**Usually detectable from code or automatically**

| Criterion | Check |
|---|---|
| 1.1.1 Non-text Content | meaningful images have real `alt`; decorative `alt=""`; icon-only buttons have an accessible name |
| 1.3.1 Info and Relationships | real headings, lists, tables, form labels, landmarks in code |
| 1.3.5 Identify Input Purpose | personal-data fields have `autocomplete` |
| 1.4.3 Contrast (Minimum) | 4.5:1 normal text, 3:1 large (real colours; text on photos/gradients by hand at the weakest point) |
| 2.4.1 Bypass Blocks | skip link or landmarks |
| 2.4.2 Page Titled | descriptive `<title>` per page |
| 2.4.4 Link Purpose (In Context) | no empty links; link text makes sense in context |
| 2.5.8 Target Size (Minimum) – new in 2.2 | ≥24×24 CSS px or enough spacing (exceptions: inline links, UA controls, equivalent control) – on phones report in K |
| 3.1.1 Language of Page | `lang` on `<html>` matches content |
| 4.1.2 Name, Role, Value | custom controls (menus, tabs, accordions, carousels) expose name, role, state |

**Need manual or visual checking**

| Criterion | Check |
|---|---|
| 1.2.2 / 1.2.5 Captions, Audio Description | videos with speech have captions; info shown only visually is described |
| 1.3.2 Meaningful Sequence | reading order matches visual order where it matters |
| 1.4.1 Use of Colour | colour isn't the only cue (inline links, errors, required fields) |
| 1.4.4 Resize Text / 1.4.10 Reflow | usable at 200% text and 320 CSS px without horizontal scroll – phone issues go to K |
| 1.4.11 Non-text Contrast | 3:1 for component borders, meaningful icons, focus indicators |
| 1.4.12 Text Spacing | nothing clips with increased spacing |
| 1.4.13 Content on Hover or Focus | tooltips dismissible, hoverable, persistent |
| 2.1.1 Keyboard / 2.1.2 No Keyboard Trap | everything works by keyboard; focus never sticks (modals, menus, embeds) |
| 2.2.2 Pause, Stop, Hide | anything moving >5 s (carousels, marquees, background video) can be paused |
| 2.3.1 Three Flashes | nothing flashes more than 3×/s |
| 2.4.3 Focus Order / 2.4.7 Focus Visible | logical order; visible indicator (no outline removal without replacement) |
| 2.4.11 Focus Not Obscured (Minimum) – new in 2.2 | focused element not fully hidden by sticky header, cookie banner, chat widget |
| 2.5.3 Label in Name | visible label text is part of the accessible name |
| 2.5.7 Dragging Movements – new in 2.2 | drag-only interactions have a single-pointer alternative (phone gestures and 2.5.1 → K) |
| 3.2.6 Consistent Help – new in 2.2 (A) | contact/help links in the same relative order across pages |
| 3.3.1 / 3.3.2 Error Identification, Labels | errors described in text; visible labels, not placeholder only (axe accepts placeholder as a name, so it won't flag this) |
| 3.3.7 Redundant Entry – new in 2.2 (A) | data entered earlier in the flow isn't required again |
| 3.3.8 Accessible Authentication (Minimum) – new in 2.2 | login allows password managers and paste; no puzzle-only step |

## B5. Overlap with A and K

Report once, here, with the criterion (SKILL.md step 3 table): marquee/auto-scroll without pause → 2.2.2; gradient text or text on glow/photos → 1.4.3; emoji or icon as the only label → 1.1.1/4.1.2; cookie banner or sticky bar obscuring focus → 2.4.11. On phones, 1.3.4, 1.4.10, 2.5.1, 2.5.8 and zoom blocking (1.4.4) go to K with the number; here only a reference.

Honouring `prefers-reduced-motion` for decorative animation is good practice; 2.3.3 is AAA, so with an AA target it is P3.
