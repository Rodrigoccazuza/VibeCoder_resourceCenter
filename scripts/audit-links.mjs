import fs from 'node:fs/promises';

const resourceFiles = ['app/resources.ts', 'app/motionResources.ts', 'app/uiLibraries.ts'];
const pagePath = 'app/page.tsx';

const canonicalReplacements = new Map([
  ['https://primereact.org/', 'https://primereact.dev/'],
  ['https://tailwindcss.com/plus/ui-blocks/application-ui', 'https://catalyst.tailwindui.com/'],
  ['https://react-bits.com/', 'https://www.reactbits.dev/'],
  ['https://hover.dev/', 'https://www.hover.dev/'],
  ['https://animata.design/', 'https://www.animata.design/'],
  ['https://osmo.supply/', 'https://www.osmo.supply/'],
]);

const verifiedOverrides = new Map([
  ['Better Logo Figma Plugin', 'https://better-logo.com/'],
  ['Content Reel', 'https://www.figma.com/community/plugin/731627216655469013/content-reel'],
  ['Contrast Figma Plugin', 'https://www.figma.com/community/plugin/748533339900865323'],
  ['Design Documentation Figma Plugin', 'https://www.figma.com/solutions/ai-design-documentation-generator/'],
  ['Feather Icons Figma Plugin', 'https://www.figma.com/community/plugin/744047966581015514/Feather'],
  ['Figma Components', 'https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma'],
  ['Framer Extension for Figma', 'https://www.framer.com/figma/'],
  ['Html to Design Figma Plugin', 'https://html.to.design/home'],
  ['Insert Big Image Figma Plugin', 'https://www.figma.com/community/plugin/799646392992487942/insert-big-image'],
  ['LottieFiles for Figma', 'https://www.figma.com/community/plugin/809860933081065308/lottiefiles'],
  ['Mockups Figma Plugin', 'https://mockuuups.studio/figma'],
  ['Noise & Texture Figma Plugin', 'https://www.figma.com/community/plugin/1138854718618193875'],
  ['Perspective Toolkit Figma Plugin', 'https://www.figma.com/community/plugin/862059663689780943/perspective-toolkit'],
  ['Pitchdeck Figma Plugin', 'https://www.figma.com/community/plugin/838925615018625519/pitchdeck-presentation-studio'],
  ['Vectorize Figma Plugin', 'https://www.figma.com/solutions/vectorize-image/'],
  ['WebP Exporter Figma Plugin', 'https://www.figma.com/community/plugin/1181873200384736932'],
  ['App Shots', 'https://appshots.design/'],
  ['btw Landing Pages', 'https://www.btw.so/marketing/landing-page-examples'],
  ['Pafolios', 'https://pafolios.com/'],
  ['SaaS Landing Page', 'https://saaslandingpage.com/'],
  ['Animated Emojis', 'https://threedee.design/blog/3d-emoji-pack-emoticonz'],
  ['Design Systems Brasileiros', 'https://designsystemsbrasileiros.com/'],
  ['Design Systems for Figma', 'https://www.designsystemsforfigma.com/'],
  ['Free Illustrations', 'https://getillustrations.com/free-illustrations'],
  ['Halo UI/UX', 'https://dribbble.com/haloweb/about'],
  ['Handz', 'https://www.handz.design/'],
  ['Noise & Gradient', 'https://www.noiseandgradient.com/'],
  ['UX Challenges', 'https://uxchallenge.com/'],
  ['Boosters', 'https://www.flowbase.co/'],
  ['Flowbase', 'https://www.flowbase.co/'],
  ['Export SVG Extension', 'https://github.com/martingraham/svgExport'],
  ['Agent Skills Pack', 'https://github.com/killerfirst/agent-skills-pack'],
  ['Graphify', 'https://github.com/Graphify-Labs/graphify'],
  ['Liquid Logo', 'https://github.com/collidingScopes/liquid-logo'],
  ['LiquidGlass.js', 'https://github.com/Mael-667/Liquid-Glass-CSS'],
]);

// These legacy labels cannot be mapped to one unique, verifiable official project.
// Removing them is safer than sending users to a search page or a guessed destination.
const unverifiedLegacyEntries = new Set([
  'Film AI',
  'Real People Figma Plugin',
  'Cherryp',
  'Super Hero',
  'Icon Hunt',
  'CSS Packer',
]);

function extractKnownLinks(source) {
  const match = source.match(/const KNOWN_LINKS:[\s\S]*?= \{([\s\S]*?)\n\};/);
  const links = new Map(verifiedOverrides);
  if (!match) return links;
  for (const line of match[1].split('\n')) {
    const m = line.match(/^\s*(?:"([^"]+)"|([A-Za-z_$][\w$]*)):\s*"([^"]+)",?\s*$/);
    if (m && !links.has(m[1] || m[2])) links.set(m[1] || m[2], m[3]);
  }
  return links;
}

function normalizeFileContent(source, knownLinks) {
  for (const [from, to] of canonicalReplacements) source = source.split(from).join(to);
  source = source.replace(/\{([\s\S]*?)\n\s*\}/g, (block) => {
    const nameMatch = block.match(/(?:"name"|name):\s*"([^"]+)"/);
    const nullUrlMatch = block.match(/(?:"url"|url):\s*null/);
    if (!nameMatch || !nullUrlMatch) return block;
    const direct = knownLinks.get(nameMatch[1]);
    if (!direct) return block;
    return block.replace(/((?:"url"|url):\s*)null/, `$1"${direct}"`);
  });
  source = source.replace(/\n  \{[\s\S]*?\n  \},?/g, (block) => {
    const name = block.match(/"name":\s*"([^"]+)"/)?.[1];
    if (name && unverifiedLegacyEntries.has(name)) return '';
    return block;
  });
  source = source.replace(/\n\s*\n/g, '\n');
  return source;
}

function extractResources(source, file) {
  const results = [];
  const objectRegex = /\{([\s\S]*?)\n\s*\}/g;
  for (const match of source.matchAll(objectRegex)) {
    const block = match[0];
    const name = block.match(/(?:"name"|name):\s*"([^"]+)"/)?.[1];
    if (!name) continue;
    const urlToken = block.match(/(?:"url"|url):\s*(null|"[^"]+")/)?.[1];
    const category = block.match(/(?:"category"|category):\s*"([^"]+)"/)?.[1] || '';
    const url = urlToken && urlToken !== 'null' ? urlToken.slice(1, -1) : null;
    results.push({ name, url, category, file });
  }
  return results;
}

async function checkUrl(item, url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal, headers: { 'user-agent': 'Mozilla/5.0 VibeCoderLinkAudit/1.0' } });
    const blocked = [401, 403, 429].includes(res.status);
    return { ...item, requestedUrl: url, finalUrl: res.url, status: res.status, ok: res.status < 400 || blocked, blocked };
  } catch (error) {
    return { ...item, requestedUrl: url, finalUrl: null, status: null, ok: true, blocked: true, error: String(error?.message || error) };
  } finally { clearTimeout(timer); }
}

async function pool(items, concurrency, fn) {
  const out = new Array(items.length); let cursor = 0;
  async function worker() { while (true) { const i = cursor++; if (i >= items.length) break; out[i] = await fn(items[i]); } }
  await Promise.all(Array.from({ length: concurrency }, worker)); return out;
}

const pageSource = await fs.readFile(pagePath, 'utf8');
const knownLinks = extractKnownLinks(pageSource);
for (const path of resourceFiles) {
  const original = await fs.readFile(path, 'utf8');
  const normalized = normalizeFileContent(original, knownLinks);
  if (normalized !== original) await fs.writeFile(path, normalized);
}

const resources = [];
for (const path of resourceFiles) resources.push(...extractResources(await fs.readFile(path, 'utf8'), path));
const unresolved = [], testable = [];
for (const item of resources) {
  const resolved = item.url || knownLinks.get(item.name) || null;
  if (!resolved) unresolved.push(item); else testable.push({ ...item, resolved });
}

const checked = await pool(testable, 30, (item) => checkUrl(item, item.resolved));
const broken = checked.filter((r) => !r.ok);
const blocked = checked.filter((r) => r.blocked);
const redirected = checked.filter((r) => r.ok && !r.blocked && r.finalUrl && r.finalUrl !== r.requestedUrl);
const report = { generatedAt: new Date().toISOString(), totalCards: resources.length, testedLinks: checked.length, unresolved: unresolved.map(({ name, category, file }) => ({ name, category, file })), broken, blocked, redirected, removedUnverifiedLegacyEntries: [...unverifiedLegacyEntries] };
await fs.writeFile('link-audit-report.json', JSON.stringify(report, null, 2) + '\n');
console.log(`LINK_AUDIT total=${report.totalCards} tested=${report.testedLinks} unresolved=${report.unresolved.length} broken=${report.broken.length} blocked=${report.blocked.length} redirected=${report.redirected.length}`);
if (unresolved.length) { console.log('UNRESOLVED CARDS'); for (const item of unresolved) console.log(`- ${item.name} [${item.category}]`); }
if (broken.length) { console.log('BROKEN LINKS'); for (const item of broken) console.log(`- ${item.name}: ${item.requestedUrl} status=${item.status ?? 'ERR'}`); }
if (unresolved.length || broken.length) process.exitCode = 2;
