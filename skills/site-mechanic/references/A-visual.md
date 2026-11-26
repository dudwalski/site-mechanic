# A – Visual layer (AI slop)

## A0. Brand file

The brand file tells the audit what is intentional; without it, a deliberate choice (purple as brand colour, Inter as brand font) gets flagged.

1. Read it in step 0. What it defines is not slop – drop matching scanner leads and catalogue hits.
2. Check conformance: colours, fonts, radii, spacing or motion outside it → class "Off-brand" (usually P2).
3. If the brand file itself combines several signals (cream + italic serif + terracotta), don't challenge it. You may note once, in the verdict, that the brand is close to a common generated look – as information, not a finding.
4. **It doesn't exempt other layers:** a brand colour with low contrast is still B (1.4.3); a brand font without needed diacritics is still H1.

Formats: `DESIGN.md`, exported brand book (PDF/markdown), token file (JSON/CSS variables). Template: `assets/DESIGN-template.md`.

**Tokens in code ≠ brand file.** CSS variables, Tailwind config or `tokens.json` show consistency, not intent – generated templates have tokens too. Treat them as the brand only if the user confirms (step 0, e.g. "Are the colours and fonts in `global.css` your brand identity? a) yes b) no c) partly – which") or there is independent evidence (logo, brand book, print, social profiles in the same colours and typefaces – say where). Otherwise report signals from tokens normally, add "may be intentional – confirm", and lower Confidence one level.

**Impeccable and the brand file:** slop rules (`cream-palette`, `overused-font`, `italic-serif-display`…) are **never** switched off by a brand file – filter by hand per point 1. Conformance rules (`design-system-font`, `-color`, `-radius`, `-font-size`) run only when `DESIGN.md` sits in the project root (or `.agents/context/`, `docs/`) with tokens in frontmatter, as produced by Impeccable's `document` command. The `DESIGN-template.md` format (no frontmatter) doesn't trigger them – check conformance by hand.

## A1. Sources and confidence

- **ANT** – Anthropic `frontend-design` skill: current clusters of generated looks.
- **IMP** – Impeccable detector rules (pbakaus/impeccable 4.10.0); extends ANT.
- **MT** – Meng To's `no-ai-design-slop` catalogue; builds on IMP plus own rules.
- **UNS** – unslop-ui (JCarterJohnson/vibecoded-design-tells): 3,214,533 posts scanned from 47 subreddits (2020–2026), 46,971 about AI-built sites; the main ranking rests on 3,033 comments from 125 threads on how people spot such sites. 3.2 M is the searched base, not a sample – draw no trend conclusions.
- **APL** – Apple HIG principles (8.06.2026) and ideas from dickwu/apple-design-skill (design thesis, "What works", plan critique), in our own words. APL never affects slop Confidence.

- **PRA** – practitioner lists and press (2025–2026: designers' "AI slop" lists, anti-slop skill catalogues, Kyle Chayka in The New Yorker). Opinions, not data.

ANT, IMP and MT are one lineage; UNS is the only independent empirical source. **High** = UNS has a counted category **and** at least one of ANT/IMP/MT. **Medium** = only the ANT/IMP/MT lineage, or only UNS (or UNS quotes without counts). **Low** = PRA only – report only as part of a cluster or when the harm is clear (e.g. illegible dithered text), never alone.

Even High means "often called generic", never "proof of AI". The most frequent UNS complaint is not a feature but interchangeability ("everything looks the same", ~6.1% of comments vs 2.5% for the top concrete feature, untouched shadcn/Tailwind). Small samples – trust order over percentages.

## A2. Clusters (check first)

A cluster is several signals with one cause: report it as one systemic finding and fix the cause once.

| Cluster | Typical elements |
|---|---|
| **Generic AI SaaS** | tracked label above an oversized sentence headline, purple gradient, radial glow, cards with icon tiles, vague copy, centred hero with two buttons and three cards |
| **"Tasteful" default** | warm cream background (~#F4F1EA), high-contrast or italic serif headings, terracotta/clay accent (~#D97757 – ANT) or sage/bottle green (UNS) |
| **Dark + neon** | near-black background, one loud accent (acid green or vermilion – ANT; neon – UNS), glowing shadows and halos |
| **SaaS card kit** | content chopped into identical rounded cards, one radius everywhere, same soft grey shadow, cards in cards, decorative gradients |
| **Template ornaments** | tracked UPPERCASE labels above headings, `A · B · C` strings, `WORD — fragment` labels, monospace micro-labels, `→` glued to links, 01/02/03 numbering on non-sequential content |
| **Animation theatre** | fade-up on every section, hover-lift on every card, marquee, pulsing dots, content invisible until JS runs, no reduced-motion variant |
| **Faux sophistication** | decorative grid background, monospace labels, fake dashboards and charts, blinking cursor, technical copy with no product evidence |
| **Newspaper layout** | hairlines, zero radii, dense newspaper columns regardless of subject |

## A3. Single signals

Code signals are leads for search or the scanner; confirm visually. IMP = detector rule ID, if any.

### Colour and light

| ID | Signal | Code signal | IMP | Conf. |
|---|---|---|---|---|
| C1 | Purple/indigo as primary or gradient; cyan on dark | hues ~250–300, `#7c3aed`, `indigo-*`, `violet-*` | `ai-color-palette` | High |
| C2 | Gradient text in headings or numbers | `background-clip: text` + gradient | `gradient-text` | High |
| C3 | Coloured glowing shadows, radial halos or spotlights on dark | coloured `box-shadow`/`text-shadow` without offset; coloured `radial-gradient` to transparent | `dark-glow`, `radial-halo`, `radial-spotlight-glow` | High |
| C4 | Warm cream/beige background picked by reflex | ~`#F4F1EA`, `#FAF7F2`, `bg-stone-50`, `bg-amber-50` | `cream-palette` | Medium |
| C5 | Decorative gradients on many surfaces | repeated decorative `linear-gradient` | – | High |
| C6 | Terracotta/clay accent ~`#D97757` (Claude's own accent) | that hue as main accent | – | Medium |
| C7 | Decorative repeating-gradient stripes on surfaces | `repeating-linear-gradient`, `repeating-radial-gradient` as ornament | `repeating-stripes-gradient` | Medium |

### Typography

| ID | Signal | Code signal | IMP | Conf. |
|---|---|---|---|---|
| T1 | Overused font as brand voice (IMP: Inter, Roboto, Fraunces, Geist, Plus Jakarta Sans, Space Grotesk; UNS: Inter, Geist, system defaults) | `font-family` | `overused-font` | High |
| T2 | Oversized, often italic serif hero heading (Fraunces, Recoleta, Playfair, Instrument Serif, Newsreader) | serif in h1 | `italic-serif-display` | Medium |
| T3 | Tiny tracked uppercase label or "pill" above a heading | `text-transform: uppercase` + `letter-spacing` right before h1/h2 | `kicker-above-heading`, `hero-eyebrow-chip` | Medium |
| T4 | Oversized sentence headline filling the first screen | long display-size h1 | `oversized-h1` | High |
| T5 | Monospace in micro-labels without a technical reason | `font-family: monospace` in labels | – | Medium |
| T6 | One heading word set off in italic, bold or colour | `<em>`/`<span>` in h1/h2 | – | Medium |
| T7 | `A · B · C` strings, `WORD — fragment` labels, `→` glued to links or on every button ("Get started →") | literal `·`, ` — `, `→` | – | Medium |
| T8 | Flat type hierarchy (size steps below ~1.25×) | `font-size` scale | `flat-type-hierarchy` | Medium |
| T9 | Heading letter-spacing squeezed until glyphs touch | negative `letter-spacing` | `extreme-negative-tracking` | Medium |

### Layout and components

| ID | Signal | Code signal | IMP | Conf. |
|---|---|---|---|---|
| L1 | Centred hero + two buttons + three identical feature cards + CTA regardless of customer journey | page skeleton | – | High |
| L2 | Small rounded icon tile above the heading in every card | fixed-size box before h3 | `icon-tile-stack` | Medium |
| L3 | Identical rounded cards, one radius for everything, same soft shadow | one `border-radius` and `box-shadow` token everywhere | – | Medium |
| L4 | Cards in cards without real hierarchy | card class inside card class | `nested-cards` | Medium |
| L5 | Thick accent bar on one side of a rounded card | `border-left: 3px+` with `border-radius` | `side-tab`, `border-accent-on-rounded` | Medium |
| L6 | 01/02/03 numbering on non-sequential content | repeated small number labels | `numbered-section-labels` | Medium |
| L7 | Decorative grid or line field in the background | tiled thin `linear-gradient` layers | `codex-grid-background` | Medium |
| L8 | Everything centred, including longer paragraphs | `text-align: center` on running text | – | High |
| L9 | Pills and large radii everywhere | `rounded-full` everywhere | – | High |
| L10 | Unstyled default component kit (default palette, radii, shadcn/Tailwind components) | untouched default config | – | Medium (top concrete UNS feature) |
| L11 | Emoji or sparkle icons as icons, bullets or "AI/magic" markers (✨ 🚀 ⚡, ✦, Lucide `Sparkles`) | emoji in headings, lists, buttons; sparkle SVG next to features or CTAs | – | Medium |
| L12 | Thin border + wide blurred shadow on every card in a row | `1px` border + large shadow | `gpt-thin-border-wide-shadow` | Medium |
| L13 | Monotonous spacing – one value everywhere, no rhythm | same margin/gap everywhere | `monotonous-spacing` | Medium |
| L14 | Illustration assembled from simple SVG shapes | large inline SVG of circles and rects | `shape-assembled-illustration` | Medium |
| L15 | Hero built from a big number with a small label, supporting stats and a gradient accent when the subject doesn't call for it | number block in first screen | – | Medium |

### Motion

| ID | Signal | Code signal | IMP | Conf. |
|---|---|---|---|---|
| M1 | Fade-up on every section | scroll-triggered animation on all sections | – | High |
| M2 | Lift or scale on hover on every card or image | `:hover { transform: translateY/scale }` everywhere | – | High |
| M3 | Self-scrolling strip (marquee) | infinite translating `@keyframes` | `marquee` | Medium |
| M4 | Decorative pulsing status dots, blinking "typing" cursor in hero | infinite animation without live data | `pulsing-dot`, `blinking-cursor` | Medium |
| M5 | Content invisible at rest (opacity 0) until animation runs | initial `opacity: 0` relying on JS | `content-hidden-at-rest` | Medium – report in H1 as a defect |
| M6 | Bouncy or springy curves on ordinary state changes | overshooting `cubic-bezier`, `bounce` | `bounce-easing` | Medium |

Motion that responds to the user (open, expand, confirm) and shows what changed is not slop – keep it.

### Images and icons

| ID | Signal | How to spot | Conf. |
|---|---|---|---|
| IM1 | Generic abstract or stock illustration (blobs, corporate figures, generic 3D) instead of a product-specific concept | would fit any company | High |
| IM2 | Fake dashboard, code window, browser frame or mockup not showing the real product | content doesn't match the interface or offer | Medium |
| IM3 | Stock photos presented as evidence about product, team or clients | no link to the company | Medium |
| IM4 | Every image in a different style, light, crop or render | no shared visual line | Medium |
| IM5 | Generated images without checking anatomy, text, logos, light, context | distorted hands, garbled text, invented logos | Medium |
| IM6 | Default icon library without matched weight and scale, or icons from several families | mixed stroke weights and styles | Medium |
| IM7 | Brand logos recreated as text or invented SVG paths instead of official files | partner logo looks "almost" right | Medium |
| IM8 | Dithering, halftone or pixel-grain effect as decoration (hero images, backgrounds, shader canvases) with no link to the subject | dither/halftone shaders or libraries, `image-rendering: pixelated`, grainy 1-bit images | Low |

Fake portraits, duplicated logos and fake avatars implying clients → G1. Real photos of the company's products, people and places are not slop – even plain ones carry real information.

## A4. Disputed or excluded signals – don't report on their own

| Signal | Why not |
|---|---|
| Bento grid | MT lists it in a cluster; last in UNS data (0.1%), people defend it. Only as part of a cluster. |
| Glassmorphism | cluster element in MT; rare in UNS (0.2–0.3%). Only as part of a cluster. |
| Mesh / blob / aurora backgrounds | UNS rejected as a keyword artefact. Report only the concrete glow from C3. |
| Dark mode itself | only an unrequested glow is a signal. |
| shadcn / Tailwind as tools | only untouched defaults are a signal (L10). |
| Off-black vs pure black | ANT calls off-black (`#0B0B0B`, `#111`) a template ornament; other guides advise avoiding pure black. Sources conflict – report neither alone. |

## A5. Reference design principles (principles, not looks)

Distilled from ten brands that design well: Apple, Duolingo, Linear, Pentagram, Muji, Airbnb, Aesop, Notion, Stripe, Framer.

- **Never copy a look.** "Dark UI with Inter like Linear", "mesh gradient like Stripe", "cream and serif like Aesop" on another site is a new template – often an A2 cluster. Never write "make it like Apple".
- A "no" to a control question is a lead to confirm with evidence in the named layer – not a finding of its own, not a taste judgement. Never report something only because a reference brand would do it differently.
- Use them in step 2 (thesis, interchangeability), in the verdict when one principle best explains the main problem, and in Improve → Direction (`improve.md`, U8). Name a brand only as the source of a principle, when it helps.
- A page needn't meet all of them: Duolingo is loud, Muji quiet – both good. Check that choices are **deliberate and consistent with the page's purpose**.

| Principle | Control question | Lead goes to |
|---|---|---|
| **Purpose and idea before form** | Can you say in one sentence what this view is for and what in it is specific to this product? | thesis (step 2); A – interchangeability |
| **Every element earns its place** | What is lost if you remove it? | removal test; A, E |
| **Attention goes to what matters** | Are navigation, frames and ornaments quieter than content and the main action? | A (layout), H1 (competing main action) |
| **Structure felt, not seen** | Could groups be separated by space instead of a border, card or rule? | A (L12, nested cards) |
| **Consistency must carry meaning** | Does each repeated element (icon, header graphic, label) say something every time? | A (ornaments), G2 (repetition) |
| **One system, no exceptions** | Does the same kind of element look and behave the same on every page? | H, systemic finding |
| **Accessible and beautiful at once** | Does contrast come from the colour system or from one-off eyeballed fixes? | B (1.4.3), A0 (tokens) |
| **Context before formula** | Does the design fit its audience and place (industry, language, country), or impose a formula? | A – interchangeability; G |
| **Respect and control** | Can users undo mistakes, skip steps, understand what happens to their data? | H1 (states, irreversible actions), J |
| **Delight is not decoration** | Does motion, illustration or humour communicate or reward an action – or just decorate? | A (M1–M4), C |
| **Unfinished doesn't ship** | Are edge states (empty, error, loading, long content) as polished as the main view? | H1 |

## A6. Why the visual layer matters (evidence)

Use these only to explain harm in the verdict; never promise conversion effects.

- **The first impression is almost instant and stable.** Ratings of a page's appeal after 50 ms and after 500 ms correlate strongly (Lindgaard et al., 2006).
- **Simple and familiar wins.** Low visual complexity and high prototypicality (looks like its category) were rated most appealing; unfamiliar designs were judged uglier even when simple; complexity is processed first, from ~17 ms (Tuch et al., 2012). Complexity weighs more than colour (Reinecke et al., 2013). → **Remove ornaments, keep conventions**: slop removal should give a quieter page with the expected structure, not an unusual one.
- **Look drives credibility.** In Stanford's study (Fogg et al., 2003; 2,684 people) design look was the most frequently mentioned credibility cue.
- **Easy to process = judged better** (processing fluency: contrast, clarity, symmetry – Reber, Schwarz & Winkielman, 2004). Supports readable type and plain language.
- **Colour meanings are context-dependent** (Elliot & Maier, 2014) – never use "blue = trust" tables as evidence.
- Preferences differ by age, education and country (Reinecke & Gajos, 2014) – judge against the site's audience (A5 "Context before formula").
