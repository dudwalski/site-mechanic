# H – Build quality and detail

H1 defects come before H2/H3 details. Accessibility defects belong to B, phone-only issues (incl. `100vh` on mobile) to K – don't report twice.

## H1. Recognised defects

Not a matter of taste – report with evidence.

| Defect | How to check | Typical priority | IMP rule / source |
|---|---|---|---|
| Broken images, dead links, placeholder text, unhandled script errors | console, link check | P1 | `broken-image`, `script-error` |
| Content invisible at rest because the animation didn't run | disable JS or check initial opacity | P1 | `content-hidden-at-rest` |
| Overflow, clipping, overlapping elements | desktop view and long content (phone: K) | P1 | `text-overflow`, `text-occlusion` |
| Hidden or competing main action | one clear main action per view | P1 | MT |
| **Diacritics in a fallback font** – e.g. Polish ą ę ł ś ź ż ć ń ó render in another typeface because the font file lacks Latin Extended-A | screenshot with such characters. In code: **own** `@font-face` (self-hosted, Fontsource, subsetting tools) with a single `latin` file or `unicode-range` without U+0100–017F. **Don't flag** `subset=latin` in a Google Fonts URL: browsers supporting `unicode-range` get all subsets and the `css2` endpoint ignores that parameter. Exception: the `text=` parameter – the font then has only those characters | P1 for headings and logo, else P2 | – |
| Layout breaks with real content (long names, translations, big numbers) | insert long text | P2 | MT |
| Uncomfortable reading | body text below 14 px (ideal 16), line-height below 1.3 (ideal 1.5–1.7), lines over ~80 characters | P2 | `tiny-text`, `tight-leading`, `line-length` |
| Missing states in an observed flow (loading, empty, error, success) | walk the flow | P2 | MT, ANT |
| Justified on-screen text with "rivers" | running text view | P2 | `justified-text` |
| Irreversible action (delete, cancel order, send) without confirmation or undo | try it; is there "Undo" or a confirmation with a clear "Cancel" | P1 | APL |
| Modal without an obvious exit; feedback only in an alert | close via button, Esc, outside click; is the result visible in the UI | P2 | APL |

## H2. Polish typography (Polish pages)

| Detail | Fix | Priority |
|---|---|---|
| Single-letter conjunctions/prepositions (a, i, o, u, w, z) at line end | non-breaking space `&nbsp;` after them – by hand or in the CMS; `text-wrap: pretty` doesn't solve it | P3 |
| English quotes ("…") in Polish text | „…”; nested quotes « » or » « | P3 |
| Hyphen instead of en dash in ranges and asides | en dash (–): "10–12" | P3 |

## H3. Craft details (P3 polish)

Only when clearly visible and the fix is small. **No additions:** in Audit don't recommend new animations or effects; in Improve they belong to "Direction". Motion details below only refine animations already on the page.

| Detail | Fix | Source |
|---|---|---|
| Nested radii look off | inner radius = outer radius − padding | geometry |
| Digits jump when values change | `font-variant-numeric: tabular-nums` (Baseline widely available) | Emil Kowalski's skills |
| Existing dropdown grows from the wrong place | `transform-origin` at the trigger; modals centred | Emil Kowalski |
| Existing appear transition feels sluggish | `ease-out`, under 300 ms; not `ease-in` for entering | Emil Kowalski |
| Existing entrance starts from `scale(0)` | start at `scale(0.9–0.97)` + `opacity: 0` | Emil Kowalski |
| Heading breaks with one word on the last line | `text-wrap: balance` for headings; `text-wrap: pretty` only as progressive enhancement. Check both in `web-features` on audit day (3.47.0, 19.11.2026: `balance` newly available since 13.05.2024 – may turn widely available in a next release; `pretty` limited) | `unbalanced-heading`, `straggler` |
| Gradients go grey in the middle | interpolate in OKLCH: `linear-gradient(in oklch, …)` (Baseline newly available since 06.2024) | web-features |

Check Baseline status on audit day (`I-technology.md`, "Web platform features").

## H4. Main-task path (a walk-through, not a layer)

Walk the site's most important task end to end as a user would: purchase, form submission, sign-up, booking, finding a specific piece of information. For a platform – each task in scope. Do it on desktop, on a phone (emulation, `scripts/mobile-check.mjs`) and keyboard-only.

| Question | Typical problem | Finding layer |
|---|---|---|
| 1. Do I know what I can do here? | no main action, hidden or competing | H1 |
| 2. Do I know the next step? | vague button, no step indicator in multi-step flows | G2, H1 |
| 3. Can I complete the task? | dead link, form without target, unlabelled field, obscured button | H1, B, D (form over HTTP) |
| 3a. Is the price honest? | fees added late, pre-ticked extras, countdowns, "only 2 left" | J2 |
| 4. Do I get confirmation? | no success state, result only in an alert, unclear what next | H1 |
| 5. What happens after an error? | error without a fix, lost input, validation only on submit | G2, H1, B (3.3.1, 3.3.3) |
| 6. Can I go back? | no undo or confirmation on irreversible actions, modal without exit; cancelling or refusing harder than signing up | H1, J2 |
| 7. Does it work on a phone and keyboard? | hover-only menu, small target, input below 16 px, focus trap | K, B (2.1.1, 2.1.2) |

- Never submit real forms to a production server without consent (data, payments, emails to people) – check up to submission or on a local copy.
- Record findings once, in the finding layer. In "Scope" add one sentence: which task you walked and where you stopped.
- **No conversion conclusions.** The walk shows obstacles, not their sales impact – that needs analytics or user research.
