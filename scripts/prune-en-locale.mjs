import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PLURAL_SUFFIXES = ['_zero', '_one', '_two', '_few', '_many', '_other'];
const localePath = path.join(root, 'src/locales/en/index.js');

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
const { workHistory } = await import(pathToFileURL(path.join(root, 'src/data/work.js')).href);
const { projects } = await import(pathToFileURL(path.join(root, 'src/data/projects.js')).href);
const { skillCategories } = await import(pathToFileURL(path.join(root, 'src/data/skills.js')).href);
const { socialLinks } = await import(pathToFileURL(path.join(root, 'src/data/about.js')).href);

const skillStatKeys = ['yearsInProduction', 'activeUsersServed', 'cloudProductsShipped', 'projectsDelivered'];

for (const tool of toolDefinitions) {
  dynamicPrefixes.add(`tools.items.${tool.id}.`);
  dynamicPrefixes.add(`tools.categories.${tool.categoryKey}`);
}

for (const job of workHistory) {
  dynamicPrefixes.add(`work.items.${job.id}.`);
}

for (const project of projects) {
  dynamicPrefixes.add(`projects.items.${project.id}.`);
}

for (const category of skillCategories) {
  dynamicPrefixes.add(`skills.categories.${category.id}.`);
}

for (const statKey of skillStatKeys) {
  staticKeys.add(`skills.stats.${statKey}`);
}

for (const link of socialLinks) {
  staticKeys.add(`social.${link.id}`);
}

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

function pruneObject(obj, currentPath = '') {
  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj;
  }

  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullPath = currentPath ? `${currentPath}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const prunedChild = pruneObject(value, fullPath);
      if (Object.keys(prunedChild).length > 0) {
        result[key] = prunedChild;
      }
      continue;
    }

    if (isUsed(fullPath)) {
      result[key] = value;
    }
  }

  return result;
}

function formatString(value) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function formatJsObject(value, level = 0) {
  const indent = '  '.repeat(level);
  const inner = '  '.repeat(level + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const lines = value.map((item) => `${inner}${formatString(item)},`);
    return `[\n${lines.join('\n')}\n${indent}]`;
  }

  if (value === null || typeof value !== 'object') {
    if (typeof value === 'string') return formatString(value);
    return String(value);
  }

  const entries = Object.entries(value);
  if (entries.length === 0) return '{}';

  const lines = entries.map(([key, child]) => {
    const safeKey = /^[A-Za-z_][A-Za-z0-9_]*$/.test(key) ? key : formatString(key);
    return `${inner}${safeKey}: ${formatJsObject(child, level + 1)},`;
  });

  return `{\n${lines.join('\n')}\n${indent}}`;
}

const localeModule = await import(pathToFileURL(localePath).href);
const pruned = pruneObject(localeModule.default.translation);

const output = `export default {\n  translation: ${formatJsObject(pruned, 1)},\n};\n`;
fs.writeFileSync(localePath, output, 'utf8');

function flatten(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) return flatten(value, full);
    return [full];
  });
}

const before = flatten(localeModule.default.translation).length;
const after = flatten(pruned).length;
console.log(`Pruned ${before - after} unused keys (${before} -> ${after})`);
