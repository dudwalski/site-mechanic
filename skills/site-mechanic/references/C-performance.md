# C – Performance and sustainability

Two frames: **Google Core Web Vitals** (perceived speed, measured) and **W3C Web Sustainability Guidelines – WSG** (resource use, mostly checkable in code).

1. **Never state performance numbers you didn't measure.** Code review shows risks, not results.
2. **No PageSpeed Insights or Lighthouse report** → list risks ("Code risk") and ask the user to run https://pagespeed.web.dev (mobile tab first) and send the report. Mobile performance is reported here; mobile layout and handling in K. Field data exists only for sites with enough traffic; smaller sites usually have lab data only – say which you have.

## C1. Core Web Vitals thresholds (web.dev)

| Metric | Measures | Good | Poor |
|---|---|---|---|
| LCP – Largest Contentful Paint | main content load | ≤ 2.5 s | > 4.0 s |
| INP – Interaction to Next Paint | responsiveness | ≤ 200 ms | > 500 ms |
| CLS – Cumulative Layout Shift | visual stability | ≤ 0.1 | > 0.25 |

Assessed at the 75th percentile; between is "needs improvement". With a report: give its numbers, say field or lab, and link each poor metric to a likely cause in code.

**LCP from a late element** (cookie banner, newsletter modal, chat, notification): browsers stop reporting LCP candidates after the first user interaction, but lab tests have none, so the lab may overstate the problem vs real users. In the report: (1) give the number with this caveat, (2) find what would be LCP without the overlay (usually the hero image or heading) and its time, (3) for "Single biggest improvement" pick the cause with the largest real impact (e.g. image weight, blocking scripts), not the biggest number in the report.

## C2. Risks visible in code

| Risk | Affects | Evidence |
|---|---|---|
| Images without `width`/`height` or `aspect-ratio` | CLS | `<img>` without dimensions |
| Hero/LCP image lazy or late | LCP | `loading="lazy"` above the fold; loaded by JS or as CSS background; no `fetchpriority="high"` |
| Oversized images, no responsive sizes or modern formats | LCP | multi-MB JPG/PNG, no `srcset`/`sizes`, no WebP/AVIF |
| Many font families/weights; late swap | LCP, CLS | several families/weights; no `font-display`; no fallback metrics |
| Render-blocking scripts | LCP | `<script>` in `<head>` without `defer`/`async` |
| Animating layout properties instead of `transform`/`opacity` | INP, jank | transitions on `width`, `height`, `top`, `left`, `margin` |
| Heavy effects on large areas | INP, jank, battery | large `backdrop-filter`, huge blurred glows, many simultaneous animations |
| Autoplay background video or big animation libraries for simple effects | LCP, INP | hero video; whole framework for a fade |
| Many third-party scripts (chat, trackers, embeds) | LCP, INP | external `<script>` early in head/body |
| Content injected above existing content after load | CLS | banners added on top without reserved space |

## C3. WSG – checks in code or headers

WSG is a W3C Group Note Draft by the Sustainable Web Interest Group (latest checked: 24.09.2026; frequent drafts – https://www.w3.org/TR/web-sustainability-guidelines/). Not a W3C Recommendation – good practice, never a basis for compliance claims. Cite **number and name** (e.g. "WSG 2.9 Optimize media to reduce resource use"); if numbers shift, the name rules. Weighting: "WSG Impact Ratings" (https://www.w3.org/TR/wsg-ir/). Many points overlap C2 and E – report once, where the fix belongs, with the WSG number as reference.

| WSG | Guideline | Check |
|---|---|---|
| 2.9 | Optimize media to reduce resource use | each image/video justified, compressed, sized per device; below-fold lazy; no autoplay; heavy embeds (video, maps) behind a static click-to-load placeholder |
| 2.10 | Ensure animation is proportionate and easy to control | purposeful; pausable; not running constantly in the background |
| 2.11 | Use optimized web typography | few families/weights; subset for used languages (Polish: `latin-ext`); WOFF2; system fonts considered |
| 3.2 | Minify and remove unused code | production CSS/JS minified; dead code removed (E) |
| 3.3 | Modularize bandwidth-heavy components | heavy features split and loaded only where used |
| 3.5 | Treat third parties the same as first parties | every third-party script justified; self-host where possible |
| 3.7 | Defer the loading of non-critical resources | non-critical JS `defer`/`async`; below-fold content deferred |
| 3.9 | Use media queries that support sustainability goals | `prefers-reduced-motion`, `prefers-color-scheme`, print styles where sensible |
| 3.12 | Use dependencies sparingly and maintain them | no library for what the platform does; dependencies current |
| 3.13 | Include expected and beneficial files | expected: favicon.ico, robots.txt, opensearch.xml, site.webmanifest, sitemap.xml; beneficial: ads.txt, carbon.txt, humans.txt, security.txt – gaps are P3 (robots/sitemap: F2) |
| 4.2 | Optimize caching and support offline access | static assets with long `Cache-Control` and hashed names |
| 4.3 | Reduce data transfer with compression | text assets with `Content-Encoding: br` or `gzip` |
| 4.4 | Setup necessary error pages and redirection links | helpful 404; no redirect chains |

Headers can be checked only with access to the site (or headers pasted by the user, e.g. `curl -sI <url>`); otherwise mark these as unknowns.
