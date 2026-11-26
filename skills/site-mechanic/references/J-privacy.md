# J – Privacy, consent and fair design

This layer reports **technical and design observations, not legal assessment**. Never write that a site "violates" or "complies with" GDPR, ePrivacy, consumer law or the DFA – that is for a lawyer. Describe what you see and mark it "risk – for legal review". Priority follows **harm to the user**, not the legal status: a fake countdown is P1 whether or not a law bans it yet.

WSG references: 2.6 "Avoid being manipulative or deceptive", 2.12 "Avoid unwanted notifications", 5.18 "Promote responsible data practices".

**Ownership:** false numbers, testimonials and logos stay in G1; interface tricks (pressure, defaults, hidden costs, obstructed exits) are reported here. A fake "only 2 left" counter is J (pattern) – add G1 only if the number itself is claimed as fact elsewhere.

## J1. Privacy and consent

| Check | How | Needs | Typical priority |
|---|---|---|---|
| Analytics, ad and tracking scripts loaded **before** a cookie-banner choice | clean session, click nothing, inspect third-party requests and cookies set | HAR or DevTools | P1 – risk for legal review |
| Banner choice doesn't work | after rejecting, tracking still loads or cookies are set | as above | P1 – risk for legal review |
| Asymmetric banner | accept is one prominent click; reject hidden, smaller or multi-step | screenshot or page | P2 |
| Unwanted notifications | push or location permission prompt right on entry, without user action | page | P2 |
| Excess third-party services | several analytics or trackers doing the same (link to C and I) | code, network | P2 |
| Forms collecting more than needed | required fields without visible reason (phone for a newsletter) | page | P2 |
| Privacy information reachable | privacy-policy link visible at forms and in the footer; document exists and is readable | page | P2 |

## J2. Fair design (B2C sites selling to EU consumers)

Applies when the site sells to or contracts with consumers in the EU (shop, subscription, SaaS, bookings). Pure B2B → skip J2 and say so in "Scope". Walk it together with the main-task path (`H-quality.md`, H4): product page → cart → checkout up to payment, account → cancellation. Never complete a real purchase, sign-up or cancellation without consent.

**Legal basis – check the status on audit day (`sources.md`):**
- **In force:** EU unfair commercial practices rules (UCPD, in Poland the act on counteracting unfair market practices) with their blacklist, e.g. falsely claiming an offer is available only for a very limited time; Omnibus rules (fake reviews, price reductions shown against the lowest price of the last 30 days, disclosure of paid ranking); the DSA dark-pattern ban for online platforms only; the **withdrawal function** (Consumer Rights Directive Art. 11a, applicable from 19.06.2026 – national transposition may lag; in Poland the draft was suspended as of 12.06.2026).
- **Proposed – Digital Fairness Act** (COM(2026) 1100, presented 11.11.2026): a regulation replacing the UCPD; general ban on interfaces that deceive or manipulate (Art. 10) plus 10 dark patterns banned in all circumstances (Annex I, points 53–62); rules on subscriptions, addictive design, personalisation, AI shopping agents. Applies 12 months after entry into force; still in the legislative process. Cite it as "proposed DFA", never as binding law.

### Checklist

| ID | Pattern | How to check | Basis | Typical priority |
|---|---|---|---|---|
| J2.1 | **False scarcity or popularity** – "only 2 left", "12 people viewing", "selling fast" without real data, or repeated during checkout | reload/second session – does the number change randomly? source in JS (`Math.random`, fixed list) | in force (UCPD); DFA Annex I | P1; P0 if confirmed fake in code |
| J2.2 | **Fake urgency** – countdown restarting on reload, "offer ends today" every day, limited-time offer without stated end | reload, new session, check the next day if possible | in force (UCPD blacklist); DFA (duration must be stated) | P1 |
| J2.3 | **Pre-selected extras** – add-ons, insurance, extra quantity, donations or marketing consents pre-ticked; user must opt out | cart and checkout defaults | in force for paid add-ons (CRD Art. 22); DFA Annex I | P1 |
| J2.4 | **Confirmshaming** – declining framed as the wrong or foolish choice ("No thanks, I don't like saving money") | text of decline links and buttons | DFA Annex I | P2 |
| J2.5 | **False "only option"** – one option shown as the only one when others exist (e.g. hidden cheaper plan or free tier) | compare pricing page, FAQ, terms | DFA Annex I | P1 |
| J2.6 | **Nagging** – asking again for a choice already made (re-prompts after refusing newsletter, notifications, app install, cookies) | refuse once, keep browsing | DFA Annex I | P2 |
| J2.7 | **Trick wording** – ambiguous options, double negatives, reversed logic in a list of choices ("Uncheck to not receive…") | read every checkbox and choice aloud (G3) | DFA Annex I | P1 if it leads to a purchase or consent; else P2 |
| J2.8 | **Hidden price or renewal terms** – total price, auto-renewal, trial-to-paid conversion shown less prominently than other information | compare size, contrast, position of price/renewal text vs the main call to action | DFA Annex I | P1 |
| J2.9 | **Fake notifications** – invented "someone in Kraków just bought…", fake chat messages, fake alerts | source in JS, repeating names, reload | DFA Annex I; misleading practice (in force) | P1 |
| J2.10 | **Obstructed exit** – cancelling, refusing, withdrawing or changing a choice much harder than signing up (phone-only cancellation, many steps, hidden link) | count steps sign-up vs cancel; is cancellation reachable online | DFA Annex I; withdrawal function (in force) | P1 |
| J2.11 | **Drip pricing** – first price without unavoidable fees (service, handling, mandatory delivery) that appear later | first shown price vs final total before payment | DFA; already risky under price-indication rules | P1 |
| J2.12 | **Misleading reference prices** – crossed-out "was" price not equal to the lowest price of the last 30 days; comparisons with an unnamed or "recommended retail" price | price history if available, product data, labels | in force (Omnibus); DFA restricts recommended-price comparisons | P1 – risk for legal review |
| J2.13 | **Reviews** – no information on whether and how reviews are verified; only 5-star reviews; reviews unrelated to the product | review section, policy text | in force (Omnibus) | P2; P1 if evidence of fake reviews (also G1) |
| J2.14 | **Missing withdrawal function** – no clearly labelled online way to withdraw within 14 days (two steps: intention + confirmation, with acknowledgement) | footer, account, order emails (if provided) | in force from 19.06.2026 (CRD Art. 11a), subject to national transposition | P1 – risk for legal review |
| J2.15 | **Subscriptions** – no visible "terminate the contract here" path online; free trial converts to paid without clear notice | account area (only if the user grants access), pricing and terms text | DFA Arts. 20–23 | P1 |
| J2.16 | **Addictive mechanics without controls** – autoplay or endless feed, streaks with penalties, notifications unrelated to user activity, no way to switch them off | product interface | DFA Art. 17 | P2 (platforms and apps; rare on marketing sites) |

**Out of scope for a site audit** (mention only if clearly present): influencer disclosures, loot boxes and virtual currencies, profiling-based ads and personalised pricing (not visible from outside), AI shopping agents.

## J3. Persuasion principles – evidence and audit rule

**Detection only.** Never recommend adding a persuasion tactic – not in Audit, not in Improve. For each tactic found on the page, check whether it is **honest** (true, verifiable, not hiding anything – fine, say nothing or note it under "What works") or **manipulative** (false, hidden, pressuring – report it where the last column says). Evidence grade tells you how much a tactic can be expected to work, which matters only for explaining harm; it never justifies a manipulative use.

Grades: **Strong** – replicated in large or multi-lab studies · **Moderate** – real effect, small, conditional or few field studies · **Weak** – failed replications or contested · **Popular** – book or industry concept without direct studies.

| Principle | Evidence | Honest use | Manipulative use → report in |
|---|---|---|---|
| Framing | Strong (Many Labs) | same units for all options (monthly and yearly both shown) | framing that hides the total cost → J2.8, J2.11 |
| Anchoring / price anchoring | Strong in the lab | real previous or competitor price | inflated "was" or recommended price → J2.12 |
| Loss aversion | Strong; size debated | plain statement of what is lost by not acting | fear wording, confirmshaming → J2.4 |
| Scarcity | Moderate–strong (meta-analysis of 131 studies); demand-based works, time pressure weak | real stock from inventory, real end date | invented stock, viewers or demand → J2.1 |
| FOMO / urgency | Popular; urgency cues weak in meta-analyses | real deadline with a date | restarting countdowns, "today only" every day → J2.2 |
| Social proof | Moderate; famous hotel-towel study failed to replicate | real, verifiable reviews, clients, numbers | invented or template proof → G1; fake activity pop-ups → J2.9; review handling → J2.13 |
| Reciprocity | Moderate (Many Labs set) | useful free content or trial without strings | "free" gift that requires data or silently converts to paid → J1, J2.15 |
| Commitment and consistency | Moderate, small effects (r ≈ .17) | small first step that is clearly what it is | small "yes" that leads into a hidden commitment → J2.8 |
| Sunk cost | Moderate (lab) | showing saved progress | "you'll lose everything" at cancellation → J2.4, J2.10 |
| Endowed progress | Moderate (field study, few replications) | progress bar reflecting real steps | fake head start or inflated progress → H1 |
| IKEA effect | Moderate (conceptual replication) | configurators, onboarding where users build | effort used to make leaving costly → J2.10 |
| Fresh start | Moderate (archival field studies) | timing offers to real calendar moments | invented "new year" deadlines → J2.2 |
| Decoy effect | Weak – practical effect contested | clear plan comparison | dominated plan added to push a target plan, hidden best value → J2.5 |
| Curiosity gap | Weak/mixed – sensational headlines backfire | specific headline the page delivers on | clickbait, price or terms withheld until late → G2, J2.11 |
| Identity-based messaging | Weak (identity-priming replications failed) | copy in the audience's own words | identity shaming ("real runners don't…") → J2.4 |
| Variable reward | Popular as a product tactic (lab reinforcement research is robust) | – (rarely needed on sites) | random rewards, streaks or loot boxes driving compulsive use → J2.16 |
| Loading the trigger | Popular (Hooked model) | clear next step after an action | – → H4 question 2 |
| Tamagotchi effect | Popular, no robust evidence | – | guilt-tripping characters, simulated relationships → J2.16 |
| Status | Popular / broad | real tiers, real badges | fake exclusivity ("invite only" for everyone) → G1 |
| Social currency | Popular (Berger's STEPPS) | content worth sharing | – |

## J4. Boundaries

- Don't assess the privacy policy, terms or prices legally; only whether information exists, is reachable, understandable and as prominent as the action it concerns.
- Without a network log don't claim tracking starts before consent – mark it unknown and say how to check (DevTools → Network in a private window, export HAR before touching the banner).
- Impeccable URL scans hide known consent banners (OneTrust, Cookiebot…) by default – judge the banner from screenshots or with `--no-consent-hiding`.
- Account areas (cancellation, subscription settings) need the user's access; without it, list them in "Unknowns".
- Never record or quote personal data you see during the audit.
