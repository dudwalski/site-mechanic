# D – Security (passive review)

## D1. Boundaries – read first

- **Passive only.** Read code, rendered pages and response headers. Never attempt exploitation, login, fuzzing, password cracking, payload injection or scanning systems the user hasn't confirmed they own or may test.
- **Not a pen test.** Server logic, access control and authentication usually can't be judged from the front end – mark as unknowns.
- **OWASP Top 10 is an awareness document, not a compliance checklist.** Map findings to categories for context; never "OWASP compliant". Current: OWASP Top 10:2025 (final, January 2026).
- Use "Code risk" or "To confirm" unless evidence is conclusive (e.g. a secret key visible in a JS file).
- Never quote full secrets – only start and end (`sk_live_…9f2a`) and location.

## D2. Automated checks

Commands and versions: `tools.md`. retire.js for JS libraries in available files; the ecosystem's dependency tool (`npm audit`, `composer audit`, `pip-audit`); HTTP Observatory for live headers – web version, consent only (scan history is public). A retire.js hit means "update", not "the site was attacked".

## D3. Checklist by OWASP Top 10:2025

| Category | Passive check | Evidence |
|---|---|---|
| A02 Security Misconfiguration | headers: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, clickjacking protection (`frame-ancestors` or `X-Frame-Options`), `Referrer-Policy`, `Permissions-Policy`; directory listing; public `.env`, `.git`, backups, configs; leftover demo pages; versions in `Server`/`X-Powered-By` | headers, URLs |
| A03 Software Supply Chain Failures | outdated or vulnerable libraries; CDN scripts without Subresource Integrity (`integrity`) for static files (not possible for dynamic resources like Google Fonts CSS); unpinned versions (`@latest`) | retire.js, `npm audit`, `<script src>` |
| A04 Cryptographic Failures | pages or forms over HTTP; mixed content; cookies without `Secure`, `HttpOnly`, `SameSite` | URLs, form `action`, `Set-Cookie` |
| A05 Injection | client-side XSS sinks fed by URL, form or API data: `innerHTML`, `outerHTML`, `document.write`, `eval`, `new Function`, `dangerouslySetInnerHTML`, `v-html`, unsanitised markdown | source |
| A07 Authentication Failures | login forms blocking password managers or paste (also WCAG 3.3.8); credentials or tokens in URLs | form code, URLs |
| A10 Mishandling of Exceptional Conditions | stack traces, framework debug pages, internal error details shown to users | error pages, API responses |
| Outside categories, always P0 | secrets in client code: API keys with write or billing rights, private tokens, passwords, credentials in JS bundles, source maps or repos | code, bundles |

Not assessable from the front end (unknowns): A01 Broken Access Control, A06 Insecure Design, server-side A08 Software or Data Integrity Failures, A09 Security Logging & Alerting Failures, server-side validation.

Browser-public keys (analytics IDs, publishable payment keys, domain-restricted map keys) aren't secrets – check the key type first.

## D4. Priorities

- **P0:** secret in client code; data over HTTP; unsupported library with known vulnerabilities or an actively exploited one (e.g. in CISA KEV).
- **P1:** vulnerable but supported library (fix available); no HSTS on a site with login or payments; XSS sink fed by URL data.
- **P2/P3:** missing defence-in-depth headers on a site without login or forms; no `security.txt`.
