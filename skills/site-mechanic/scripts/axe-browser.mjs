#!/usr/bin/env node
// axe-core in a real browser (Chrome via playwright-core): after page JS runs,
// with CSS loaded, in phone and desktop views, also after clicks (e.g. open menu).
// Complements the static scripts/axe-scan.mjs (jsdom); doesn't replace manual testing.
// Run from a temp directory with the packages installed:
//   mkdir -p /tmp/axe-browser && cd /tmp/axe-browser
//   npm init -y >/dev/null && npm i --silent playwright-core@1.65.1 axe-core@4.14.1
//   node <skill-path>/scripts/axe-browser.mjs <file.html|URL> [options]   (help: --help)
// Output: JSON on stdout. Exit 0 – complete, 4 – some states incomplete, 2 – bad arguments, 3 – missing dependency.
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const USAGE = `Usage: axe-browser.mjs <file.html|URL> [options]
  --click <selector>    click an element and scan the resulting state (repeatable; clicks accumulate)
  --views <list>        mobile,desktop (default both; mobile = 390×844 with touch, desktop = 1440×900)
  --tags <list>         axe tags (default wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa)
  --keyboard <n>        press Tab n times and record focus order (default 0 – off)
  --chrome <path>       Chrome/Chromium binary (or CHROME_PATH)
  --offline             block network resources (for local files)
  --settle-ms <ms>      settle time after load (default 1000)
  --wait-for <selector> wait until an element appears (e.g. after hydration)`;
const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) { console.log(USAGE); process.exit(0); }
const clicks = [];
for (let i = argv.indexOf('--click'); i >= 0; i = argv.indexOf('--click')) clicks.push(argv.splice(i, 2)[1]);
const opt = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv.splice(i, 2)[1] : undefined; };
const flag = (n) => { const i = argv.indexOf(n); if (i >= 0) { argv.splice(i, 1); return true; } return false; };
const views = (opt('--views') || 'mobile,desktop').split(',').map((v) => v.trim());
const tags = (opt('--tags') || 'wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa').split(',').map((t) => t.trim());
const tabs = Number(opt('--keyboard') || 0);
const chromeArg = opt('--chrome');
const offline = flag('--offline');
const settleMs = Number(opt('--settle-ms') ?? 1000);
const waitFor = opt('--wait-for');
const target = argv[0];
if (!target || target.startsWith('--') || clicks.some((c) => !c) || !Number.isFinite(settleMs) || !Number.isFinite(tabs)
  || views.some((v) => !['mobile', 'desktop'].includes(v))) { console.error(USAGE); process.exit(2); }
const url = /^https?:\/\//.test(target) ? target : pathToFileURL(resolve(target)).href;

const require = createRequire(join(process.cwd(), 'noop.js'));
let chromium, axeSource, versions;
try {
  ({ chromium } = require('playwright-core'));
  axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const v = (p) => JSON.parse(readFileSync(require.resolve(`${p}/package.json`), 'utf8')).version;
  versions = { 'playwright-core': v('playwright-core'), 'axe-core': v('axe-core') };
} catch {
  console.error('playwright-core or axe-core missing in the current directory (see the script header).');
  process.exit(3);
}
const executablePath = [chromeArg, process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium',
  '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].filter(Boolean).find((p) => existsSync(p));
if (!executablePath) { console.error('Chrome/Chromium not found. Pass --chrome <path> or set CHROME_PATH.'); process.exit(3); }

const VIEW = {
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
  desktop: { viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
};
const summarize = (r) => ({
  violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, tags: v.tags.filter((t) => /^wcag|^EN-/.test(t)),
    nodes: v.nodes.length, targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')) })),
  incomplete: r.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length })),
  passes: r.passes.length,
});
const scan = async (page) => {
  await page.addScriptTag({ content: axeSource });
  return summarize(await page.evaluate((t) => window.axe.run(document, { runOnly: { type: 'tag', values: t }, resultTypes: ['violations', 'incomplete'] }), tags));
};

const browser = await chromium.launch({ executablePath, headless: true });
const out = { url, tools: versions, browser: `${executablePath} ${browser.version()}`, tags, settleMs, waitFor: waitFor || null,
  note: 'axe detects only part of WCAG issues automatically; no violations does not mean conformance. Manual testing needed (keyboard, screen reader).', views: {} };
try {
  for (const view of views) {
    const ctx = await browser.newContext({ ...VIEW[view], bypassCSP: true });
    if (offline) await ctx.route(/^https?:/, (r) => r.abort());
    const page = await ctx.newPage();
    const errors = [], incomplete = [];
    page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 200)));
    try { await page.goto(url, { waitUntil: 'load', timeout: 20000 }); } catch (e) { incomplete.push(`load: ${e.message.split('\n')[0]}`); }
    if (waitFor) { try { await page.waitForSelector(waitFor, { state: 'visible', timeout: 15000 }); } catch { incomplete.push(`element did not appear: ${waitFor}`); } }
    await page.waitForTimeout(settleMs);
    // Keyboard first – on the loaded state, before clicks change the page.
    let keyboard;
    if (tabs > 0) {
      await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
      const order = [];
      for (let i = 0; i < tabs; i++) {
        await page.keyboard.press('Tab');
        order.push(await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          const indicator = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none';
          const label = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}`;
          return { element: label, text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40), focusIndicator: indicator };
        }));
      }
      const seq = order.map((o) => (o ? `${o.element}|${o.text}` : 'body'));
      const lastUnique = new Set(seq.slice(-Math.min(5, seq.length)));
      keyboard = { order, possibleTrap: tabs >= 6 && lastUnique.size === 1 && seq[seq.length - 1] !== 'body',
        withoutIndicator: order.filter((o) => o && !o.focusIndicator).map((o) => o.element) };
    }
    const states = [{ state: 'after load', ...(await scan(page)) }];
    for (const sel of clicks) {
      try {
        const before = page.url();
        await page.click(sel, { timeout: 5000 });
        await page.waitForTimeout(400);
        if (page.url() !== before) { incomplete.push(`click ${sel} navigated to ${page.url()} – pick an element that opens a state on the same page`); break; }
        states.push({ state: `after click ${sel}`, ...(await scan(page)) });
      } catch (e) { incomplete.push(`click ${sel}: ${e.message.split('\n')[0]}`); }
    }
    out.views[view] = { complete: incomplete.length === 0, incompleteReasons: incomplete, pageErrors: errors, states, ...(keyboard ? { keyboard } : {}) };
    await ctx.close();
  }
} finally { await browser.close(); }
out.incompleteViews = Object.entries(out.views).filter(([, v]) => !v.complete).map(([k]) => k);
console.log(JSON.stringify(out, null, 2));
process.exit(out.incompleteViews.length ? 4 : 0);
