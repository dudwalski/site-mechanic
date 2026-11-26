# G – Copy

## G0. Page language

Signal lists below come mostly from English sources. For other languages look for equivalents in meaning, not literal translations. Polish examples: „rewolucyjne rozwiązanie”, „kompleksowa obsługa”, „najwyższa jakość”, „innowacyjne podejście”, „przenieś biznes na wyższy poziom”.

Impeccable's copy rules (`marketing-buzzword`, `aphoristic-cadence`, `theater-slop-phrase`) flagged nothing in a Polish text full of such phrases, but flagged `marketing-buzzword` in its English equivalent – check non-English copy by hand.

**Dashes in Polish:** spaced en/em dashes are ordinary punctuation (asides, dialogue). Never apply "too many dashes" rules (`em-dash-overuse`: from 8 dashes at ~1 per 500 characters) to Polish text.

## G1. Fake or unverified proof

Covers numbers, clients, testimonials, ratings, awards, partnerships, activity counters, fake dashboards and charts, logos implying clients or integrations, portraits and avatars next to testimonials.

- **P0 – Confirmed:** you have evidence of fabrication or template – "Acme", "John Doe", "Lorem ipsum" in testimonials, stock photo as a client, counter randomised in JS, logo of a non-existent company, rating with no rating system.
- **P1 – To confirm:** you can't verify it. Write "unverified – confirm the source", never "fake".

In Improve mode never replace such content with invented content; mark `[TO FILL IN: source/real testimonial]` or recommend removal.

## G2. Generic copy signals (Confidence per A1)

| Signal | Example | Conf. |
|---|---|---|
| Headline that fits any product | "The future of work, reimagined" | Medium |
| Marketing buzzwords instead of a concrete verb and object | streamline, empower, supercharge, world-class, enterprise-grade, next-generation, cutting-edge | Medium |
| Repeated aphoristic rhythm and staccato fragments | "X. Without Y." / "It's not a feature. It's a platform." / "No fluff. Just results." (PL: „Bez ściemy. Po prostu działa.”) – in 3+ sections | Medium |
| Word tics "quiet/quietly" and "real" | "quietly powerful", "the quiet confidence of…", "real results for real teams" (PL: „realne efekty”, „prawdziwe wyniki”) | Low – report only with other G2 signals |
| Interchangeable feature-card filler | heading + one generic sentence that fits any product | Medium |
| Labels, eyebrows and hints repeating each other | heading repeats the label above and the menu item; same text 3× in a card (IMP `repeated-container-text`) | Medium |
| Vague button where a concrete action exists | "Submit", "Learn more" instead of "Book a demo", "Save changes" | Medium |
| "It's just theatre" formula | "security theatre" as a dismissal | Medium |
| Emoji as decoration in copy | ✨ 🚀 in headings and lists | Medium |
| Errors without a fix, empty states with marketing copy | "Oops! Something went wrong" | Medium |
| Too many dashes (English only) | many dashes per paragraph; people use them too | Medium, indicative |

## G3. Plain language (in the spirit of ING "Po prostu")

Source: ING Bank Śląski's 13 plain-language rules (ing.pl/o-banku/po-prostu; ING has simplified its language since 2014 and measures it with the PLI index developed with the University of Wrocław). For other languages apply the same spirit (e.g. ISO 24495-1).

**Apply with judgement, not mechanically.** A direction, not a counter. Don't flag a sentence for having 21 words; flag text that these traits make hard to understand or that hides important information.

| Rule (ING) | Check on the page | Typical priority |
|---|---|---|
| 1. Address the reader directly | "you" instead of impersonal "one should", "the user must" | P3 |
| 2. Show the company is people | "we" instead of "the company", "the bank", "the site administrator" | P3 |
| 3 & 9. No jargon; short, familiar words | officialese and trade words the reader doesn't know; unexplained abbreviations | P2; P1 for price, terms or main action |
| 4. Most important first | does the first sentence of a section, message or email say what it's about and what to do | P2 |
| 5. Cut (don't shrink the font) | repetition, preambles, generalities; text "shortened" with smaller type instead of editing | P2 |
| 6. Paragraphs with subheadings | long block without subheadings or lists | P3 |
| 7. Legal matters last, below the content | decision-relevant terms hidden in asterisks, footnotes, fine print; or a legal preamble before the information | P1 if it hides a cost or condition; else P3 |
| 8. Frequent full stops (one thought per sentence, usually ≤ ~20 words) | multi-clause sentences in descriptions, errors, forms | P3 |
| 10. No passive voice | "Documents will be verified" → who and when | P3 |
| 11. Verbs, not nouns | "make a payment" → "pay"; "in order to carry out verification" → "to check" | P3 |
| 12. No interjections | sentences broken by asides and participle clauses | P3 |
| 13. Read it aloud | overall test for variants you propose | – |

**Don't apply, or apply carefully:** **legal texts** (terms, privacy policy, contracts) – you may recommend simplifying, but content changes are a legal decision ("risk – for legal review"), never a ready clause; **deliberate brand voice** (playful, poetic, expert) – if the brand file or audience justifies it, don't flatten it; plain meaning, not plain style; **specialist vocabulary for specialists** (e.g. API docs) – a term the audience knows isn't jargon.

Usually group these into one systemic finding ("impersonal, official copy throughout checkout") with 2–3 examples. **The same spirit applies to the skill's own report.**

## G4. Fix direction

Say what the product literally does, for whom, with a concrete noun and verb. Name the action a button performs and keep that name through the flow ("Publish" → "Published"). Errors say what happened and how to fix it; empty screens invite action (ANT).

In Improve mode copy is the owner's voice: propose changes as variants to approve; don't implement them yourself (except typos and obvious errors).
