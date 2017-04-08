export const REGEX_PRESET_IDS = [
  'email',
  'url',
  'phoneUs',
  'ipv4',
  'dateIso',
  'integer',
  'decimal',
  'username',
  'slug',
  'hexColor',
];

export const REGEX_PRESETS = {
  email: {
    pattern: String.raw`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`,
    defaultFlags: { g: true, i: true, m: false },
    sampleText: 'Contact us at user@example.com or support@mail.co.uk today.',
  },
  url: {
    pattern: String.raw`https?:\/\/[^\s/$.?#].[^\s]*`,
    defaultFlags: { g: true, i: true, m: false },
    sampleText: 'Visit https://example.com/docs or http://test.org/page?q=1',
  },
  phoneUs: {
    pattern: String.raw`\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}`,
    defaultFlags: { g: true, i: false, m: false },
    sampleText: 'Call (555) 123-4567 or 555.987.6543 for help.',
  },
  ipv4: {
    pattern: String.raw`\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b`,
    defaultFlags: { g: true, i: false, m: false },
    sampleText: 'Servers: 192.168.0.1 and 10.0.0.255 are online.',
  },
  dateIso: {
    pattern: String.raw`\b\d{4}-\d{2}-\d{2}\b`,
    defaultFlags: { g: true, i: false, m: false },
    sampleText: 'Release on 2026-05-25 and patch on 2026-12-01.',
  },
  integer: {
    pattern: String.raw`-?\d+`,
    defaultFlags: { g: true, i: false, m: false },
    sampleText: 'Values: -12, 0, and 42 are integers.',
  },
  decimal: {
    pattern: String.raw`-?\d+(?:\.\d+)?`,
    defaultFlags: { g: true, i: false, m: false },
    sampleText: 'Pi is about 3.14 and temperature is -7.5',
  },
  username: {
    pattern: String.raw`^[a-zA-Z0-9_]{3,20}$`,
    defaultFlags: { g: false, i: false, m: false },
    sampleText: 'dev_user',
  },
  slug: {
    pattern: String.raw`\b[a-z0-9]+(?:-[a-z0-9]+)*\b`,
    defaultFlags: { g: true, i: true, m: false },
    sampleText: 'Paths: my-page-title and api-v2-release',
  },
  hexColor: {
    pattern: String.raw`#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b`,
    defaultFlags: { g: true, i: false, m: false },
    sampleText: 'Brand colors #7ab8f5 and #fff work well.',
  },
};

export const DEFAULT_REGEX_BUILDER_RULES = {
  matchType: 'anything',
  lengthType: 'any',
  lengthExact: 3,
  lengthMin: 3,
  lengthMax: 10,
  startsWith: '',
  endsWith: '',
  contains: '',
  wholeText: false,
  ignoreCase: false,
};

export function escapeRegexLiteral(value) {
  return String(value ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function clampLength(value, fallback = 1) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(999, Math.max(1, Math.floor(parsed)));
}

function getContentFragment(matchType) {
  switch (matchType) {
    case 'letters':
      return '[a-zA-Z]+';
    case 'numbers':
      return '\\d+';
    case 'alphanumeric':
      return '[a-zA-Z0-9]+';
    case 'spaces':
      return '\\s+';
    case 'wordChars':
      return '\\w+';
    case 'anything':
    default:
      return '.+';
  }
}

function applyLength(fragment, lengthType, rules) {
  if (lengthType === 'any') {
    return fragment;
  }

  const exact = clampLength(rules.lengthExact, 3);
  const min = clampLength(rules.lengthMin, 3);
  const max = clampLength(Math.max(rules.lengthMax, min), min);

  const quantified = fragment.replace(/\+$/, '');

  if (lengthType === 'exact') {
    return `${quantified}{${exact}}`;
  }

  if (lengthType === 'min') {
    return `${quantified}{${min},}`;
  }

  if (lengthType === 'max') {
    return `${quantified}{1,${max}}`;
  }

  if (lengthType === 'between') {
    return `${quantified}{${min},${max}}`;
  }

  return fragment;
}

export function buildPatternFromRules(rules = DEFAULT_REGEX_BUILDER_RULES) {
  const startsWith = String(rules.startsWith ?? '').trim();
  const endsWith = String(rules.endsWith ?? '').trim();
  const contains = String(rules.contains ?? '').trim();

  let core = getContentFragment(rules.matchType);
  core = applyLength(core, rules.lengthType, rules);

  if (contains) {
    core = `.*${escapeRegexLiteral(contains)}.*`;
  } else if (startsWith && endsWith) {
    core = `${escapeRegexLiteral(startsWith)}${core}${escapeRegexLiteral(endsWith)}`;
  } else if (startsWith) {
    core = `${escapeRegexLiteral(startsWith)}${core}`;
  } else if (endsWith) {
    core = `${core}${escapeRegexLiteral(endsWith)}`;
  }

  if (rules.wholeText) {
    return `^${core}$`;
  }

  return core;
}

export function describeRules(rules, t) {
  const parts = [t(`tools.ui.regexHelper.matchTypes.${rules.matchType}`)];

  if (rules.lengthType === 'exact') {
    parts.push(t('tools.ui.regexHelper.summary.lengthExact', { count: clampLength(rules.lengthExact, 3) }));
  } else if (rules.lengthType === 'min') {
    parts.push(t('tools.ui.regexHelper.summary.lengthMin', { count: clampLength(rules.lengthMin, 3) }));
  } else if (rules.lengthType === 'max') {
    parts.push(t('tools.ui.regexHelper.summary.lengthMax', { count: clampLength(rules.lengthMax, 10) }));
  } else if (rules.lengthType === 'between') {
    parts.push(
      t('tools.ui.regexHelper.summary.lengthBetween', {
        min: clampLength(rules.lengthMin, 3),
        max: clampLength(Math.max(rules.lengthMax, rules.lengthMin), 10),
      })
    );
  }

  if (rules.startsWith?.trim()) {
    parts.push(t('tools.ui.regexHelper.summary.startsWith', { value: rules.startsWith.trim() }));
  }

  if (rules.endsWith?.trim()) {
    parts.push(t('tools.ui.regexHelper.summary.endsWith', { value: rules.endsWith.trim() }));
  }

  if (rules.contains?.trim()) {
    parts.push(t('tools.ui.regexHelper.summary.contains', { value: rules.contains.trim() }));
  }

  if (rules.wholeText) {
    parts.push(t('tools.ui.regexHelper.summary.wholeText'));
  }

  if (rules.ignoreCase) {
    parts.push(t('tools.ui.regexHelper.summary.ignoreCase'));
  }

  return t('tools.ui.regexHelper.summary.prefix', { parts: parts.join(', ') });
}

export function getPresetById(presetId) {
  return REGEX_PRESETS[presetId] ?? null;
}

export function rulesToFlags(rules) {
  return {
    g: !rules.wholeText,
    i: Boolean(rules.ignoreCase),
    m: false,
  };
}
