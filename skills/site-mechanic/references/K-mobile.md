# K – Mobile first (works on phones)

Goal: the site **works and displays well on a phone** – layout, touch, forms, navigation, overlays, and parity with desktop content. Judge the result on the device, not the CSS method: desktop-first stylesheets (`max-width` queries) aren't a defect if the phone experience works.

**Ownership:** phone problems are reported **here**, including WCAG failures – add the criterion in "Reference" (1.3.4, 1.4.4 for zoom blocking, 1.4.10, 2.5.1, 2.5.8); B only refers to them. Mobile Core Web Vitals stay in C, link previews in F, font diacritics in H.

## K0. Method and data

**Widths (portrait):** 320 px (1.4.10 threshold), 360, 390, 412. **Landscape:** ~844×390. Full page height, plus states: open menu, form with on-screen keyboard, cookie banner before a choice.

**Sources, best first:**
1. Real devices – iPhone (Safari) and Android (Chrome). Only here you see the on-screen keyboard, browser bars, gestures and touch.
2. **Device emulation** – with a shell and Chrome/Chromium **always** run `scripts/mobile-check.mjs` (`tools.md`, T4): all widths with phone emulation (`isMobile`, touch) plus screenshots. Without a shell: DevTools device mode. Resizing a desktop window alone isn't enough – it ignores viewport meta. Emulation lacks real touch, keyboard and browser bars – say so.
3. Lighthouse/PageSpeed (mobile) – performance and some accessibility checks (report in C and B).
4. Code: viewport meta, media queries, units, input styles (K2) – gives "Code risk", not visual confirmation.

Google's **Mobile-Friendly Test** and Search Console's **Mobile Usability** report were retired on 1.12.2023 – don't refer to them; Lighthouse replaces them.

**Can't resize or screenshot** (common with remote-controlled browsers): in step 0 ask for phone or device-mode screenshots – max 3: (1) full home page at 390 px, (2) open menu, (3) a form with the keyboard open. Without them, visual findings here are "Code risk" and "Unknowns" lists the missing mobile view.

## K1. Checklist

| Check | How | Reference | Typical priority |
|---|---|---|---|
| **Viewport meta** present, zoom not blocked | `<meta name="viewport" content="width=device-width, initial-scale=1">`; no `user-scalable=no` or low `maximum-scale` (axe `meta-viewport`). Missing = rendered as desktop and zoomed out | WCAG 1.4.4 (zoom) | P1 |
| **No horizontal scroll** at 320 px | fixed widths, `min-width`, images without `max-width: 100%`, long URLs/words without `overflow-wrap: anywhere`, negative margins, `100vw` with a scrollbar. Exception: 2D content (maps, charts, large tables) in its own scroll container | WCAG 1.4.10 | P1 |
| **Both orientations** | no forced portrait/landscape; in landscape (~390 px tall) content isn't hidden under sticky elements | WCAG 1.3.4 | P1 lock; P2 obscuring |
| **Touch targets** | min 24×24 CSS px or enough spacing (exceptions: inline links, equivalent control); for main actions and navigation aim for 44×44 (Apple HIG 44×44 pt; Material 48×48 dp; WCAG 2.5.5 AAA 44×44 px). Check dense footer links, social icons, close buttons | WCAG 2.5.8, platform practice | P1 below 24 px; P2/P3 below 44 px on main actions |
| **Nothing depends on hover** | submenus, tooltips, descriptions or buttons shown only on `:hover` are unreachable on touch; hover effects outside `@media (hover: hover)` "stick" after a tap (interaction media queries: Baseline widely available) | – | P1 if content/navigation unreachable; P3 sticky hover |
| **Gestures have alternatives** | carousels and sliders not swipe-only – buttons or dots; dragging has a single-tap alternative | WCAG 2.5.1 (A), 2.5.7 | P1 if content is gesture-only |
| **Form fields on phones** | input text ≥16 px – smaller triggers iOS auto-zoom on focus (fix: 16 px, **not** blocking zoom); right `type` (`email`, `tel`, `url`; `number` only for numbers) or `inputmode`; `enterkeyhint` (Baseline widely available); keyboard doesn't cover the active field or its error. Missing `autocomplete` → B (1.3.5) | – | P2 |
| **Mobile navigation** | menu button is a `<button>` with a name and `aria-expanded`; opens and closes (also Escape), scrolls when long, closes after navigating; page behind doesn't scroll with it | WCAG 4.1.2 | P1 if navigation fails |
| **Sticky elements don't eat the screen** | header + cookie banner + chat + bottom bar together at 390×844 and landscape; with `viewport-fit=cover`, bottom bars use `env(safe-area-inset-bottom)` (Baseline widely available). Working rule: flag overlays permanently covering more than 1/3 of the screen height | WSG 2.5 | P2 |
| **No intrusive interstitials on entry** | full-screen or content-covering dialogs right after entry (newsletter, app install, promo); Google recommends discreet banners – legally required overlays (consent) excepted, but they should leave content visible | Google "Avoid intrusive interstitials and dialogs" | P2 (consent design: J) |
| **Full-screen section height** | `100vh` on phones jumps or hides content under the browser bar; `100svh` for a marketing hero, `100dvh` for an app shell (Baseline widely available) | – | P2–P3 |
| **Wide content** | tables, code blocks, embeds (maps, video) in a scroll container with a visible hint or rebuilt as cards; embeds with `aspect-ratio` | WCAG 1.4.10 (2D exception) | P2 |
| **Same content as desktop** | content, links, structured data, alt text not hidden on phones (`display: none` in mobile queries, "lite version"). Google indexes and ranks the mobile version | Google mobile-first indexing | P1 if key content is missing |
| **One-tap actions** (local businesses, shops) | phone as `tel:`, email as `mailto:`, address linked to a map, opening hours as text | – | P3 |
| **Readability on a small screen** | body ~16 px, line-height and line length (H1); contrast as in B | H1, B (1.4.3) | refer to H/B |

## K2. Code signals (leads to confirm)

```
viewport meta: missing | user-scalable=no | maximum-scale=1
widths: width: <n>px on containers > 320 px, min-width on body/main/sections
units: height: 100vh on full-screen sections
hover: :hover outside @media (hover: hover) on content-revealing elements
positioning: position: fixed|sticky (count how many at top and bottom at once)
forms: font-size < 16px on input/select/textarea; type="text" for email or phone
hiding: display:none in mobile queries on content, links, structured data
orientation: screen.orientation.lock, "rotate your phone" messages
```

Impeccable URL scans take `--viewport 390x844` (untested here); report `text-overflow`, `text-occlusion`, `tiny-text` here if they occur only on mobile.

## K3. Priorities

- **P0:** the site's main task (contact, purchase, sign-up) is impossible on a phone – button off-screen, form covered by an overlay with no close, navigation won't open.
- **P1:** no viewport meta, zoom blocked, horizontal scroll at 320 px, hover-only or gesture-only content, targets below 24 px in key places, key content missing on mobile.
- **P2:** iOS auto-zoom fields, wrong input types, overlays eating the screen, intrusive entry dialogs, `100vh` hiding content, wide content without a container.
- **P3:** targets below 44 px on secondary actions, sticky hover, no `tel:`/`mailto:`.
