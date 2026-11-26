#!/usr/bin/env node
// Layer K (mobile) measurement in real Chrome with phone emulation (isMobile + touch).
// Run from a temp directory where playwright-core is installed:
//   mkdir -p /tmp/mc-run && cd /tmp/mc-run
//   npm init -y >/dev/null && npm i --silent playwright-core@1.65.1
//   node <skill-path>/scripts/mobile-check.mjs <file.html|URL> [--out <screenshot-dir>] [--chrome <path>] [--offline]
//        [--settle-ms <ms, default 1000>] [--wait-for <CSS selector>]   (help: --help)
// Browser: installed Chrome/Chromium (--chrome, CHROME_PATH or common paths).
// playwright-core version: pinned by default; scripts/check-versions.mjs gives the current recommendation.
// Output: JSON on stdout. Emulation only – no on-screen keyboard, browser bars or iOS Safari.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(join(process.cwd(), 'noop.js'));
let chromium, pwVersion;
try {
  ({ chromium } = require('playwright-core'));
  pwVersion = JSON.parse(readFileSync(require.resolve('playwright-core/package.json'), 'utf8')).version;
} catch {
  console.error('playwright-core missing in the current directory. Install it in a temp directory (see the script header).');
  process.exit(3);
}

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : undefined; };
const flag = (name) => { const i = args.indexOf(name); if (i >= 0) { args.splice(i, 1); return true; } return false; };
const USAGE = `Usage: mobile-check.mjs <file.html|URL> [options]
  --out <dir>          full-page screenshots for each profile
  --chrome <path>      Chrome/Chromium binary (or CHROME_PATH)
  --offline            block network resources (for local files)
  --settle-ms <ms>     settle time after load (default 1000)
  --wait-for <selector> wait until an element appears (e.g. after hydration)
Exit codes: 0 – complete, 4 – at least one profile incomplete, 2 – bad arguments, 3 – missing dependency.`;
if (process.argv.includes('--help') || process.argv.includes('-h')) { console.log(USAGE); process.exit(0); }
const outDir = opt('--out');
const chromeArg = opt('--chrome');
const offline = flag('--offline');
const settleArg = opt('--settle-ms');
const settleMs = settleArg === undefined ? 1000 : Number(settleArg);
const waitFor = opt('--wait-for');
if (!Number.isFinite(settleMs) || settleMs < 0) { console.error('--settle-ms must be a number ≥ 0.\n' + USAGE); process.exit(2); }
const target = args[0];
if (!target || target.startsWith('--')) { console.error(USAGE); process.exit(2); }
const url = /^https?:\/\//.test(target) ? target : pathToFileURL(resolve(target)).href;

const CANDIDATES = [chromeArg, process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].filter(Boolean);
const executablePath = CANDIDATES.find((p) => existsSync(p));
if (!executablePath) { console.error('Chrome/Chromium not found. Pass --chrome <path> or set CHROME_PATH.'); process.exit(3); }

// Profiles: phones portrait (320 = WCAG 1.4.10 threshold), landscape, desktop for content comparison.
const PROFILES = [
  { name: '320x640', width: 320, height: 640, mobile: true },
  { name: '360x780', width: 360, height: 780, mobile: true },
  { name: '390x844', width: 390, height: 844, mobile: true },
  { name: '412x915', width: 412, height: 915, mobile: true },
  { name: '844x390-poziomo', width: 844, height: 390, mobile: true },
  { name: '1440x900-desktop', width: 1440, height: 900, mobile: false },
];

// Runs in the page: returns measurements for one view.
function measure(deviceWidth) {
  const vh = window.innerHeight;
  const metaEl = document.querySelector('meta[name="viewport"]');
  const deviceFit = !!metaEl && /width\s*=\s*device-width/i.test(metaEl.getAttribute('content') || '');
  // Without viewport meta a phone lays out at ~980 px and zooms out – compare against that width.
  // With viewport meta compare against screen width: mobile Chrome widens innerWidth on overflow.
  const vw = deviceFit ? deviceWidth : window.innerWidth;
  const doc = document.documentElement;
  // Visible = has size, not hidden, and neither it nor any ancestor has opacity 0 (opacity isn't inherited).
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) if (parseFloat(getComputedStyle(e).opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const label = (el) => {
    const id = el.id ? `#${el.id}` : '';
    const cls = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : '';
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  };
  const metaContent = metaEl ? metaEl.getAttribute('content') : null;

  // Elements past the right edge (topmost in the tree only).
  const overflowing = [];
  for (const el of document.body ? document.body.querySelectorAll('*') : []) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && !overflowing.some((o) => o.el.contains(el))) overflowing.push({ el, right: Math.round(r.right), width: Math.round(r.width) });
  }
  // Content spilling out of its box (e.g. a long word in a big heading) – the box itself fits the screen.
  const spilling = [];
  for (const el of document.body ? document.body.querySelectorAll('*') : []) {
    if (!visible(el) || getComputedStyle(el).overflowX !== 'visible') continue;
    if (!(el.scrollWidth > el.clientWidth + 1 && el.getBoundingClientRect().left + el.scrollWidth > vw + 1)) continue;
    const entry = { el, contentWidth: el.scrollWidth, boxWidth: el.clientWidth };
    const anc = spilling.findIndex((o) => o.el.contains(el)); // keep the deepest spilling element
    if (anc >= 0) spilling[anc] = entry; else spilling.push(entry);
  }

  // Cele dotykowe: minimum WCAG 2.5.8 (24×24 px CSS) i rekomendacja 44 px (Apple; Material: 48 dp).
  // WCAG spacing exception: a 24 px circle centred on an undersized target must not intersect
  // another target or another undersized target's circle (centres of two small targets ≥ 24 px apart).
  const targets = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button], [tabindex]:not([tabindex="-1"])')]
    .filter(visible).filter((el, _, all) => !all.some((o) => o !== el && o.contains(el))); // a target nested in another target counts once
  const rects = targets.map((el) => el.getBoundingClientRect());
  const under = rects.map((r) => r.width < 24 || r.height < 24);
  const center = (r) => [r.left + r.width / 2, r.top + r.height / 2];
  const distToRect = (x, y, r) => Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
  const small = [];
  targets.forEach((el, i) => {
    const r = rects[i];
    if (r.width >= 44 && r.height >= 44) return;
    const parent = el.parentElement;
    const inline = el.tagName === 'A' && parent && [...parent.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    let spacingOk = null; // applies only to targets below 24 px
    if (under[i]) {
      const [cx, cy] = center(r);
      spacingOk = rects.every((o, j) => {
        if (j === i) return true;
        if (distToRect(cx, cy, o) < 12) return false;              // circle intersects another target
        if (under[j]) { const [ox, oy] = center(o); if (Math.hypot(cx - ox, cy - oy) < 24) return false; } // intersects another small target's circle
        return true;
      });
    }
    small.push({ element: label(el), text: (el.innerText || el.getAttribute('aria-label') || el.value || '').trim().slice(0, 40),
      width: Math.round(r.width), height: Math.round(r.height), below24: under[i], below44: true,
      spacingOk, inlineInText: !!inline, nativeControl: ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) && !el.getAttribute('style') });
  });

  // Form fields with text below 16 px (iOS auto-zoom).
  const smallInputs = [...document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea, select')]
    .filter(visible).map((el) => ({ element: label(el), type: el.tagName === 'INPUT' ? el.type : el.tagName.toLowerCase(), fontSize: parseFloat(getComputedStyle(el).fontSize) }))
    .filter((x) => x.fontSize < 16);

  // Sticky elements covering a large part of the screen.
  const fixed = [...document.querySelectorAll('body *')].filter((el) => {
    const p = getComputedStyle(el).position; return (p === 'fixed' || p === 'sticky') && visible(el);
  }).map((el) => { const r = el.getBoundingClientRect(); return { element: label(el), position: getComputedStyle(el).position, heightShare: +(Math.min(r.height, vh) / vh).toFixed(2) }; })
    .filter((x) => x.heightShare >= 0.25);

  // Visibility of elements with own text – for comparison with desktop.
  // Key: tag + normalised own text + occurrence – robust to DOM order differences.
  const textVisibility = {};
  const seen = {};
  for (const el of document.body ? document.body.querySelectorAll('*') : []) {
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
    if (own.length < 3) continue;
    const base = `${el.tagName.toLowerCase()}|${own.slice(0, 120)}`;
    seen[base] = (seen[base] || 0) + 1;
    const key = `${base}|${seen[base]}`;
    textVisibility[key] = { visible: visible(el), text: own.slice(0, 60), element: label(el) };
  }

  // :hover rules revealing content outside @media (hover: hover).
  const hoverReveal = [];
  const walk = (rules, inHoverMedia) => {
    for (const r of rules) {
      if (r.cssRules && r.media) { walk(r.cssRules, inHoverMedia || /hover\s*:\s*hover/.test(r.media.mediaText)); continue; }
      if (r.cssRules && !r.selectorText) { walk(r.cssRules, inHoverMedia); continue; }
      if (r.selectorText && r.selectorText.includes(':hover') && !inHoverMedia) {
        const s = r.style; const d = s.getPropertyValue('display'), v = s.getPropertyValue('visibility'), o = s.getPropertyValue('opacity');
        if ((d && d !== 'none') || v === 'visible' || (o && parseFloat(o) > 0)) hoverReveal.push({ selector: r.selectorText, focusWithinAlternative: false });
      }
    }
  };
  // :focus / :focus-visible / :focus-within selectors – recursively, also in @media, @supports, @layer.
  const focusSelectors = [];
  const collectFocus = (rules) => {
    for (const r of rules) {
      if (r.selectorText && /:focus-within|:focus-visible|:focus\b/.test(r.selectorText)) focusSelectors.push(r.selectorText);
      if (r.cssRules) collectFocus(r.cssRules);
    }
  };
  const unreadableSheets = [];
  for (const sh of document.styleSheets) {
    try { walk(sh.cssRules, false); collectFocus(sh.cssRules); } catch { unreadableSheets.push(sh.href || '(sheet without URL)'); }
  }
  // true – alternative exists; false – none in readable sheets; null – undecidable (unreadable sheets).
  hoverReveal.forEach((h) => {
    const base = h.selector.split(':hover')[0].trim();
    const found = focusSelectors.some((f) => f.includes(base));
    h.focusWithinAlternative = found ? true : (unreadableSheets.length ? null : false);
  });

  return {
    viewportMeta: metaContent,
    zoomBlocked: !!metaContent && (/user-scalable\s*=\s*(no|0)/i.test(metaContent) || /maximum-scale\s*=\s*(1(\.0+)?|0?\.\d+)\b/i.test(metaContent)),
    deviceWidth, layoutWidth: window.innerWidth, desktopLayoutOnMobile: !deviceFit && window.innerWidth > deviceWidth,
    scrollWidth: doc.scrollWidth, horizontalScroll: doc.scrollWidth > vw + 1,
    pageHeight: doc.scrollHeight,
    overflowing: overflowing.slice(0, 15).map((o) => ({ element: label(o.el), right: o.right, width: o.width })),
    contentSpilling: spilling.slice(0, 15).map((o) => ({ element: label(o.el), contentWidth: o.contentWidth, boxWidth: o.boxWidth, text: (o.el.innerText || '').trim().slice(0, 60) })),
    smallTargets: small.slice(0, 30), smallInputs, fixedCovering: fixed, hoverReveal, unreadableSheets, textVisibility,
  };
}

const browser = await chromium.launch({ executablePath, headless: true });
const result = { url, tool: `playwright-core@${pwVersion}`, browser: `${executablePath} ${browser.version()}`, settleMs, waitFor: waitFor || null,
  note: 'Emulation (isMobile, touch, DPR 3 for phones) – not a real device. Finding status: "Confirmed (emulation)".', profiles: {} };
if (outDir) mkdirSync(outDir, { recursive: true });
try {
  for (const p of PROFILES) {
    const ctx = await browser.newContext({ viewport: { width: p.width, height: p.height }, isMobile: p.mobile, hasTouch: p.mobile, deviceScaleFactor: p.mobile ? 3 : 1 });
    if (offline) await ctx.route(/^https?:/, (r) => r.abort());
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 200)));
    const incomplete = [];
    try { await page.goto(url, { waitUntil: 'load', timeout: 20000 }); } catch (e) { incomplete.push(`load: ${e.message.split('\n')[0]}`); }
    if (waitFor) { try { await page.waitForSelector(waitFor, { state: 'visible', timeout: 15000 }); } catch { incomplete.push(`element did not appear: ${waitFor}`); } }
    try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch { /* no font API */ }
    await page.waitForTimeout(settleMs);
    const m = await page.evaluate(measure, p.width);
    m.complete = incomplete.length === 0;
    m.incompleteReasons = incomplete;
    m.hoverMediaMatches = await page.evaluate(() => matchMedia('(hover: hover)').matches);
    m.pageErrors = errors;
    if (outDir) { const f = join(outDir, `${p.name}.png`); await page.screenshot({ path: f, fullPage: true }); m.screenshot = f; }
    result.profiles[p.name] = m;
    await ctx.close();
  }
} finally { await browser.close(); }

// Content visible on desktop but hidden on phone (390 px) – mobile-first indexing.
const desk = result.profiles['1440x900-desktop'].textVisibility, mob = result.profiles['390x844'].textVisibility;
result.hiddenOnMobile = Object.entries(desk).filter(([k, v]) => v.visible && mob[k] && !mob[k].visible).map(([, v]) => ({ element: v.element, text: v.text })).slice(0, 30);
for (const m of Object.values(result.profiles)) delete m.textVisibility;
result.incompleteProfiles = Object.entries(result.profiles).filter(([, m]) => !m.complete).map(([n]) => n);
if (result.incompleteProfiles.length) result.warning = 'Measurement incomplete for some profiles – mark their findings "To confirm", not "Confirmed".';
console.log(JSON.stringify(result, null, 2));
process.exit(result.incompleteProfiles.length ? 4 : 0);
