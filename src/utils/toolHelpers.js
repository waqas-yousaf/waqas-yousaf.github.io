import yaml from 'js-yaml';
import i18n from '../i18n';

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

export function downloadTextFile(text, filename) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export const LOREM_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const MEMORABLE_WORDS = [
  'apple', 'amber', 'anchor', 'arrow', 'atlas', 'azure', 'beacon', 'berry', 'blade', 'bloom',
  'bridge', 'bronze', 'candle', 'carbon', 'cedar', 'cloud', 'comet', 'coral', 'crown', 'delta',
  'ember', 'falcon', 'flame', 'forest', 'galaxy', 'garden', 'glacier', 'harbor', 'honey', 'horizon',
  'island', 'ivory', 'jasmine', 'journey', 'kernel', 'lantern', 'legend', 'lemon', 'light', 'lotus',
  'maple', 'marble', 'meadow', 'mercury', 'mirror', 'monarch', 'mountain', 'nebula', 'nectar', 'nova',
  'ocean', 'olive', 'orbit', 'pearl', 'planet', 'plasma', 'prairie', 'pulse', 'quartz', 'river',
  'rocket', 'saffron', 'shadow', 'silver', 'spark', 'spectrum', 'spring', 'stone', 'storm', 'summit',
  'sunrise', 'thunder', 'timber', 'turquoise', 'valley', 'vector', 'velvet', 'violet', 'wave', 'willow',
  'winter', 'wizard', 'wonder', 'zenith', 'zephyr', 'crystal', 'frost', 'pixel', 'signal',
];

const FUNNY_ADJECTIVES = [
  'Sneaky', 'Dramatic', 'Caffeinated', 'Legendary', 'Suspicious', 'Chaotic', 'Polite', 'Cosmic',
  'Sleepy', 'Overconfident', 'Mysterious', 'Spicy', 'Awkward', 'Royal', 'Glitchy', 'Hangry',
  'Unhinged', 'Feral', 'Clumsy', 'Sassy', 'Bouncy', 'Grumpy', 'Zen', 'Delulu', 'Cringe', 'Based',
  'Bussin', 'Unserious', 'MainCharacter', 'Lowkey', 'Highkey', 'Chronically', 'Terminally',
  'Unbothered', 'Moist', 'Cursed', 'Blessed', 'Sus', 'Ratchet', 'Cheugy', 'Normie', 'Sigma',
  'Alpha', 'Beta', 'Goblin', 'GoblinMode', 'ChaoticGood', 'Soft', 'Hard', 'Mid', 'Elite',
];

const FUNNY_NOUNS = [
  'Potato', 'Waffle', 'Debugger', 'Meeting', 'Keyboard', 'Nap', 'Burrito', 'Walrus', 'Penguin',
  'Database', 'Commit', 'Merge', 'Stacktrace', 'Semicolon', 'Lint', 'Bug', 'Cookie', 'Proxy',
  'Monolith', 'Standup', 'Backlog', 'Rubber', 'Duck', 'Ping', 'Cache', 'Regex', 'Skibidi',
  'Rizz', 'NPC', 'Sigma', 'Meme', 'Brainrot', 'Stan', 'Slay', 'VibeCheck', 'Ohio', 'Gyatt',
  'Fanum', 'Tax', 'Mewing', 'Looksmax', 'Lore', 'Cope', 'Seethe', 'Ratio', 'Clout', 'Algorithm',
  'Timeline', 'Feed', 'Reel', 'Hashtag', 'Influencer', 'Microservice', 'Kubernetes', 'Docker',
  'Webpack', 'npm', 'Git', 'PullRequest', 'RubberDuck', 'TechDebt', 'ScopeCreep',
];

const FUNNY_VERBS = [
  'Dances', 'Deploys', 'Naps', 'Panics', 'Compiles', 'Reboots', 'Whispers', 'Yeets', 'Snacks',
  'Debugs', 'Merges', 'Cries', 'Ships', 'Refactors', 'Vibes', 'Escapes', 'Linting', 'Gaslights',
  'Gatekeeps', 'Girlbosses', 'Cooks', 'Slays', 'Yaps', 'Mogging', 'Mewing', 'Looksmaxing',
  'Stans', 'Ratios', 'Copes', 'Seethes', 'Doomscrolls', 'Ghosting', 'Breadcrumbing', 'Maincharacters',
  'Delulu-ing', 'Cringes', 'Busses', 'Rizzing', 'TouchingGrass', 'NoCap', 'Cap', 'Flexes',
  'Humbles', 'Ate', 'Left', 'AteAndLeft',
];

const FUNNY_MEME_FRAGMENTS = [
  'NoCap', 'FrFr', 'Iykyk', 'Ong', 'Bruh', 'Sheesh', 'Bet', 'Slay', 'Periodt', 'Bestie',
  'Fam', 'Vibe', 'Mood', 'Cringe', 'Based', 'W', 'L', 'Mid', 'Bussin', 'Rizz',
];

const FUNNY_SYMBOLS = ['!', '!!', '!?', '#', '*', '?!'];

function secureRandomIndex(max) {
  if (max <= 0) return 0;

  const buffer = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  let value;

  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);

  return value % max;
}

function securePick(charset) {
  return charset[secureRandomIndex(charset.length)];
}

function shuffleChars(chars) {
  const next = [...chars];

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = secureRandomIndex(i + 1);
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next.join('');
}

export function generatePassword(length, options) {
  const { useUpper, useLower, useNumbers, useSymbols } = options;
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%^&*-_+=?';

  const pools = [];
  if (useUpper) pools.push(upper);
  if (useLower) pools.push(lower);
  if (useNumbers) pools.push(numbers);
  if (useSymbols) pools.push(symbols);

  if (!pools.length) return '';

  const charset = pools.join('');
  const minLength = Math.max(length, pools.length);
  const chars = pools.map((pool) => securePick(pool));

  while (chars.length < minLength) {
    chars.push(securePick(charset));
  }

  return shuffleChars(chars);
}

export function generateMemorablePassword(options = {}) {
  const { wordCount = 4, separator = '-', capitalize = true, includeNumber = true } = options;
  const words = [];

  for (let i = 0; i < wordCount; i += 1) {
    const word = MEMORABLE_WORDS[secureRandomIndex(MEMORABLE_WORDS.length)];
    words.push(capitalize ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : word);
  }

  if (!includeNumber) {
    return words.join(separator);
  }

  const number = secureRandomIndex(9000) + 1000;
  return `${words.join(separator)}${separator}${number}`;
}

function formatFunnyWord(word, capitalize) {
  if (!capitalize) return word.toLowerCase();
  return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
}

export function generateFunnyPassword(options = {}) {
  const {
    wordCount = 3,
    separator = '-',
    capitalize = true,
    includeNumber = false,
    includeSymbol = false,
  } = options;

  const pools = [FUNNY_ADJECTIVES, FUNNY_NOUNS, FUNNY_VERBS, FUNNY_MEME_FRAGMENTS];
  const words = [];

  for (let i = 0; i < wordCount; i += 1) {
    const pool = pools[i % pools.length];
    const word = pool[secureRandomIndex(pool.length)];
    words.push(formatFunnyWord(word, capitalize));
  }

  let result = separator ? words.join(separator) : words.join('');

  if (includeNumber) {
    const number = secureRandomIndex(9000) + 1000;
    result = separator ? `${result}${separator}${number}` : `${result}${number}`;
  }

  if (includeSymbol) {
    result += securePick(FUNNY_SYMBOLS);
  }

  return result;
}

export function getPasswordEntropyBits(password) {
  if (!password) return 0;

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/\d/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  if (!poolSize) return 0;
  return Math.round(password.length * Math.log2(poolSize));
}

function getPasswordStrengthLabel(score) {
  if (score <= 1) return i18n.t('helpers.passwordStrength.veryWeak');
  if (score <= 2) return i18n.t('helpers.passwordStrength.weak');
  if (score <= 3) return i18n.t('helpers.passwordStrength.fair');
  if (score <= 4) return i18n.t('helpers.passwordStrength.good');
  if (score <= 5) return i18n.t('helpers.passwordStrength.strong');
  if (score <= 6) return i18n.t('helpers.passwordStrength.excellent');
  return i18n.t('helpers.passwordStrength.superb');
}

function getPasswordStrengthMeta(score) {
  const maxScore = 7;
  const litSegments = Math.min(6, Math.max(0, score));

  if (score <= 1) {
    return { label: getPasswordStrengthLabel(score), percent: 17, className: 'tool-strength-very-weak', litSegments, maxScore };
  }
  if (score <= 2) {
    return { label: getPasswordStrengthLabel(score), percent: 33, className: 'tool-strength-weak', litSegments, maxScore };
  }
  if (score <= 3) {
    return { label: getPasswordStrengthLabel(score), percent: 50, className: 'tool-strength-fair', litSegments, maxScore };
  }
  if (score <= 4) {
    return { label: getPasswordStrengthLabel(score), percent: 67, className: 'tool-strength-good', litSegments, maxScore };
  }
  if (score <= 5) {
    return { label: getPasswordStrengthLabel(score), percent: 83, className: 'tool-strength-strong', litSegments, maxScore };
  }
  if (score <= 6) {
    return { label: getPasswordStrengthLabel(score), percent: 92, className: 'tool-strength-excellent', litSegments, maxScore };
  }
  return { label: getPasswordStrengthLabel(score), percent: 100, className: 'tool-strength-superb', litSegments: 6, maxScore };
}

export function getPasswordStrength(password) {
  const noneLabel = i18n.t('helpers.passwordStrength.none');
  const selectMessage = i18n.t('tools.ui.password.selectOneSet');

  if (!password || password === selectMessage) {
    return {
      label: noneLabel,
      percent: 0,
      className: 'tool-strength-none',
      score: 0,
      maxScore: 7,
      litSegments: 0,
      entropyBits: 0,
    };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  if (password.length >= 20 && /-/.test(password)) score += 1;

  return {
    ...getPasswordStrengthMeta(score),
    score,
    entropyBits: getPasswordEntropyBits(password),
  };
}

export function generateLaravelKey() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  let binary = '';
  for (let i = 0; i < arr.byteLength; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return `base64:${window.btoa(binary)}`;
}

export function generateFlaskSecretKey() {
  return bytesToHex(randomBytes(32));
}

export function generateRailsSecretKeyBase() {
  return bytesToHex(randomBytes(64));
}

export function generateSymfonyAppSecret() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return randomFromCharset(chars, 32);
}

export function generateExpressSessionSecret() {
  return bytesToHex(randomBytes(32));
}

export function generateFastApiSecretKey() {
  return bytesToHex(randomBytes(32));
}

export function generateUUID() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateUUIDs(count) {
  return Array.from({ length: count }, () => generateUUID());
}

function randomBytes(length) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function randomFromCharset(charset, length) {
  return Array.from({ length }, () => securePick(charset)).join('');
}

export function generate128BitHex() {
  return bytesToHex(randomBytes(16));
}

export function generate256BitHex() {
  return bytesToHex(randomBytes(32));
}

export function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return randomFromCharset(chars, 40);
}

export function generateJwtSecret() {
  const bytes = randomBytes(32);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return window
    .btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function generateDjangoSecret() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)';
  return randomFromCharset(chars, 50);
}

export function generateMongoObjectId() {
  const bytes = new Uint8Array(12);
  const timestamp = Math.floor(Date.now() / 1000);

  bytes[0] = (timestamp >> 24) & 0xff;
  bytes[1] = (timestamp >> 16) & 0xff;
  bytes[2] = (timestamp >> 8) & 0xff;
  bytes[3] = timestamp & 0xff;
  crypto.getRandomValues(bytes.subarray(4));

  return bytesToHex(bytes);
}

export function generateWifiWpaKey(length = 16) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
  const safeLength = Math.max(8, Math.min(63, Number(length) || 16));
  return randomFromCharset(chars, safeLength);
}

function generateBase64Secret(byteLength = 32) {
  const bytes = randomBytes(byteLength);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function generatePhoenixSecret() {
  return generateBase64Secret(32);
}

export function generateAspNetSecret() {
  return generateBase64Secret(32);
}

export function generateCraftCmsSecurityKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return randomFromCharset(chars, 32);
}

export function generateWordPressSalt() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}<>?/';
  return randomFromCharset(chars, 64);
}

export function generateStrapiJwtSecret() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return randomFromCharset(chars, 44);
}

export function generateSpringJwtSecret() {
  return bytesToHex(randomBytes(32));
}

export function generateOAuthClientSecret() {
  return bytesToHex(randomBytes(32));
}

export const APP_KEY_CATEGORIES = [
  { id: 'php', apps: ['laravel', 'symfony', 'adonisjs', 'craftcms'] },
  { id: 'python', apps: ['django', 'flask', 'fastapi'] },
  { id: 'nodejs', apps: ['express', 'nestjs', 'nextjs', 'nuxt', 'remix', 'sveltekit', 'strapi'] },
  { id: 'ruby', apps: ['rails'] },
  { id: 'elixir', apps: ['phoenix'] },
  { id: 'java', apps: ['spring'] },
  { id: 'dotnet', apps: ['aspnet'] },
  { id: 'cms', apps: ['wordpress'] },
  {
    id: 'generic',
    apps: [
      'genericHex128',
      'genericHex256',
      'genericBase64',
      'genericBase64Url',
      'genericApiKey',
      'oauthClient',
      'uuid',
      'apiKey',
      'hex128',
      'hex256',
      'jwtSecret',
      'djangoSecret',
      'mongoObjectId',
      'wifiWpa',
    ],
  },
];

export const SERVICE_KEY_GENERATORS = [
  'uuid',
  'apiKey',
  'hex128',
  'hex256',
  'jwtSecret',
  'djangoSecret',
  'mongoObjectId',
  'wifiWpa',
];

export const APP_KEY_GENERATORS = APP_KEY_CATEGORIES.flatMap((group) => group.apps);

export function isServiceKeyGenerator(id) {
  return SERVICE_KEY_GENERATORS.includes(id);
}

export function isValidAppKeyGeneratorId(id) {
  return APP_KEY_GENERATORS.includes(id);
}

export function generateAppKey(appId) {
  switch (appId) {
    case 'laravel':
    case 'adonisjs':
      return generateLaravelKey();
    case 'django':
      return generateDjangoSecret();
    case 'flask':
      return generateFlaskSecretKey();
    case 'rails':
      return generateRailsSecretKeyBase();
    case 'symfony':
      return generateSymfonyAppSecret();
    case 'express':
    case 'remix':
    case 'nuxt':
      return generateExpressSessionSecret();
    case 'nextjs':
    case 'sveltekit':
    case 'nestjs':
      return generateJwtSecret();
    case 'fastapi':
      return generateFastApiSecretKey();
    case 'phoenix':
      return generatePhoenixSecret();
    case 'aspnet':
      return generateAspNetSecret();
    case 'craftcms':
      return generateCraftCmsSecurityKey();
    case 'wordpress':
      return generateWordPressSalt();
    case 'strapi':
      return generateStrapiJwtSecret();
    case 'spring':
      return generateSpringJwtSecret();
    case 'oauthClient':
      return generateOAuthClientSecret();
    case 'genericHex128':
      return generate128BitHex();
    case 'genericHex256':
      return generate256BitHex();
    case 'genericBase64':
      return generateBase64Secret(32);
    case 'genericBase64Url':
      return generateJwtSecret();
    case 'genericApiKey':
      return generateApiKey();
    default:
      return generateLaravelKey();
  }
}

export function generateSecret(type, options = {}) {
  switch (type) {
    case 'apiKey':
      return generateApiKey();
    case 'hex128':
      return generate128BitHex();
    case 'hex256':
      return generate256BitHex();
    case 'jwtSecret':
      return generateJwtSecret();
    case 'djangoSecret':
      return generateDjangoSecret();
    case 'mongoObjectId':
      return generateMongoObjectId();
    case 'wifiWpa':
      return generateWifiWpaKey(options.length);
    default:
      return generateApiKey();
  }
}

export const SERVICE_KEY_COUNT = 5;

export function generateServiceKeys(type, count = SERVICE_KEY_COUNT, options = {}) {
  if (type === 'uuid') {
    return generateUUIDs(count);
  }

  return Array.from({ length: count }, () => generateSecret(type, options));
}

export function getBrowserInfo() {
  const { userAgent } = navigator;
  let browserName = 'Unknown';

  if (/Edg\//.test(userAgent)) browserName = 'Microsoft Edge';
  else if (/OPR\//.test(userAgent) || /Opera/.test(userAgent)) browserName = 'Opera';
  else if (/Firefox\//.test(userAgent)) browserName = 'Firefox';
  else if (/Chrome\//.test(userAgent) && !/Edg\//.test(userAgent)) browserName = 'Google Chrome';
  else if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) browserName = 'Safari';

  return {
    userAgent,
    browserName,
    language: navigator.language,
    languages: navigator.languages?.join(', ') ?? navigator.language,
    platform: navigator.platform || 'Unknown',
    cookiesEnabled: navigator.cookieEnabled ? i18n.t('helpers.yes') : i18n.t('helpers.no'),
    online: navigator.onLine ? i18n.t('helpers.yes') : i18n.t('helpers.no'),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenSize: `${window.screen.width} x ${window.screen.height}`,
    viewport: `${window.innerWidth} x ${window.innerHeight}`,
    pixelRatio: String(window.devicePixelRatio ?? 1),
  };
}

export async function fetchIpLocation() {
  const response = await fetch('https://ipwho.is/');
  if (!response.ok) {
    throw new Error(i18n.t('helpers.browserInfo.ipFetchError'));
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || i18n.t('helpers.browserInfo.ipFetchError'));
  }

  return {
    ip: data.ip || 'Unknown',
    city: data.city || 'Unknown',
    region: data.region || 'Unknown',
    country: data.country || 'Unknown',
    countryCode: data.country_code || '',
    postal: data.postal || 'Unknown',
    latitude: data.latitude ?? 'Unknown',
    longitude: data.longitude ?? 'Unknown',
    timezone: data.timezone?.id || data.timezone?.utc || 'Unknown',
    isp: data.connection?.isp || data.connection?.org || 'Unknown',
  };
}

export function generateSlug(input, separator = '-') {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]+/g, '')
    .replace(/[\s_]+/g, separator)
    .replace(new RegExp(`${separator}+`, 'g'), separator)
    .replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');
}

export function encodeBase64(input) {
  return window.btoa(input);
}

export function decodeBase64(input) {
  return window.atob(input);
}

export function formatJSON(input) {
  const obj = JSON.parse(input);
  return JSON.stringify(obj, null, 2);
}

export function minifyJSON(input) {
  const obj = JSON.parse(input);
  return JSON.stringify(obj);
}

export function minifyCSS(input) {
  const css = input?.replace(/^\uFEFF/, '') ?? '';

  if (!css.trim()) {
    return { css: '', stats: null, error: i18n.t('helpers.cssMinifier.pasteOrUpload') };
  }

  let output = '';
  let index = 0;
  let inString = false;
  let stringChar = '';
  let inComment = false;

  while (index < css.length) {
    const char = css[index];
    const next = css[index + 1];

    if (inComment) {
      if (char === '*' && next === '/') {
        inComment = false;
        index += 2;
        continue;
      }
      index += 1;
      continue;
    }

    if (inString) {
      output += char;
      if (char === '\\' && index + 1 < css.length) {
        output += css[index + 1];
        index += 2;
        continue;
      }
      if (char === stringChar) inString = false;
      index += 1;
      continue;
    }

    if (char === '/' && next === '*') {
      inComment = true;
      index += 2;
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      stringChar = char;
      output += char;
      index += 1;
      continue;
    }

    if (/\s/.test(char)) {
      if (output && !/\s$/.test(output)) {
        output += ' ';
      }
      index += 1;
      continue;
    }

    output += char;
    index += 1;
  }

  const minified = output
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*>\s*/g, '>')
    .replace(/\s*~\s*/g, '~')
    .replace(/\s*\+\s*/g, '+')
    .replace(/;}/g, '}')
    .trim();

  return {
    css: minified,
    stats: {
      originalSize: css.length,
      minifiedSize: minified.length,
      savedBytes: Math.max(0, css.length - minified.length),
      savedPercent: css.length ? Math.round(((css.length - minified.length) / css.length) * 100) : 0,
    },
    error: null,
  };
}

function cssSizeStats(original, formatted) {
  return {
    originalSize: original.length,
    minifiedSize: formatted.length,
    savedBytes: Math.max(0, original.length - formatted.length),
    savedPercent: original.length ? Math.round(((original.length - formatted.length) / original.length) * 100) : 0,
  };
}

export function beautifyCSS(input) {
  const css = input?.replace(/^\uFEFF/, '') ?? '';

  if (!css.trim()) {
    return { css: '', stats: null, error: i18n.t('helpers.cssMinifier.pasteOrUpload') };
  }

  let formatted = '';
  let indent = 0;
  const tab = '  ';
  let inString = false;
  let stringChar = '';
  let inComment = false;

  for (let index = 0; index < css.length; index += 1) {
    const char = css[index];
    const next = css[index + 1];

    if (inComment) {
      formatted += char;
      if (char === '*' && next === '/') {
        formatted += '/';
        inComment = false;
        index += 1;
      }
      continue;
    }

    if (inString) {
      formatted += char;
      if (char === '\\' && index + 1 < css.length) {
        formatted += css[index + 1];
        index += 1;
        continue;
      }
      if (char === stringChar) inString = false;
      continue;
    }

    if (char === '/' && next === '*') {
      formatted += '/*';
      inComment = true;
      index += 1;
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      stringChar = char;
      formatted += char;
      continue;
    }

    if (/\s/.test(char)) continue;

    if (char === '{') {
      formatted = `${formatted.trimEnd()} {\n${tab.repeat(indent + 1)}`;
      indent += 1;
      continue;
    }

    if (char === '}') {
      indent = Math.max(0, indent - 1);
      formatted = `${formatted.trimEnd()}\n${tab.repeat(indent)}}`;
      if (index + 1 < css.length && css[index + 1] !== '}') {
        formatted += `\n${tab.repeat(indent)}`;
      }
      continue;
    }

    if (char === ';') {
      formatted += `;\n${tab.repeat(indent)}`;
      continue;
    }

    if (char === ',') {
      formatted += `,\n${tab.repeat(indent)}`;
      continue;
    }

    formatted += char;
  }

  const beautified = formatted.replace(/\n{3,}/g, '\n\n').trim();

  return {
    css: beautified,
    stats: cssSizeStats(css, beautified),
    error: null,
  };
}

function minifyLikeSource(input, emptyMessage) {
  const source = input?.replace(/^\uFEFF/, '') ?? '';

  if (!source.trim()) {
    return { code: '', stats: null, error: emptyMessage };
  }

  let output = '';
  let index = 0;
  let inString = false;
  let stringChar = '';
  let inLineComment = false;
  let inBlockComment = false;

  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];

    if (inLineComment) {
      if (char === '\n') {
        inLineComment = false;
        output += ' ';
      }
      index += 1;
      continue;
    }

    if (inBlockComment) {
      if (char === '*' && next === '/') {
        inBlockComment = false;
        index += 2;
        continue;
      }
      index += 1;
      continue;
    }

    if (inString) {
      output += char;
      if (char === '\\' && index + 1 < source.length) {
        output += source[index + 1];
        index += 2;
        continue;
      }
      if (char === stringChar) inString = false;
      index += 1;
      continue;
    }

    if (char === '/' && next === '/') {
      inLineComment = true;
      index += 2;
      continue;
    }

    if (char === '/' && next === '*') {
      inBlockComment = true;
      index += 2;
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      output += char;
      index += 1;
      continue;
    }

    if (/\s/.test(char)) {
      if (output && !/\s$/.test(output)) {
        output += ' ';
      }
      index += 1;
      continue;
    }

    output += char;
    index += 1;
  }

  const minified = output
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    .replace(/\s+=\s+/g, '=')
    .replace(/;}/g, ';}')
    .trim();

  return {
    code: minified,
    stats: cssSizeStats(source, minified),
    error: null,
  };
}

export function minifyJS(input) {
  const result = minifyLikeSource(input, i18n.t('helpers.jsFormatter.pasteOrUpload'));
  return { js: result.code, stats: result.stats, error: result.error };
}

export function beautifyJS(input) {
  const js = input?.replace(/^\uFEFF/, '') ?? '';

  if (!js.trim()) {
    return { js: '', stats: null, error: i18n.t('helpers.jsFormatter.pasteOrUpload') };
  }

  let formatted = '';
  let indent = 0;
  const tab = '  ';
  let inString = false;
  let stringChar = '';
  let inLineComment = false;
  let inBlockComment = false;

  const appendNewline = () => {
    formatted = `${formatted.trimEnd()}\n${tab.repeat(indent)}`;
  };

  for (let index = 0; index < js.length; index += 1) {
    const char = js[index];
    const next = js[index + 1];

    if (inLineComment) {
      formatted += char;
      if (char === '\n') {
        inLineComment = false;
        appendNewline();
      }
      continue;
    }

    if (inBlockComment) {
      formatted += char;
      if (char === '*' && next === '/') {
        formatted += '/';
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (inString) {
      formatted += char;
      if (char === '\\' && index + 1 < js.length) {
        formatted += js[index + 1];
        index += 1;
        continue;
      }
      if (char === stringChar) inString = false;
      continue;
    }

    if (char === '/' && next === '/') {
      formatted += '//';
      inLineComment = true;
      index += 1;
      continue;
    }

    if (char === '/' && next === '*') {
      formatted += '/*';
      inBlockComment = true;
      index += 1;
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      formatted += char;
      continue;
    }

    if (/\s/.test(char)) continue;

    if (char === '{') {
      formatted = `${formatted.trimEnd()} {\n${tab.repeat(indent + 1)}`;
      indent += 1;
      continue;
    }

    if (char === '}') {
      indent = Math.max(0, indent - 1);
      formatted = `${formatted.trimEnd()}\n${tab.repeat(indent)}}`;
      if (next && next !== ';' && next !== ')' && next !== ',' && next !== '}') {
        formatted += `\n${tab.repeat(indent)}`;
      }
      continue;
    }

    if (char === ';') {
      formatted += ';';
      appendNewline();
      continue;
    }

    formatted += char;
  }

  const beautified = formatted.replace(/\n{3,}/g, '\n\n').trim();

  return {
    js: beautified,
    stats: cssSizeStats(js, beautified),
    error: null,
  };
}

export function validateJSON(input) {
  if (!input.trim()) return { valid: null, message: i18n.t('helpers.json.pasteToValidate') };
  try {
    JSON.parse(input);
    return { valid: true, message: i18n.t('helpers.json.validJson') };
  } catch (e) {
    return { valid: false, message: e.message };
  }
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function sanitizeXmlTagName(name) {
  const cleaned = String(name).replace(/[^a-zA-Z0-9_.-]/g, '_');
  return /^[a-zA-Z_]/.test(cleaned) ? cleaned : `_${cleaned}`;
}

function jsonValueToXml(value, tagName) {
  const tag = sanitizeXmlTagName(tagName);

  if (value === null || value === undefined) {
    return `<${tag} />`;
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => jsonValueToXml(item, `item${index + 1}`)).join('\n');
  }

  if (typeof value === 'object') {
    const children = Object.entries(value)
      .map(([key, item]) => jsonValueToXml(item, key))
      .join('\n');
    return `<${tag}>\n${children}\n</${tag}>`;
  }

  return `<${tag}>${escapeXml(value)}</${tag}>`;
}

export function jsonToXml(input) {
  const parsed = JSON.parse(input);
  const body = jsonValueToXml(parsed, 'root');
  return `<?xml version="1.0" encoding="UTF-8"?>\n${body}`;
}

export function jsonToYaml(input) {
  const parsed = JSON.parse(input);
  return yaml.dump(parsed, { indent: 2, lineWidth: -1, noRefs: true }).trim();
}

export function yamlToJson(input) {
  const parsed = yaml.load(input);
  return JSON.stringify(parsed, null, 2);
}

function parseXmlElement(element) {
  const childElements = Array.from(element.children);

  if (!childElements.length) {
    const text = element.textContent?.trim() ?? '';
    if (text === 'true') return true;
    if (text === 'false') return false;
    if (text !== '' && !Number.isNaN(Number(text)) && /^-?\d+(\.\d+)?$/.test(text)) {
      return Number(text);
    }
    return text;
  }

  const result = {};

  childElements.forEach((child) => {
    const key = child.tagName;
    const value = parseXmlElement(child);

    if (result[key] === undefined) {
      result[key] = value;
      return;
    }

    if (Array.isArray(result[key])) {
      result[key].push(value);
      return;
    }

    result[key] = [result[key], value];
  });

  return result;
}

export function xmlToJson(input) {
  const doc = new DOMParser().parseFromString(input.trim(), 'application/xml');

  if (doc.querySelector('parsererror')) {
    throw new Error(i18n.t('helpers.converters.invalidXml'));
  }

  const root = doc.documentElement;
  if (!root) {
    throw new Error(i18n.t('helpers.converters.invalidXml'));
  }

  const data = root.tagName.toLowerCase() === 'root' ? parseXmlElement(root) : { [root.tagName]: parseXmlElement(root) };
  return JSON.stringify(data, null, 2);
}

function toJavaScriptLiteral(value, depth = 0) {
  const indent = '  '.repeat(depth);
  const next = '  '.repeat(depth + 1);

  if (value === null) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'string') return JSON.stringify(value);

  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    return `[\n${value.map((item) => `${next}${toJavaScriptLiteral(item, depth + 1)}`).join(',\n')}\n${indent}]`;
  }

  return `{\n${Object.entries(value)
    .map(([key, item]) => {
      const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      return `${next}${safeKey}: ${toJavaScriptLiteral(item, depth + 1)}`;
    })
    .join(',\n')}\n${indent}}`;
}

export function jsonToJavaScriptObject(input, varName = 'data') {
  const parsed = JSON.parse(input);
  const literal = toJavaScriptLiteral(parsed, 1);
  return `const ${varName} = ${literal};\n\nexport default ${varName};`;
}

function stripJavaScriptWrapper(source) {
  let next = source.trim();

  next = next.replace(/^export\s+default\s+/m, '');
  next = next.replace(/^(?:module\s*\.\s*exports\s*=\s*|export\s+\{\s*default\s+as\s+\w+\s*\}\s+from\s+.+;?\s*)$/m, '');

  const assignmentMatch = next.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*/);
  if (assignmentMatch) {
    next = next.slice(assignmentMatch[0].length);
  }

  return next.replace(/;\s*$/, '').trim();
}

function parseJavaScriptLiteral(input) {
  const source = stripJavaScriptWrapper(input);

  try {
    return JSON.parse(source);
  } catch {
    const value = Function(`"use strict"; return (${source});`)();
    if (typeof value === 'undefined') {
      throw new Error(i18n.t('helpers.converters.invalidJsLiteral'));
    }
    return value;
  }
}

export function jsToJson(input) {
  const value = parseJavaScriptLiteral(input);
  return JSON.stringify(value, null, 2);
}

function decodePythonString(content, quote) {
  return content.replace(/\\(.)/g, (_, char) => {
    if (char === quote) return quote;
    if (char === 'n') return '\n';
    if (char === 'r') return '\r';
    if (char === 't') return '\t';
    if (char === '\\') return '\\';
    return char;
  });
}

function convertPythonQuotes(source) {
  return source.replace(/(['"])((?:\\.|(?!\1)[^\\])*)\1/g, (_, quote, content) =>
    JSON.stringify(decodePythonString(content, quote))
  );
}

function normalizePythonLiteral(input) {
  let source = input.trim();
  source = source.replace(/#.*$/gm, '');
  source = source.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');
  source = source.replace(/,(\s*[}\]])/g, '$1');
  return convertPythonQuotes(source);
}

export function pythonToJson(input) {
  const normalized = normalizePythonLiteral(input);

  try {
    return JSON.stringify(JSON.parse(normalized), null, 2);
  } catch {
    const value = Function(`"use strict"; return (${normalized});`)();
    return JSON.stringify(value, null, 2);
  }
}

function escapePythonString(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function toPythonLiteral(value, depth = 0) {
  const indent = '    '.repeat(depth);
  const next = '    '.repeat(depth + 1);

  if (value === null) return 'None';
  if (value === true) return 'True';
  if (value === false) return 'False';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return `'${escapePythonString(value)}'`;

  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    return `[\n${value.map((item) => `${next}${toPythonLiteral(item, depth + 1)}`).join(',\n')}\n${indent}]`;
  }

  const entries = Object.entries(value);
  if (!entries.length) return '{}';

  return `{\n${entries
    .map(([key, item]) => `${next}'${escapePythonString(key)}': ${toPythonLiteral(item, depth + 1)}`)
    .join(',\n')}\n${indent}}`;
}

export function jsonToPython(input) {
  const parsed = JSON.parse(input);
  return toPythonLiteral(parsed, 0);
}

export const JSON_HUB_SAMPLE_JSON = `{
  "product": "Widget",
  "price": 19.99,
  "inStock": true,
  "tags": ["sale", "new"]
}`;

export const JSON_HUB_SAMPLE_JS = `const data = {
  product: 'Widget',
  price: 19.99,
  inStock: true,
  tags: ['sale', 'new'],
};`;

export const JSON_HUB_SAMPLE_PYTHON = `{
    'product': 'Widget',
    'price': 19.99,
    'inStock': True,
    'tags': ['sale', 'new'],
}`;

export const JSON_HUB_SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<root>
<product>Widget</product>
<price>19.99</price>
<inStock>true</inStock>
<tags>sale</tags>
<tags>new</tags>
</root>`;

export const JSON_HUB_SAMPLE_YAML = `product: Widget
price: 19.99
inStock: true
tags:
  - sale
  - new`;

export const JSON_HUB_PAIRS = ['xml', 'yaml', 'javascript', 'python'];

export function getJsonHubConversion(pair, direction) {
  const modes = {
    'xml:json-to-target': { convert: jsonToXml, validate: validateJSON, sample: JSON_HUB_SAMPLE_JSON, accept: '.json,application/json' },
    'xml:target-to-json': { convert: xmlToJson, validate: validateXmlInput, sample: JSON_HUB_SAMPLE_XML, accept: '.xml,application/xml,text/xml' },
    'yaml:json-to-target': { convert: jsonToYaml, validate: validateJSON, sample: JSON_HUB_SAMPLE_JSON, accept: '.json,application/json' },
    'yaml:target-to-json': { convert: yamlToJson, validate: validateYamlInput, sample: JSON_HUB_SAMPLE_YAML, accept: '.yaml,.yml,text/yaml' },
    'javascript:json-to-target': { convert: jsonToJavaScriptObject, validate: validateJSON, sample: JSON_HUB_SAMPLE_JSON, accept: '.json,application/json' },
    'javascript:target-to-json': { convert: jsToJson, validate: validateJsLiteralInput, sample: JSON_HUB_SAMPLE_JS, accept: '.js,.mjs,.txt,text/javascript' },
    'python:json-to-target': { convert: jsonToPython, validate: validateJSON, sample: JSON_HUB_SAMPLE_JSON, accept: '.json,application/json' },
    'python:target-to-json': { convert: pythonToJson, validate: validatePythonLiteralInput, sample: JSON_HUB_SAMPLE_PYTHON, accept: '.py,.txt' },
  };

  return modes[`${pair}:${direction}`] ?? null;
}

export function bcdToDecimal(input) {
  const cleaned = input.trim().replace(/^0x/i, '').replace(/[\s,_-]/g, '');

  if (!cleaned) {
    throw new Error(i18n.t('helpers.converters.bcdEmpty'));
  }

  if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
    throw new Error(i18n.t('helpers.converters.bcdInvalidHex'));
  }

  if (cleaned.length % 2 !== 0) {
    throw new Error(i18n.t('helpers.converters.bcdOddLength'));
  }

  let result = '';

  for (let index = 0; index < cleaned.length; index += 2) {
    const byte = parseInt(cleaned.slice(index, index + 2), 16);
    const high = (byte >> 4) & 0x0f;
    const low = byte & 0x0f;

    if (high > 9 || low > 9) {
      throw new Error(i18n.t('helpers.converters.bcdInvalidDigit'));
    }

    result += String(high);
    result += String(low);
  }

  return result.replace(/^0+(?=\d)/, '') || '0';
}

export function validateBcdInput(input) {
  if (!input.trim()) {
    return { valid: null, message: i18n.t('helpers.converters.bcdPasteToConvert') };
  }

  try {
    bcdToDecimal(input);
    return { valid: true, message: i18n.t('helpers.converters.bcdValid') };
  } catch (error) {
    return { valid: false, message: error.message };
  }
}

export const NUMBER_BASE_FORMATS = ['binary', 'hex', 'octal', 'decimal', 'bcd'];

export const NUMBER_BASE_SAMPLES = {
  binary: '10101010',
  hex: '0xFF',
  octal: '0o377',
  decimal: '255',
  bcd: '12345678',
};

function cleanGroupedDigits(value) {
  return value.trim().replace(/[,_\s]/g, '');
}

export function decimalToBcd(decimalInput) {
  const digits = String(decimalInput).replace(/^0+(?=\d)/, '') || '0';

  if (!/^\d+$/.test(digits)) {
    throw new Error(i18n.t('helpers.converters.numberBaseInvalidDecimal'));
  }

  const padded = digits.length % 2 === 1 ? `0${digits}` : digits;
  let hex = '';

  for (let index = 0; index < padded.length; index += 2) {
    const high = Number(padded[index]);
    const low = Number(padded[index + 1]);
    hex += ((high << 4) | low).toString(16).padStart(2, '0');
  }

  return hex.toUpperCase();
}

export function parseNumberBaseInput(input, format) {
  const cleaned = cleanGroupedDigits(input);

  if (!cleaned) {
    throw new Error(i18n.t('helpers.converters.numberBaseEmpty'));
  }

  if (format === 'bcd') {
    return BigInt(bcdToDecimal(input));
  }

  if (format === 'binary') {
    const binary = cleaned.replace(/^0b/i, '');
    if (!/^[01]+$/.test(binary)) {
      throw new Error(i18n.t('helpers.converters.numberBaseInvalidBinary'));
    }
    return BigInt(`0b${binary}`);
  }

  if (format === 'hex') {
    const hex = cleaned.replace(/^0x/i, '');
    if (!/^[0-9a-fA-F]+$/.test(hex)) {
      throw new Error(i18n.t('helpers.converters.numberBaseInvalidHex'));
    }
    return BigInt(`0x${hex}`);
  }

  if (format === 'octal') {
    const octal = cleaned.replace(/^0o/i, '');
    if (!/^[0-7]+$/.test(octal)) {
      throw new Error(i18n.t('helpers.converters.numberBaseInvalidOctal'));
    }
    return BigInt(`0o${octal}`);
  }

  if (!/^\d+$/.test(cleaned)) {
    throw new Error(i18n.t('helpers.converters.numberBaseInvalidDecimal'));
  }

  return BigInt(cleaned);
}

export function formatNumberBase(value, format) {
  const bigintValue = typeof value === 'bigint' ? value : BigInt(value);

  if (format === 'binary') {
    return `0b${bigintValue.toString(2)}`;
  }

  if (format === 'hex') {
    return `0x${bigintValue.toString(16).toUpperCase()}`;
  }

  if (format === 'octal') {
    return `0o${bigintValue.toString(8)}`;
  }

  if (format === 'bcd') {
    return decimalToBcd(bigintValue.toString(10));
  }

  return bigintValue.toString(10);
}

export function convertNumberBase(input, sourceFormat) {
  const value = parseNumberBaseInput(input, sourceFormat);

  return NUMBER_BASE_FORMATS.reduce((results, format) => {
    results[format] = formatNumberBase(value, format);
    return results;
  }, {});
}

export function validateNumberBaseInput(input, format) {
  if (!input.trim()) {
    return { valid: null, message: i18n.t('helpers.converters.numberBasePasteToConvert') };
  }

  try {
    parseNumberBaseInput(input, format);
    return { valid: true, message: i18n.t('helpers.converters.numberBaseValid') };
  } catch (error) {
    return { valid: false, message: error.message };
  }
}

export function validateJsLiteralInput(input) {
  if (!input.trim()) {
    return { valid: null, message: i18n.t('helpers.converters.jsPasteToConvert') };
  }

  try {
    parseJavaScriptLiteral(input);
    return { valid: true, message: i18n.t('helpers.converters.jsValid') };
  } catch (error) {
    return { valid: false, message: error.message };
  }
}

export function validatePythonLiteralInput(input) {
  if (!input.trim()) {
    return { valid: null, message: i18n.t('helpers.converters.pythonPasteToConvert') };
  }

  try {
    pythonToJson(input);
    return { valid: true, message: i18n.t('helpers.converters.pythonValid') };
  } catch (error) {
    return { valid: false, message: error.message };
  }
}

export function validateXmlInput(input) {
  if (!input.trim()) {
    return { valid: null, message: i18n.t('helpers.converters.xmlPasteToConvert') };
  }

  try {
    xmlToJson(input);
    return { valid: true, message: i18n.t('helpers.converters.xmlValid') };
  } catch (error) {
    return { valid: false, message: error.message };
  }
}

export function validateYamlInput(input) {
  if (!input.trim()) {
    return { valid: null, message: i18n.t('helpers.converters.yamlPasteToConvert') };
  }

  try {
    yamlToJson(input);
    return { valid: true, message: i18n.t('helpers.converters.yamlValid') };
  } catch (error) {
    return { valid: false, message: error.message };
  }
}

export function timestampToDate(ts) {
  const normalized = normalizeTimestamp(ts);
  if (!normalized) return '';
  const date = new Date(normalized.ms);
  return `${date.toUTCString()} | ${date.toLocaleString()}`;
}

export function normalizeTimestamp(input) {
  const ts = Number(input);
  if (Number.isNaN(ts)) return null;

  const absTs = Math.abs(ts);
  const digitCount = String(Math.trunc(absTs)).length;

  if (digitCount >= 13 || absTs >= 1e12) {
    const ms = Math.trunc(ts);
    return { ms, seconds: Math.trunc(ms / 1000) };
  }

  const seconds = Math.trunc(ts);
  return { ms: seconds * 1000, seconds };
}

export function relativeTimeFromNow(date) {
  const now = Date.now();
  const diffSec = Math.round((date.getTime() - now) / 1000);
  const units = [
    { unit: 'year', seconds: 365 * 24 * 60 * 60 },
    { unit: 'month', seconds: 30 * 24 * 60 * 60 },
    { unit: 'week', seconds: 7 * 24 * 60 * 60 },
    { unit: 'day', seconds: 24 * 60 * 60 },
    { unit: 'hour', seconds: 60 * 60 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];

  for (const { unit, seconds } of units) {
    if (Math.abs(diffSec) >= seconds || unit === 'second') {
      const value = Math.round(diffSec / seconds);
      if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
        const locale = i18n.language?.startsWith('de') ? 'de' : 'en';
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
        return rtf.format(value, unit);
      }

      return value >= 0
        ? i18n.t('helpers.relativeTime.inUnit', { count: Math.abs(value), unit })
        : i18n.t('helpers.relativeTime.agoUnit', { count: Math.abs(value), unit });
    }
  }

  return '';
}

export function formatTimestampVariants(input) {
  const normalized = normalizeTimestamp(input);
  if (!normalized) return null;

  const date = new Date(normalized.ms);
  return {
    seconds: normalized.seconds,
    milliseconds: normalized.ms,
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    iso8601: date.toISOString(),
    relative: relativeTimeFromNow(date),
  };
}

export function dateToTimestamp(dateStr) {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

export function dateToTimestampMs(dateStr) {
  return new Date(dateStr).getTime();
}

const LOREM_SENTENCES = LOREM_TEXT.split(/(?<=[.!?])\s+/).filter(Boolean);
const LOREM_WORDS = LOREM_TEXT.replace(/[.!,?]/g, '').split(/\s+/).filter(Boolean);

export function generateLorem(options = {}) {
  const {
    unit = 'paragraphs',
    count = 3,
    startWithLorem = true,
    format = 'plain',
  } = options;

  const safeCount = Math.max(1, Number(count) || 1);

  if (unit === 'words') {
    const result = [];
    let wordIndex = startWithLorem ? 0 : secureRandomIndex(LOREM_WORDS.length);

    for (let i = 0; i < safeCount; i += 1) {
      result.push(LOREM_WORDS[wordIndex % LOREM_WORDS.length]);
      wordIndex += 1;
    }

    const text = result.join(' ');
    return format === 'html' ? `<p>${text}</p>` : text;
  }

  if (unit === 'sentences') {
    const result = [];

    for (let i = 0; i < safeCount; i += 1) {
      const sentenceIndex = startWithLorem
        ? i % LOREM_SENTENCES.length
        : (i + 1) % LOREM_SENTENCES.length;
      result.push(LOREM_SENTENCES[sentenceIndex]);
    }

    const text = result.join(' ');
    return format === 'html' ? `<p>${text}</p>` : text;
  }

  const paragraphs = [];
  const alternateText = LOREM_SENTENCES.slice(1).join(' ');

  for (let i = 0; i < safeCount; i += 1) {
    if (i === 0 && startWithLorem) {
      paragraphs.push(LOREM_TEXT);
    } else {
      paragraphs.push(alternateText);
    }
  }

  if (format === 'html') {
    return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('\n');
  }

  return paragraphs.join('\n\n').trim();
}

export async function hashText(text, algorithm = 'SHA-256') {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function encodeUrlComponent(input) {
  return encodeURIComponent(input);
}

export function decodeUrlComponent(input) {
  return decodeURIComponent(input);
}

export function encodeUrlFull(input) {
  return encodeURI(input);
}

export function decodeUrlFull(input) {
  return decodeURI(input);
}

function decodeBase64Url(part) {
  const padded = part.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  return JSON.parse(atob(padded + pad));
}

export function decodeJwt(token) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error(i18n.t('helpers.jwt.invalidSegments'));
  }
  return {
    header: decodeBase64Url(parts[0]),
    payload: decodeBase64Url(parts[1]),
    signature: parts[2],
  };
}

export function testRegex(pattern, flags, input) {
  const regex = new RegExp(pattern, flags);
  const matches = [...input.matchAll(regex)];
  return {
    matchCount: matches.length,
    matches: matches.slice(0, 20).map((m) => m[0]),
    error: null,
  };
}

export function safeTestRegex(pattern, flags, input) {
  try {
    if (!pattern) return { matchCount: 0, matches: [], error: i18n.t('helpers.regex.enterPattern') };
    return testRegex(pattern, flags, input);
  } catch (e) {
    return { matchCount: 0, matches: [], error: e.message };
  }
}

export function encodeHtmlEntities(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

export function decodeHtmlEntities(input) {
  const div = document.createElement('textarea');
  div.innerHTML = input;
  return div.value;
}

const CRON_FIELD_KEYS = ['minute', 'hour', 'dayMonth', 'month', 'dayWeek'];

function getCronFieldLabel(key) {
  return i18n.t(`helpers.cron.fields.${key}`);
}

function describeCronField(value, label) {
  const lowerLabel = label.toLowerCase();

  if (value === '*') return i18n.t('helpers.cron.fieldEvery', { label: lowerLabel });
  if (value.startsWith('*/')) {
    return i18n.t('helpers.cron.fieldEveryN', { value: value.slice(2), label: lowerLabel });
  }
  if (value.includes(',')) {
    return i18n.t('helpers.cron.fieldAtList', { label, value: value.replace(/,/g, ', ') });
  }
  if (value.includes('-')) {
    const [from, to] = value.split('-');
    return i18n.t('helpers.cron.fieldFromTo', { label, from, to });
  }
  return i18n.t('helpers.cron.fieldAt', { label, value });
}

export function clampChannel(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

export function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((channel) => clampChannel(channel).toString(16).padStart(2, '0'))
    .join('')}`;
}

export function hexToRgb(hex) {
  const normalized = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(normalized)) {
    throw new Error('Invalid hex color');
  }

  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

export function rgbToHsl(r, g, b) {
  const red = clampChannel(r) / 255;
  const green = clampChannel(g) / 255;
  const blue = clampChannel(b) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
  }

  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;

  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return {
    h: hue,
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

export function formatColorValues(r, g, b) {
  const hex = rgbToHex(r, g, b);
  const { h, s, l } = rgbToHsl(r, g, b);
  return {
    hex,
    rgb: `rgb(${clampChannel(r)}, ${clampChannel(g)}, ${clampChannel(b)})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
  };
}

function colorDistanceSq(a, b) {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

function samplePixelsFromImageData(imageData, width, height, maxSamples = 8000) {
  const { data } = imageData;
  const pixels = [];
  const total = width * height;
  const step = Math.max(1, Math.floor(total / maxSamples));

  for (let i = 0; i < total; i += step) {
    const index = i * 4;
    if (data[index + 3] < 125) continue;
    pixels.push([data[index], data[index + 1], data[index + 2]]);
  }

  return pixels;
}

export function extractPaletteFromImageData(imageData, width, height, colorCount = 6) {
  const pixels = samplePixelsFromImageData(imageData, width, height);
  if (!pixels.length) return [];

  const clusterCount = Math.min(Math.max(2, colorCount), pixels.length);
  const centroids = [];

  for (let i = 0; i < clusterCount; i += 1) {
    centroids.push([...pixels[Math.floor((i * pixels.length) / clusterCount)]]);
  }

  const assignments = new Array(pixels.length).fill(0);

  for (let iteration = 0; iteration < 24; iteration += 1) {
    let changed = false;

    for (let i = 0; i < pixels.length; i += 1) {
      let nearest = 0;
      let nearestDistance = Infinity;

      for (let cluster = 0; cluster < centroids.length; cluster += 1) {
        const distance = colorDistanceSq(pixels[i], centroids[cluster]);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = cluster;
        }
      }

      if (assignments[i] !== nearest) changed = true;
      assignments[i] = nearest;
    }

    const sums = centroids.map(() => [0, 0, 0, 0]);

    for (let i = 0; i < pixels.length; i += 1) {
      const cluster = assignments[i];
      sums[cluster][0] += pixels[i][0];
      sums[cluster][1] += pixels[i][1];
      sums[cluster][2] += pixels[i][2];
      sums[cluster][3] += 1;
    }

    for (let cluster = 0; cluster < centroids.length; cluster += 1) {
      if (sums[cluster][3] === 0) {
        centroids[cluster] = [...pixels[(cluster * 17) % pixels.length]];
        continue;
      }

      centroids[cluster] = [
        Math.round(sums[cluster][0] / sums[cluster][3]),
        Math.round(sums[cluster][1] / sums[cluster][3]),
        Math.round(sums[cluster][2] / sums[cluster][3]),
      ];
    }

    if (!changed) break;
  }

  const counts = new Array(clusterCount).fill(0);
  assignments.forEach((cluster) => {
    counts[cluster] += 1;
  });

  const ranked = centroids
    .map((centroid, index) => ({
      ...formatColorValues(centroid[0], centroid[1], centroid[2]),
      weight: counts[index],
    }))
    .filter((entry) => entry.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  const palette = [];

  for (const color of ranked) {
    if (palette.length >= colorCount) break;

    const rgb = hexToRgb(color.hex);
    const tooSimilar = palette.some((existing) => {
      const other = hexToRgb(existing.hex);
      return colorDistanceSq([rgb.r, rgb.g, rgb.b], [other.r, other.g, other.b]) < 900;
    });

    if (!tooSimilar) palette.push(color);
  }

  return palette;
}

export function extractPaletteFromImage(image, colorCount = 6) {
  const canvas = document.createElement('canvas');
  const maxSide = 220;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  return extractPaletteFromImageData(imageData, canvas.width, canvas.height, colorCount);
}

export function parseCronExpression(expression) {
  const trimmed = expression.trim();
  if (!trimmed) {
    return { valid: false, message: i18n.t('helpers.cron.enterExpression'), fields: [] };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length !== 5) {
    return {
      valid: false,
      message: i18n.t('helpers.cron.invalidFields'),
      fields: [],
    };
  }

  const fields = parts.map((value, index) => {
    const label = getCronFieldLabel(CRON_FIELD_KEYS[index]);
    return {
      name: label,
      value,
      description: describeCronField(value, label),
    };
  });

  const examples = {
    '*/5 * * * *': i18n.t('helpers.cron.every5Minutes'),
    '0 0 * * *': i18n.t('helpers.cron.dailyMidnight'),
    '0 9 * * 1-5': i18n.t('helpers.cron.weekdays9Am'),
    '0 0 1 * *': i18n.t('helpers.cron.monthlyFirst'),
  };

  return {
    valid: true,
    message: examples[trimmed] || i18n.t('helpers.cron.customSchedule'),
    fields,
    summary: fields.map((f) => f.description).join(' · '),
  };
}
