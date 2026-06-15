import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SITE_URL, SITE_NAME } from '../config/site.js';
import { localizePath } from '../i18n/paths.js';

export { SITE_URL };

export const TOOLS_PATH = '/tools';
export const WISHDD_TOOLS_URL = 'https://wishdd.com/tools';

export const toolDefinitions = [
  { id: 'image-color-studio', categoryKey: 'design', slug: 'ayzo', icon: 'palette' },
  { id: 'html-cleaner', categoryKey: 'design', slug: 'html-cleaner', icon: 'cleaning_services' },
  { id: 'password', categoryKey: 'security', slug: 'fizzy', icon: 'lock' },
  { id: 'laravel-key', categoryKey: 'security', slug: 'app-key-generator', icon: 'vpn_key' },
  { id: 'jwt-decoder', categoryKey: 'json', slug: 'jwt-token-decoder', icon: 'key' },
  { id: 'json', categoryKey: 'json', slug: 'json-beautifier-minifier', icon: 'data_object' },
  { id: 'json-converter', categoryKey: 'json', slug: 'json-converter', icon: 'swap_horiz' },
  { id: 'bcd-to-decimal', categoryKey: 'misc', slug: 'bcd-to-decimal-converter', icon: 'pin' },
  { id: 'css-minifier', categoryKey: 'misc', slug: 'css-minifier-beautifier', icon: 'compress' },
  { id: 'js-formatter', categoryKey: 'misc', slug: 'javascript-minifier-beautifier', icon: 'javascript' },
  { id: 'browser-info', categoryKey: 'misc', slug: 'my-browser-info', icon: 'devices' },
  { id: 'slug', categoryKey: 'text', slug: 'url-slug-generator', icon: 'link' },
  { id: 'lorem', categoryKey: 'text', slug: 'lorem-ipsum-generator', icon: 'subject' },
  { id: 'markdown-export', categoryKey: 'text', slug: 'hadi', icon: 'description' },
  { id: 'base64', categoryKey: 'encoding', slug: 'base64-encoder-decoder', icon: 'code' },
  { id: 'url-encode', categoryKey: 'encoding', slug: 'url-encoder-decoder', icon: 'language' },
  { id: 'regex', categoryKey: 'devops', slug: 'regex-tester', icon: 'functions' },
  { id: 'html-entities', categoryKey: 'encoding', slug: 'html-entity-encoder-decoder', icon: 'web' },
  { id: 'cron', categoryKey: 'devops', slug: 'cron-expression-parser', icon: 'event_available' },
  { id: 'timestamp', categoryKey: 'devops', slug: 'unix-timestamp-converter', icon: 'schedule' },
];

export const toolMap = Object.fromEntries(toolDefinitions.map((tool) => [tool.id, tool]));
export const toolSlugMap = Object.fromEntries(toolDefinitions.map((tool) => [tool.slug, tool]));

export function getWishddToolUrl(slug) {
  return `${WISHDD_TOOLS_URL}/${slug}`;
}

export const legacyToolPathToSlug = {
  ...Object.fromEntries(
    toolDefinitions
      .filter((tool) => tool.id !== tool.slug)
      .map((tool) => [`${TOOLS_PATH}/${tool.id}`, tool.slug])
  ),
  '/tools/laravel-app-key-generator': 'app-key-generator',
  [`${TOOLS_PATH}/uuid-hash`]: 'app-key-generator',
  '/tools/uuid-and-hash-generator': 'app-key-generator',
  [`${TOOLS_PATH}/uuid-v4-generator`]: 'app-key-generator',
  [`${TOOLS_PATH}/sha-hash-generator`]: 'base64-encoder-decoder',
  [`${TOOLS_PATH}/hash`]: 'base64-encoder-decoder',
  [`${TOOLS_PATH}/uuid`]: 'app-key-generator',
  '/tools/image-to-color-picker': 'ayzo',
  '/tools/image-to-palette-generator': 'ayzo',
  [`${TOOLS_PATH}/color-picker`]: 'ayzo',
  [`${TOOLS_PATH}/palette-generator`]: 'ayzo',
  [`${TOOLS_PATH}/json-formatter-validator`]: 'json-beautifier-minifier',
  '/tools/css-minifier': 'css-minifier-beautifier',
  '/tools/json-to-xml-converter': 'json-converter',
  '/tools/json-to-yaml-converter': 'json-converter',
  '/tools/json-to-javascript-object-converter': 'json-converter',
  '/tools/javascript-to-json-converter': 'json-converter',
  '/tools/python-to-json-converter': 'json-converter',
  '/tools/markdown-to-docx-pdf': 'hadi',
  '/tools/random-password-generator': 'fizzy',
  '/tools/ayzal-studio': 'ayzo',
};

export function getWishddUrlForPath(pathname) {
  const normalized = pathname.replace(/^\/de(?=\/|$)/, '') || '/';

  if (legacyToolPathToSlug[normalized]) {
    return getWishddToolUrl(legacyToolPathToSlug[normalized]);
  }

  const match = normalized.match(/^\/tools\/([^/]+)/);
  if (!match) {
    return WISHDD_TOOLS_URL;
  }

  const segment = match[1];
  if (toolSlugMap[segment]) {
    return getWishddToolUrl(segment);
  }

  if (toolMap[segment]) {
    return getWishddToolUrl(toolMap[segment].slug);
  }

  return WISHDD_TOOLS_URL;
}

export function buildTools(t) {
  return toolDefinitions.map((def) => ({
    ...def,
    url: getWishddToolUrl(def.slug),
    category: t(`tools.categories.${def.categoryKey}`),
    title: t(`tools.items.${def.id}.title`),
    longTitle: t(`tools.items.${def.id}.longTitle`),
    description: t(`tools.items.${def.id}.description`),
    seoTitle: t(`tools.items.${def.id}.seoTitle`),
    seoDescription: t(`tools.items.${def.id}.seoDescription`),
    seoKeywords: t(`tools.items.${def.id}.seoKeywords`, { defaultValue: '' }),
    features: t(`tools.items.${def.id}.features`, { returnObjects: true }),
  }));
}

export function useTools() {
  const { t, i18n } = useTranslation();
  return useMemo(() => buildTools(t), [t, i18n.language]);
}

export function getToolsLandingSeo(t, locale) {
  return {
    title: t('tools.landing.seoTitle', { siteName: SITE_NAME }),
    description: t('tools.landing.seoDescription'),
    keywords: t('tools.landing.seoKeywords'),
    canonical: `${SITE_URL}${localizePath(TOOLS_PATH, locale)}`,
  };
}
