import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocaleFromPath, switchLocalePath, LOCALE_LABELS, LOCALES } from '../../i18n/paths';

function LanguageSwitcher({ className = '' }) {
  const { t } = useTranslation();
  const location = useLocation();
  const currentLocale = getLocaleFromPath(location.pathname);

  return (
    <div className={`language-switcher ${className}`.trim()} role="group" aria-label={t('nav.language')}>
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          to={switchLocalePath(location.pathname, locale)}
          className={`language-switcher-btn${currentLocale === locale ? ' active' : ''}`}
          aria-current={currentLocale === locale ? 'true' : undefined}
        >
          {LOCALE_LABELS[locale]}
        </Link>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
