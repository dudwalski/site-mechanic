# E – Code economy (dead and redundant code)

Goal: code that can be removed or written shorter **with no loss** of function, accessibility, required browser support or maintainability. Group P2/P3 by cause.

## E1. No-loss test – apply to every candidate

1. **Same behaviour** – identical result and interactions, incl. edge cases and error states.
2. **Same accessibility** – roles, names, keyboard handling, focus management kept or better.
3. **Same browser support** – the replacement works where the project must work. Check Baseline status (`I-technology.md`); unknown requirements → mark "check support".
4. **Not harder to maintain** – shorter but obscure is not better.
5. **Evidence** – file:line and an estimate of what goes (lines, dependency, kB). Don't invent byte counts; write "estimate" or measure.

Any point failed or unknown → drop the candidate or report it with an open question. Audit mode only recommends; Improve removes after consent and with verification (`improve.md`).

## E2. What to look for

| Pattern | Typical replacement | Caveat |
|---|---|---|
| Dead code: unused CSS rules, JS functions and exports, files, dependencies | remove | classes added by JS or a CMS look unused to tools |
| Duplicated styles or near-identical components | one component or class with a variant | keep real hierarchy differences |
| Library for what the platform does (jQuery for selection, animation lib for a fade, carousel lib for a static row, date lib for one function) | native DOM APIs, CSS transitions, `scroll-snap`, `Intl` | the library may cover edge cases or old browsers the project needs |
| JS doing CSS work (hover, show/hide, sticky header, smooth scroll, simple layouts) | `:hover`, `position: sticky`, `scroll-behavior`, grid/flex | respect `prefers-reduced-motion` |
| Custom widgets recreating native ones (div buttons, custom selects, modals, accordions) | `<button>`, `<select>`, `<dialog>`, `<details>`/`<summary>` | native elements also fix many a11y issues; check styling needs |
| Deep nesting (div soup) and redundant ARIA on native elements | flat semantic markup | layout may depend on wrappers |
| Repeated inline SVG or base64 images | one sprite/`<use>` or a cached file | – |
| Over-specific selectors or warring `!important` | simpler selectors, fewer overrides | test the cascade after |
| Leftovers: commented-out blocks, console logs, demo/test code, stub components | remove | – |

## E3. Tools

purgecss (CSS vs HTML/JS – the difference is candidates), knip (unused files, exports, dependencies in JS/TS projects with package.json), Chrome DevTools Coverage (unused bytes on real load). Commands: `tools.md`. All miss dynamic use – their output is candidates, not findings.

References: WSG 3.2 (minify and remove unused code), 3.4 (avoid redundancy and duplication), 3.12 (use dependencies sparingly).
