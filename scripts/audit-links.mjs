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

function extractKnownLinks(source) {
  const match = source.match(/const KNOWN_LINKS:[\s\S]*?= \{([\s\S]*?)\n\};/);
  const links = new Map();
  if (!match) return links;
  for (const line of match[1].split('\n')) {
    const m = line.match(/^\s*(?:"([^"]+)"|([A-Za-z_$][\w$]*)):\s*"([^"]+)",?\s*$/);
    if (m) links.set(m[1] || m[2], m[3]);
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
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'Mozilla/5.0 VibeCoderLinkAudit/1.0' },
    });
    return { ...item, requestedUrl: url, finalUrl: res.url, status: res.status, ok: res.status < 400 };
  } catch (error) {
    return { ...item, requestedUrl: url, finalUrl: null, status: null, ok: false, error: String(error?.message || error) };
  } finally {
    clearTimeout(timer);
  }
}

async function pool(items, concurrency, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const i = cursor++;
      if (i >= items.length) break;
      out[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return out;
}

const pageSource = await fs.readFile(pagePath, 'utf8');
const knownLinks = extractKnownLinks(pageSource);

for (const path of resourceFiles) {
  const original = await fs.readFile(path, 'utf8');
  const normalized = normalizeFileContent(original, knownLinks);
  if (normalized !== original) await fs.writeFile(path, normalized);
}

const resources = [];
for (const path of resourceFiles) {
  const source = await fs.readFile(path, 'utf8');
  resources.push(...extractResources(source, path));
}

const unresolved = [];
const testable = [];
for (const item of resources) {
  const resolved = item.url || knownLinks.get(item.name) || null;
  if (!resolved) {
    unresolved.push(item);
    continue;
  }
  testable.push({ ...item, resolved });
}

const checked = await pool(testable, 30, (item) => checkUrl(item, item.resolved));
const broken = checked.filter((r) => !r.ok);
const redirected = checked.filter((r) => r.ok && r.finalUrl && r.finalUrl !== r.requestedUrl);

const report = {
  generatedAt: new Date().toISOString(),
  totalCards: resources.length,
  testedLinks: checked.length,
  unresolved: unresolved.map(({ name, category, file }) => ({ name, category, file })),
  broken,
  redirected,
};
await fs.writeFile('link-audit-report.json', JSON.stringify(report, null, 2) + '\n');

console.log(`LINK_AUDIT total=${report.totalCards} tested=${report.testedLinks} unresolved=${report.unresolved.length} broken=${report.broken.length} redirected=${report.redirected.length}`);
if (unresolved.length) {
  console.log('UNRESOLVED CARDS');
  for (const item of unresolved) console.log(`- ${item.name} [${item.category}] (${item.file})`);
}
if (broken.length) {
  console.log('BROKEN LINKS');
  for (const item of broken) console.log(`- ${item.name}: ${item.requestedUrl} status=${item.status ?? 'ERR'} ${item.error || ''}`);
}
if (redirected.length) {
  console.log('REDIRECTS');
  for (const item of redirected) console.log(`- ${item.name}: ${item.requestedUrl} -> ${item.finalUrl}`);
}

if (broken.length) process.exitCode = 2;
