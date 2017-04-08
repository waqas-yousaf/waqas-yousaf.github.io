import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getLocaleFromPath, localizePath } from './paths';

export function useLocale() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const localizedPath = useCallback((path) => localizePath(path, locale), [locale]);
  return { locale, localizedPath };
}

export function useLocalizedPath() {
  return useLocale().localizedPath;
}
