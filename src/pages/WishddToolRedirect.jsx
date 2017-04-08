import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getWishddUrlForPath } from '../data/tools';

function WishddToolRedirect() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    window.location.replace(getWishddUrlForPath(pathname));
  }, [pathname]);

  return (
    <main className="page-top-offset py-5 text-center">
      <p className="text-secondary mb-0">{t('tools.redirect.message')}</p>
    </main>
  );
}

export default WishddToolRedirect;
