#!/usr/bin/env node
// Run at every audit: checks whether pinned tool versions are still current
// and returns the version to use:
//   - newer release in the same major line (minor/patch) → use the newest in that line,
//   - new major → stay on the pinned line and tell the user,
//   - pinned version deprecated → newest in the same line + note.
// For Impeccable it also compares rule IDs with the list the skill's catalogue is based on;
// if a rule referenced by the skill is gone, it recommends the pinned version.
// Usage: node scripts/check-versions.mjs [--json]   (needs npm; pip-audit checked via pip if present)
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const SKILL_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const PINNED = {
  impeccable: '4.10.0',
  'axe-core': '4.14.1',
  jsdom: '31.0.1',
  retire: '6.1.1',
  purgecss: '9.1.0',
  knip: '6.46.1',
  'playwright-core': '1.65.1',
};
const PINNED_PY = { 'pip-audit': '2.10.1' };
const asJson = process.argv.includes('--json');

// semver from the npm installation (bundled with npm); without it – simplified comparison.
let semver = null;
const npmDirs = [join(dirname(process.execPath), '..', 'lib', 'node_modules', 'npm'), join(dirname(process.execPath), 'node_modules', 'npm')];
try { npmDirs.push(join(execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim(), 'npm')); } catch { /* no npm root */ }
for (const dir of npmDirs) {
  try { semver = createRequire(join(dir, 'package.json'))('semver'); break; } catch { /* next location */ }
}

const parse = (v) => v.split(/[.+-]/).slice(0, 3).map(Number);
const cmp = (a, b) => {
  if (semver) return semver.compare(a, b);
  const [x, y] = [parse(a), parse(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
};
const line = (v) => { const [ma, mi] = parse(v); return ma === 0 ? `0.${mi}` : String(ma); };
const npmView = (spec, field) => {
  try {
    const out = execFileSync('npm', ['view', spec, field, '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return out ? JSON.parse(out) : null;
  } catch { return undefined; } // undefined = network/registry error
};

const results = [];
for (const [pkg, pinned] of Object.entries(PINNED)) {
  const r = { tool: pkg, pinned, latest: null, sameLineLatest: null, use: pinned, status: '', notes: [] };
  const versions = npmView(pkg, 'versions');
  if (versions === undefined) { r.status = 'unchecked (no npm registry access)'; results.push(r); continue; }
  const stable = (Array.isArray(versions) ? versions : [versions]).filter((v) => !v.includes('-'));
  r.latest = stable.reduce((a, b) => (cmp(a, b) >= 0 ? a : b));
  r.sameLineLatest = stable.filter((v) => line(v) === line(pinned)).reduce((a, b) => (cmp(a, b) >= 0 ? a : b), pinned);
  const deprecated = npmView(`${pkg}@${pinned}`, 'deprecated');
  if (deprecated) r.notes.push(`pinned version deprecated: ${deprecated}`);
  if (cmp(r.sameLineLatest, pinned) > 0) {
    r.use = r.sameLineLatest;
    r.status = 'newer in the same line – use it';
  } else {
    r.status = 'pinned is the newest in its line';
  }
  if (line(r.latest) !== line(pinned)) r.notes.push(`new major ${r.latest} available – stay on ${line(pinned)}.x and tell the user`);
  const engines = npmView(`${pkg}@${r.use}`, 'engines');
  if (engines?.node) {
    r.engines = engines.node;
    if (semver && !semver.satisfies(process.versions.node, engines.node)) r.notes.push(`Node ${process.versions.node} does not satisfy ${engines.node}`);
  }
  results.push(r);
}

// Impeccable: do the rules used by the skill still exist in the chosen version.
const imp = results.find((r) => r.tool === 'impeccable');
if (imp && imp.use !== imp.pinned) {
  try {
    const base = JSON.parse(readFileSync(join(SKILL_DIR, 'scripts', `impeccable-rules-${imp.pinned}.json`), 'utf8')).ids;
    const refsDir = join(SKILL_DIR, 'references');
    const text = readdirSync(refsDir).map((f) => readFileSync(join(refsDir, f), 'utf8')).join('\n');
    const used = base.filter((id) => text.includes('`' + id + '`'));
    const out = execFileSync('npx', ['--yes', `impeccable@${imp.use}`, 'detect', '--list-rules', '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const now = new Set(JSON.parse(out).map((x) => x.id));
    const missing = used.filter((id) => !now.has(id));
    if (missing.length) {
      imp.notes.push(`${imp.use} lacks rules used by the skill: ${missing.join(', ')} – use pinned ${imp.pinned}`);
      imp.use = imp.pinned;
      imp.status = 'newer in line changes rules – stay on pinned';
    } else {
      imp.notes.push(`rules used by the skill (${used.length}) are present in ${imp.use}`);
    }
  } catch {
    imp.notes.push('could not compare rules – use the pinned version');
    imp.use = imp.pinned;
  }
}

// pip-audit (only for Python projects; needs pip).
for (const [pkg, pinned] of Object.entries(PINNED_PY)) {
  const r = { tool: pkg, pinned, latest: null, sameLineLatest: null, use: pinned, status: '', notes: [] };
  try {
    const out = execFileSync('python3', ['-m', 'pip', 'index', 'versions', pkg], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const all = (out.match(/Available versions: (.*)/) || [])[1]?.split(',').map((s) => s.trim()).filter((v) => /^\d+\.\d+(\.\d+)?$/.test(v)) || [];
    if (!all.length) throw new Error('no list');
    r.latest = all.reduce((a, b) => (cmp(a, b) >= 0 ? a : b));
    r.sameLineLatest = all.filter((v) => line(v) === line(pinned)).reduce((a, b) => (cmp(a, b) >= 0 ? a : b), pinned);
    if (cmp(r.sameLineLatest, pinned) > 0) { r.use = r.sameLineLatest; r.status = 'newer in the same line – use it'; }
    else r.status = 'pinned is the newest in its line';
    if (line(r.latest) !== line(pinned)) r.notes.push(`new major ${r.latest} available – stay on ${line(pinned)}.x`);
  } catch {
    r.status = 'unchecked (no pip or PyPI access) – needed only for Python projects';
  }
  results.push(r);
}

const report = { checkedAt: new Date().toISOString(), node: process.versions.node, semverAvailable: !!semver, tools: results };
if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Checked: ${report.checkedAt}  |  Node ${report.node}${semver ? '' : '  |  no semver module: Node requirements unchecked'}`);
  for (const r of results) {
    console.log(`\n${r.tool}: pinned ${r.pinned} → USE ${r.use}  (latest overall: ${r.latest ?? '?'})`);
    console.log(`  status: ${r.status}`);
    for (const n of r.notes) console.log(`  note: ${n}`);
  }
}
