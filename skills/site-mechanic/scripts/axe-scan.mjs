#!/usr/bin/env node
// Accessibility check of HTML files with axe-core in jsdom (no browser).
// Run from a temp directory where axe-core and jsdom are installed:
//   mkdir -p /tmp/axe-run && cd /tmp/axe-run
//   npm init -y >/dev/null && npm i --silent axe-core@4.14.1 jsdom@31.0.1
//   node <skill-path>/scripts/axe-scan.mjs <file.html|dir> [...]
// Versions: pinned by default; scripts/check-versions.mjs gives the current recommendation.
// Output: JSON on stdout. Contrast in jsdom usually returns "incomplete" – check it in a browser.
// jsdom doesn't run page JavaScript: content inserted by frameworks (Alpine x-text, Vue v-text, {{ }} etc.)
// doesn't exist, so elements with a name violation and a framework attribute go to mayBeFalsePositive.
import { createRequire } from 'node:module';
import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const require = createRequire(join(process.cwd(), 'noop.js'));
let JSDOM, VirtualConsole, axePath;
try {
  ({ JSDOM, VirtualConsole } = require('jsdom'));
  axePath = require.resolve('axe-core/axe.min.js');
} catch {
  console.error('jsdom or axe-core missing in the current directory. Install them in a temp directory (see the script header).');
  process.exit(3);
}
const axeSource = readFileSync(axePath, 'utf8');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
// Attributes and syntax frameworks use to insert text or attributes only in the browser.
const FRAMEWORK_RE = /\s(x-text|x-html|x-bind:[\w-]+|:(?:aria-[\w-]+|alt|title|value)|v-text|v-html|v-bind:[\w-]+|ng-bind[\w-]*|data-bind|\[(?:attr\.)?aria-[\w-]+\]|\[innerHTML\])=|\{\{[^}]*\}\}/;
// Accessible-name rules affected by JS-inserted content.
const NAME_RULES = new Set(['button-name', 'link-name', 'label', 'image-alt', 'input-button-name', 'aria-command-name', 'aria-input-field-name', 'aria-toggle-field-name', 'select-name', 'empty-heading', 'document-title', 'frame-title']);

function collect(target, out = []) {
  const st = statSync(target);
  if (st.isDirectory()) {
    for (const name of readdirSync(target)) {
      if (name === 'node_modules' || name.startsWith('.')) continue;
      collect(join(target, name), out);
    }
  } else if (['.html', '.htm'].includes(extname(target).toLowerCase())) {
    out.push(resolve(target));
  }
  return out;
}

const targets = process.argv.slice(2);
if (!targets.length) {
  console.error('Usage: node axe-scan.mjs <file.html|dir> [...]');
  process.exit(2);
}
const files = targets.flatMap((t) => collect(t));
const report = { axeVersion: null, tags: TAGS, files: [] };

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  // No page scripts and no resource loading: HTML only.
  const virtualConsole = new VirtualConsole(); // wycisza komunikaty jsdom typu "Not implemented"
  const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole });
  const { window } = dom;
  window.eval(axeSource);
  report.axeVersion = window.axe.version;
  const frameworkDetected = FRAMEWORK_RE.test(html);
  const res = await window.axe.run(window.document, { runOnly: { type: 'tag', values: TAGS }, resultTypes: ['violations', 'incomplete'] });
  report.files.push({
    file,
    frameworkDetected,
    violations: res.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      wcag: v.tags.filter((t) => /^wcag\d{3,4}$/.test(t)),
      count: v.nodes.length,
      targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
      // Elements whose name violation may come from framework-inserted content
      // (likely false alarm – confirm in a browser).
      mayBeFalsePositive: NAME_RULES.has(v.id)
        ? v.nodes.filter((n) => FRAMEWORK_RE.test(' ' + n.html)).map((n) => n.target.join(' '))
        : [],
    })),
    incomplete: res.incomplete.map((v) => ({ id: v.id, count: v.nodes.length })),
  });
  window.close();
}
console.log(JSON.stringify(report, null, 2));
