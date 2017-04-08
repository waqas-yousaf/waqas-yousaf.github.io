export const LOCALES = ['en', 'de'];
export const DEFAULT_LOCALE = 'en';
export const LOCALE_LABELS = { en: 'EN', de: 'DE' };

export function getLocaleFromPath(pathname) {
  if (pathname === '/de' || pathname.startsWith('/de/')) return 'de';
  return 'en';
}

export function stripLocalePrefix(pathname) {
  if (pathname === '/de') return '/';
  if (pathname.startsWith('/de/')) return pathname.slice(3) || '/';
  return pathname;
}

export function localizePath(path, locale = DEFAULT_LOCALE) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'de') {
    return normalized === '/' ? '/de' : `/de${normalized}`;
  }
  return normalized;
}

export function switchLocalePath(pathname, newLocale) {
  return localizePath(stripLocalePrefix(pathname), newLocale);
}
