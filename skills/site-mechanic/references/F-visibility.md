# F – SEO, GEO, AEO

## F1. Terms and source positions

- **SEO** – visibility in classic search results. **GEO/AEO** – visibility in AI-generated answers (Google AI Overviews and AI Mode, ChatGPT, Claude, Perplexity).
- **Google's position** (guide "Optimizing your website for generative AI features on Google Search", 15.05.2026): for Google Search, optimising for generative features is still SEO – same ranking and quality systems. It also lists things to ignore (F5).
- **Other AI engines** may weigh signals differently. Best available evidence: the GEO study (Aggarwal et al., KDD 2024) – adding quotations, citations and statistics raised source visibility by up to ~40% in their test, domain-dependent. One benchmark study – a hint (Medium confidence), not a rule.

Never promise rankings, citations or traffic; indexing and display aren't guaranteed even when every requirement is met.

## F2. Technical basics

| Check | Details | Typical priority |
|---|---|---|
| Page is indexable | no unintended `noindex` (meta or `X-Robots-Tag`); robots.txt doesn't block important pages or render-critical resources; status 200 | P0 for important pages |
| Crawler access at CDN/hosting | CDN or firewall bot rules don't block search crawlers | P1 |
| Main content in HTML without JS | compare raw HTML (`curl -s <url>` or "View source") with the rendered DOM. Google renders JS, but per Vercel's measurement (December 2024) major AI crawlers (GPTBot, ClaudeBot, …) did not run JS – client-rendered-only content was invisible to them. A dated measurement; check newer data for big decisions | P1 for key content |
| Title and description | unique, descriptive `<title>` and `meta description` per page | P2 |
| Canonicals and duplicates | correct `rel="canonical"`; no duplicate URLs without a canonical | P2 |
| Internal links | important pages reachable by plain `<a href>`; descriptive link text | P2 |
| sitemap.xml | exists, lists indexable canonical URLs | P3 |
| Language versions | multilingual sites: correct `hreflang` and `lang` | P2 |
| Images and video | descriptive `alt`, sensible file names; media that supports the content (Google AI features may show them) | P3 |
| Structured data | valid (Rich Results Test), matches visible content; not required for Google AI features, but enables rich results | P3 |
| Page experience | works on mobile, fast (C), main content easy to distinguish | refer to C |

## F3. Visibility in AI answers

| Check | Details | Confidence |
|---|---|---|
| Deliberate AI-crawler policy in robots.txt | Distinguish search, user-triggered fetch and training crawlers. **OpenAI:** `OAI-SearchBot` – ChatGPT search; `GPTBot` – training; `ChatGPT-User` – user actions (since 12.2025 OpenAI says robots.txt may not apply). **Anthropic:** `Claude-SearchBot` – search; `Claude-User` – user-requested fetch; `ClaudeBot` – training. **Google:** `Google-Extended` controls Gemini training and grounding but **doesn't affect** Google Search, incl. AI Overviews and AI Mode. Participation in AI Overviews, AI Mode and Discover has a separate Search Console toggle (announced 3.06.2026, UK first, global later – check availability); without it `Googlebot` decides. Google also announced (30.10.2026) a shared robots.txt token for opting out of training across vendors, based on IETF AIPREF – support planned for 2027; don't require it today. **Perplexity:** `PerplexityBot` – index; `Perplexity-User` – user-requested fetch (per its docs, usually ignores robots.txt). Report unintended blocks (`User-agent: *` + `Disallow: /`, blocking `Googlebot` thinking it "blocks AI", CDN blocks). Leave the training decision to the owner | High |
| Non-commodity content | unique experience, own data, examples, expertise instead of generalities (links to G and A) | High |
| Concrete facts with sources | claims backed by numbers, quotes, links instead of adjectives | Medium |
| Structure readable for people | sections and headings describing content; clear answers to questions customers really ask | Medium |
| Clear business and product data | consistent names, contact, product descriptions; local businesses and shops: Google points to Business Profile and Merchant Center (incl. product feeds) | Medium |
| Participation in Google AI features | per Google, the page must be indexed and snippet-eligible and the site opted in to generative AI features in Search Console; the Generative AI performance report shows results. Not checkable from code – add to unknowns | High |

## F4. Sharing metadata

| Check | Details | Typical priority |
|---|---|---|
| Favicon | own brand icon; a leftover framework or hosting default is a template remnant | P2 |
| Link preview | `og:title`, `og:description`, `og:image` (and `twitter:card`) present and matching content; image exists and isn't a template default | P2 |
| Consistency | page title, description and link preview say the same as the page heading | P3 |

## F5. What NOT to recommend (per Google, for Google Search)

- **llms.txt and other "special" files, text or Markdown for AI** – Google Search doesn't use them; neither helps nor harms. Fine to keep for other services; never flag their absence.
- **Chunking content** into small pieces – not needed; no ideal page length.
- **Rewriting content for AI** or adding every phrase variant – unnecessary.
- **Many pages for query variants** mainly to manipulate results – Google calls it scaled content abuse.
- **Artificial "mentions"** around the web – don't help.
- **Overemphasis on structured data** – not required for AI features.
- **Perfectly semantic HTML** – good idea, not a requirement.

If a site does one of these at the cost of content or users (e.g. dozens of near-identical pages), report it as P1–P2.
