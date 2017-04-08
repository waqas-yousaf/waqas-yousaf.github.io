import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocaleFromPath } from './paths';

function LocaleLayout({ locale: forcedLocale }) {
  const location = useLocation();
  const { i18n } = useTranslation();
  const locale = forcedLocale || getLocaleFromPath(location.pathname);

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
    document.documentElement.lang = locale;
  }, [locale, i18n, location.pathname]);

  return <Outlet context={{ locale }} />;
}

export default LocaleLayout;
