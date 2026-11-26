#!/usr/bin/env node
// Slop sweep: searches source files for the code signals of the visual and copy catalogue
// (references/A-visual.md, G-copy.md) and returns counts with a few locations per signal.
// No dependencies. Output is a list of LEADS – confirm each visually before reporting.
//   node <skill-path>/scripts/slop-sweep.mjs <file|dir> [--max 3] [--json]
// Exit 0 – done, 2 – bad arguments.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) {
  console.log('Usage: slop-sweep.mjs <file|dir> [--max <examples per signal, default 3>] [--json]');
  process.exit(args.length ? 0 : 2);
}
const root = args[0];
const maxEx = Number(args[args.indexOf('--max') + 1]) || 3;
const asJson = args.includes('--json');
if (!existsSync(root)) { console.error(`Not found: ${root}`); process.exit(2); }

const EXT = new Set(['.html', '.htm', '.css', '.scss', '.sass', '.less', '.js', '.mjs', '.jsx', '.ts', '.tsx',
  '.vue', '.svelte', '.astro', '.php', '.twig', '.liquid', '.njk', '.hbs', '.md', '.mdx', '.json']);
const SKIP = new Set(['node_modules', '.git', '.next', '.nuxt', '.svelte-kit', 'vendor', '.impeccable', 'coverage']);

// [ID, label, regex]. IDs match the catalogue; "G-…" rows are copy signals.
const SIGNALS = [
  ['C1', 'purple/indigo/violet palette', /#(7c3aed|8b5cf6|6366f1|a855f7|4f46e5|6d28d9|9333ea)\b|\b(indigo|violet|purple)-(300|400|500|600|700)\b/i],
  ['C2', 'gradient text', /background-clip:\s*text|-webkit-background-clip:\s*text|\bbg-clip-text\b/i],
  ['C3', 'glow / halo / big blur', /radial-gradient\(.*(transparent|rgba\([^)]*,\s*0(\.0+)?\))|\bblur-(2xl|3xl)\b|\bblur-\[\d{2,}px\]|filter:\s*blur\(\s*(\d{2,})px|box-shadow:[^;]*0\s+0\s+\d{2,}px[^;]*(rgba?|#)/i],
  ['C4', 'cream / beige background', /#(f4f1ea|faf7f2|f5f0e8|fbf8f3|f7f3ec|f5f1e8|f3efe6|fdfbf7)\b|\bbg-(stone|amber|orange)-50\b/i],
  ['C6', 'terracotta / clay accent', /#(d97757|cc785c|c96442|da7756)\b/i],
  ['C7', 'repeating stripes', /repeating-(linear|radial)-gradient/i],
  ['T1', 'overused font', /\b(Inter|Roboto|Geist|Plus Jakarta Sans|Space Grotesk)\b|family=(Inter|Roboto|Geist|Plus\+Jakarta\+Sans|Space\+Grotesk)/],
  ['T2', 'display serif (Instrument Serif, Fraunces…)', /Instrument[ +]Serif|\bFraunces\b|\bRecoleta\b|Playfair|\bNewsreader\b/],
  ['T3', 'tracked uppercase label / eyebrow / pill', /\btracking-(widest|wider|\[0?\.\d+em\])\b|letter-spacing:\s*0?\.(1[2-9]|[2-9]\d?)\d*em|\beyebrow\b|\bkicker\b/i],
  ['T6', 'one emphasised word in heading', /<h[12][^>]*>[^<]*<(em|i|span)\b[^>]*>[^<]{1,24}<\/(em|i|span)>/i],
  ['T7', 'arrows on buttons/links, · separators', /→|&rarr;|&#8594;|\s·\s|&middot;/],
  ['L3', 'one card style everywhere (rounded + shadow)', /\brounded-(2xl|3xl)\b[^"'\n]*\bshadow(-sm|-md|-lg|-xl)?\b|\bshadow(-sm|-md|-lg|-xl)?\b[^"'\n]*\brounded-(2xl|3xl)\b/],
  ['L2', 'icon tile above card heading', /class="[^"]*\bicon\b[^"]*"[^>]*>\s*(<\/(div|span)>|<svg)[\s\S]{0,80}<h[3-4]/i],
  ['L12', 'thin border + wide shadow', /border:\s*1px[^;}]*;[^}]*box-shadow:\s*0\s+\d+px\s+\d{2,}px|box-shadow:\s*0\s+\d+px\s+\d{2,}px[^}]*border:\s*1px/i],
  ['L5', 'coloured side border on cards', /\bborder-l-(4|8|\[\d+px\])\b|border-left:\s*([3-9]|\d{2})px/i],
  ['L6', '01/02/03 numbering', /["'>]\s*0[1-9]\s*[<."'\/—–-]/],
  ['L7', 'decorative grid background', /background-size:\s*\d+px\s+\d+px|bg-\[size:\d+px_\d+px\]|bg-grid/i],
  ['L9', 'pills everywhere', /\brounded-full\b|border-radius:\s*(9999|999|100)px/i],
  ['L11', 'emoji / sparkle icons', /[✨🚀⚡✦✧💡🔥🎯]|\bSparkles?\b|sparkle-icon|lucide-sparkles/],
  ['M1', 'reveal-on-scroll', /data-aos|\bfade-?up\b|fadeInUp|whileInView|IntersectionObserver|ScrollTrigger|\breveal\b/i],
  ['M2', 'hover lift on cards', /hover:-translate-y-|hover:scale-|:hover\s*\{[^}]*transform:\s*(translateY\(-|scale\()/i],
  ['M3', 'marquee', /marquee/i],
  ['M4', 'pulsing dots / blinking cursor', /\banimate-(pulse|ping)\b|@keyframes\s+(pulse|ping|blink)/i],
  ['M5', 'content hidden at rest', /opacity:\s*0\s*[;}]|\bopacity-0\b/],
  ['M6', 'bounce easing', /cubic-bezier\([^)]*1\.[2-9]|\bbounce\b/i],
  ['IM8', 'dithering / halftone (Low)', /dither|halftone|\bbayer\b|image-rendering:\s*pixelated/i],
  ['G-buzz', 'buzzwords', /\b(reimagin\w*|seamless\w*|supercharg\w*|empower\w*|elevate[sd]?|unlock\w*|effortless\w*|next[- ]gen\w*|cutting[- ]edge|game[- ]chang\w*|revolutioni\w*)\b|rewolucyjn\w*|kompleksow\w+ obsług\w*|najwyższ\w+ jakoś\w*|innowacyjn\w*|na wyższy poziom/i],
  ['G1', 'template or unverified proof', /John Doe|Jane Doe|\bAcme\b|Lorem ipsum|\b\d{1,3}[,. ]?\d{3}\+\s*(teams|users|customers|companies|clients|klient\w*|użytkownik\w*|firm\w*)|trusted by|zaufał\w* nam/i],
  ['G-quiet', '"quiet" tic (Low)', /\bquiet(ly)?\b/i],
  ['G-real', '"real" tic (Low)', /\breal (results|people|teams|impact|work|value|growth)\b|\b(realn\w+|prawdziw\w+) (efekt\w*|wynik\w*|zmian\w*|wartoś\w*)/i],
];

const files = [];
(function walk(p) {
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const e of readdirSync(p)) if (!SKIP.has(e)) walk(join(p, e));
  } else if (EXT.has(extname(p).toLowerCase()) && st.size < 2_000_000 && !/\.min\.(js|css)$/.test(p)) files.push(p);
})(root);

const hits = Object.fromEntries(SIGNALS.map(([id, label]) => [id, { label, count: 0, files: new Set(), examples: [] }]));
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const [id, , re] of SIGNALS) {
      if (!re.test(line)) continue;
      const h = hits[id];
      h.count++; h.files.add(f);
      if (h.examples.length < maxEx) h.examples.push(`${relative(process.cwd(), f) || f}:${i + 1}  ${line.trim().slice(0, 120)}`);
    }
  });
}

const found = Object.entries(hits).filter(([, h]) => h.count).map(([id, h]) => ({ id, label: h.label, count: h.count, files: h.files.size, examples: h.examples }));
const report = {
  scanned: files.length,
  found,
  notFound: Object.keys(hits).filter(id => !hits[id].count),
  note: 'Leads only: confirm each visually and with the removal test; the brand file can make a signal intentional. Single hits rarely matter – look for clusters.',
};
if (asJson) { console.log(JSON.stringify(report, null, 2)); process.exit(0); }
console.log(`Scanned ${report.scanned} files. Signals found: ${found.length}/${SIGNALS.length}\n`);
for (const s of found) {
  console.log(`${s.id.padEnd(8)} ${s.label} – ${s.count}× in ${s.files} file(s)`);
  for (const e of s.examples) console.log(`         ${e}`);
}
console.log(`\nNot found: ${report.notFound.join(', ') || '–'}\n${report.note}`);
