import { useEffect } from 'react';
import { OG_IMAGE, SITE_NAME, TWITTER_HANDLE } from '../../config/site';

const OG_LOCALE_MAP = { en: 'en_US', de: 'de_DE' };

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export default function PageSeo({
  title,
  description,
  keywords,
  canonical,
  jsonLd,
  ogImage = OG_IMAGE,
  ogType = 'website',
  robots = 'index, follow, max-image-preview:large',
  locale = 'en',
}) {
  const ogLocale = OG_LOCALE_MAP[locale] || OG_LOCALE_MAP.en;

  useEffect(() => {
    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords);
    upsertMeta('name', 'robots', robots);
    upsertMeta('name', 'author', SITE_NAME);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', ogLocale);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:image:alt', `${SITE_NAME} developer tools and portfolio`);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);
    upsertMeta('name', 'twitter:creator', TWITTER_HANDLE);

    if (canonical) {
      upsertLink('canonical', canonical);
      upsertMeta('property', 'og:url', canonical);
    }

    upsertJsonLd('page-json-ld', jsonLd);

    return () => {
      upsertJsonLd('page-json-ld', null);
    };
  }, [title, description, keywords, canonical, jsonLd, ogImage, ogType, robots, ogLocale]);

  return null;
}
