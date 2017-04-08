import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SITE_URL, SITE_NAME, OG_IMAGE } from '../config/site.js';
import { localizePath } from '../i18n/paths.js';

export { SITE_URL };

export const TOOLS_PATH = '/tools';

export const toolDefinitions = [
  { id: 'image-color-studio', categoryKey: 'design', path: '/tools/ayzo', icon: 'palette' },
  { id: 'html-cleaner', categoryKey: 'design', path: '/tools/html-cleaner', icon: 'cleaning_services' },
  { id: 'password', categoryKey: 'security', path: '/tools/fizzy', icon: 'lock' },
  { id: 'laravel-key', categoryKey: 'security', path: '/tools/app-key-generator', icon: 'vpn_key' },
  { id: 'jwt-decoder', categoryKey: 'json', path: '/tools/jwt-token-decoder', icon: 'key' },
  { id: 'json', categoryKey: 'json', path: '/tools/json-beautifier-minifier', icon: 'data_object' },
  { id: 'json-converter', categoryKey: 'json', path: '/tools/json-converter', icon: 'swap_horiz' },
  { id: 'bcd-to-decimal', categoryKey: 'misc', path: '/tools/bcd-to-decimal-converter', icon: 'pin' },
  { id: 'css-minifier', categoryKey: 'misc', path: '/tools/css-minifier-beautifier', icon: 'compress' },
  { id: 'js-formatter', categoryKey: 'misc', path: '/tools/javascript-minifier-beautifier', icon: 'javascript' },
  { id: 'browser-info', categoryKey: 'misc', path: '/tools/my-browser-info', icon: 'devices' },
  { id: 'slug', categoryKey: 'text', path: '/tools/url-slug-generator', icon: 'link' },
  { id: 'lorem', categoryKey: 'text', path: '/tools/lorem-ipsum-generator', icon: 'subject' },
  { id: 'markdown-export', categoryKey: 'text', path: '/tools/markdown-to-docx-pdf', icon: 'description' },
  { id: 'base64', categoryKey: 'encoding', path: '/tools/base64-encoder-decoder', icon: 'code' },
  { id: 'url-encode', categoryKey: 'encoding', path: '/tools/url-encoder-decoder', icon: 'language' },
  { id: 'regex', categoryKey: 'devops', path: '/tools/regex-tester', icon: 'functions' },
  {id: 'html-entities', categoryKey: 'encoding', path: '/tools/html-entity-encoder-decoder', icon: 'web' },
  { id: 'cron', categoryKey: 'devops', path: '/tools/cron-expression-parser', icon: 'event_available' },
  { id: 'timestamp', categoryKey: 'devops', path: '/tools/unix-timestamp-converter', icon: 'schedule' },
];

export function buildTools(t) {
  return toolDefinitions.map((def) => ({
    ...def,
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

export function useTool(toolId) {
  const tools = useTools();
  return useMemo(() => tools.find((tool) => tool.id === toolId) ?? null, [tools, toolId]);
}

export const toolMap = Object.fromEntries(toolDefinitions.map((t) => [t.id, t]));

export const legacyToolRedirects = {
  ...Object.fromEntries(
    toolDefinitions
      .filter((tool) => `${TOOLS_PATH}/${tool.id}` !== tool.path)
      .map((tool) => [`${TOOLS_PATH}/${tool.id}`, tool.path])
  ),
  '/tools/laravel-app-key-generator': '/tools/app-key-generator',
  [`${TOOLS_PATH}/uuid-hash`]: '/tools/app-key-generator',
  '/tools/uuid-and-hash-generator': '/tools/app-key-generator',
  [`${TOOLS_PATH}/uuid-v4-generator`]: '/tools/app-key-generator',
  [`${TOOLS_PATH}/sha-hash-generator`]: '/tools/base64-encoder-decoder',
  [`${TOOLS_PATH}/hash`]: '/tools/base64-encoder-decoder',
  [`${TOOLS_PATH}/uuid`]: '/tools/app-key-generator',
  '/tools/image-to-color-picker': '/tools/ayzo',
  '/tools/image-to-palette-generator': '/tools/ayzo',
  [`${TOOLS_PATH}/color-picker`]: '/tools/ayzo',
  [`${TOOLS_PATH}/palette-generator`]: '/tools/ayzo',
  [`${TOOLS_PATH}/json-formatter-validator`]: '/tools/json-beautifier-minifier',
  [`${TOOLS_PATH}/css-minifier`]: '/tools/css-minifier-beautifier',
  '/tools/json-to-xml-converter': '/tools/json-converter',
  '/tools/json-to-yaml-converter': '/tools/json-converter',
  '/tools/json-to-javascript-object-converter': '/tools/json-converter',
  '/tools/javascript-to-json-converter': '/tools/json-converter',
  '/tools/python-to-json-converter': '/tools/json-converter',
};

export function getToolByRouteParam(routeParam) {
  if (!routeParam) return null;

  const byId = toolMap[routeParam];
  if (byId) {
    return byId;
  }

  return toolDefinitions.find((tool) => tool.path === `${TOOLS_PATH}/${routeParam}`) ?? null;
}

export function getLocalizedTool(routeParam, t) {
  const base = getToolByRouteParam(routeParam);
  if (!base) return null;
  return buildTools(t).find((tool) => tool.id === base.id) ?? null;
}

export function getToolsLandingSeo(t, locale) {
  return {
    title: t('tools.landing.seoTitle', { siteName: SITE_NAME }),
    description: t('tools.landing.seoDescription'),
    keywords: t('tools.landing.seoKeywords'),
    canonical: `${SITE_URL}${localizePath(TOOLS_PATH, locale)}`,
  };
}

export function getToolSeo(tool, t, locale) {
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    keywords: tool.seoKeywords || `${tool.longTitle}, ${tool.category}, ${SITE_NAME}`,
    canonical: `${SITE_URL}${localizePath(tool.path, locale)}`,
    ogType: 'website',
    ogImage: OG_IMAGE,
  };
}

function buildBreadcrumbJsonLd(tool, t, locale) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('tools.seo.breadcrumbHome'),
        item: `${SITE_URL}${localizePath('/', locale)}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('tools.seo.breadcrumbTools'),
        item: `${SITE_URL}${localizePath(TOOLS_PATH, locale)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.longTitle,
        item: `${SITE_URL}${localizePath(tool.path, locale)}`,
      },
    ],
  };
}

function buildToolFaqJsonLd(tool, t) {
  return {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t('tools.seo.faqFree', { longTitle: tool.longTitle }),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('tools.seo.faqFreeAnswer', { longTitle: tool.longTitle, siteName: SITE_NAME }),
        },
      },
      {
        '@type': 'Question',
        name: t('tools.seo.faqSafe', { longTitle: tool.longTitle }),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('tools.seo.faqSafeAnswer'),
        },
      },
    ],
  };
}

export function buildToolJsonLd(tool, t, locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool.longTitle,
        url: `${SITE_URL}${localizePath(tool.path, locale)}`,
        description: tool.seoDescription,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        featureList: tool.features,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@type': 'Person',
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      buildBreadcrumbJsonLd(tool, t, locale),
      buildToolFaqJsonLd(tool, t),
    ],
  };
}
