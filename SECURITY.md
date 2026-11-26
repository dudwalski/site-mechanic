# Security policy

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Report privately through GitHub: **Security → Report a vulnerability** in this repository. Include what you found, where (file and line), and how to reproduce it.

You can expect a first reply within 7 days.

## Scope

- The skill's scripts in `skills/site-mechanic/scripts/` (they run locally on the auditor's machine).
- Instructions in the skill that could lead an agent to act unsafely, for example run active scans, exfiltrate data or write outside the agreed folder.

Out of scope: findings about websites audited *with* the skill – report those to the site owner.

## Supported versions

Only the latest release receives fixes.
