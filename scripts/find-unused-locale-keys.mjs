import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PLURAL_SUFFIXES = ['_zero', '_one', '_two', '_few', '_many', '_other'];

const files = [];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(fullPath);
    else if (/\.(js|jsx|html)$/.test(ent.name)) files.push(fullPath);
  }
}

walk(path.join(root, 'src'));
const indexHtml = path.join(root, 'index.html');
if (fs.existsSync(indexHtml)) files.push(indexHtml);

const staticKeys = new Set();
const dynamicPrefixes = new Set();

function addDynamicPrefix(prefix) {
  if (!prefix) return;
  const normalized = prefix.endsWith('.') ? prefix : `${prefix}.`;
  const segmentCount = normalized.split('.').filter(Boolean).length;
  if (segmentCount < 3) return;
  dynamicPrefixes.add(normalized);
}

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');

  const literalRe = /(?:^|[^a-zA-Z0-9_])(?:i18n\.)?t\(\s*(['"])([^'"]+)\1/g;
  let match;
  while ((match = literalRe.exec(content))) {
    staticKeys.add(match[2]);
  }

  const templateRe = /(?:^|[^a-zA-Z0-9_])(?:i18n\.)?t\(\s*`([^`]+)`/g;
  while ((match = templateRe.exec(content))) {
    const template = match[1];
    if (!template.includes('${')) {
      staticKeys.add(template);
      continue;
    }

    addDynamicPrefix(template.split('${')[0]);
  }
}

const { toolDefinitions } = await import(pathToFileURL(path.join(root, 'src/data/tools.js')).href);
for (const tool of toolDefinitions) {
  dynamicPrefixes.add(`tools.items.${tool.id}.`);
  addDynamicPrefix(`tools.ui.${tool.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}.`);
}

const localeModule = await import(pathToFileURL(path.join(root, 'src/locales/en/index.js')).href);
const localeObj = localeModule.default.translation;

function flatten(obj, prefix = '') {
  const keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flatten(value, full));
    } else {
      keys.push(full);
    }
  }

  return keys;
}

const allKeys = flatten(localeObj);

function isUsed(key) {
  if (staticKeys.has(key)) return true;

  for (const suffix of PLURAL_SUFFIXES) {
    if (key.endsWith(suffix)) {
      const base = key.slice(0, -suffix.length);
      if (staticKeys.has(base)) return true;
    }
  }

  for (const prefix of dynamicPrefixes) {
    if (key.startsWith(prefix)) return true;
  }

  return false;
}

const unused = allKeys.filter((key) => !isUsed(key));

console.log(`Static keys: ${staticKeys.size}`);
console.log(`Dynamic prefixes: ${dynamicPrefixes.size}`);
console.log(`Total locale keys: ${allKeys.length}`);
console.log(`Unused: ${unused.length}`);
console.log('---');
unused.sort().forEach((key) => console.log(key));
