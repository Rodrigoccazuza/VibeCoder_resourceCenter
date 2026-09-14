import fs from 'node:fs/promises';

const path = 'app/page.tsx';
let source = await fs.readFile(path, 'utf8');

const before = 'const categories = Object.keys(CATEGORY_META);';
const after = `const categories = [\n  "Motion & Interaction",\n  "UI Component Libraries",\n  ...Object.keys(CATEGORY_META).filter((item) => item !== "Motion & Interaction" && item !== "UI Component Libraries"),\n];`;

if (!source.includes(before) && !source.includes(after)) {
  throw new Error('Could not find the sidebar category declaration in app/page.tsx');
}

if (source.includes(before)) {
  source = source.replace(before, after);
  await fs.writeFile(path, source);
  console.log('Pinned Motion & Interaction and UI Component Libraries at the top of the sidebar.');
} else {
  console.log('Sidebar categories are already pinned.');
}
