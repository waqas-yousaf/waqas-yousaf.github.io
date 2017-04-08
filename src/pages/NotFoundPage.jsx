import { useTranslation } from 'react-i18next';
import PageSeo from '../components/seo/PageSeo';
import LocaleLink from '../components/common/LocaleLink';
import { SITE_NAME, SITE_URL } from '../config/site';
import { useLocale } from '../i18n/useLocale';
import { localizePath } from '../i18n/paths';

function NotFoundPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();

  return (
    <>
      <PageSeo
        title={t('notFound.seoTitle', { siteName: SITE_NAME })}
        description={t('notFound.seoDescription')}
        canonical={`${SITE_URL}${localizePath('/', locale)}`}
        robots="noindex, follow"
        locale={locale}
      />
      <main className="not-found-page page-top-offset px-3">
        <div className="text-center">
          <h1 className="display-4 fw-bold mb-3">{t('notFound.title')}</h1>
          <p className="lead mb-4">{t('notFound.message')}</p>
          <LocaleLink to="/" className="btn btn-primary rounded-pill px-4">
            {t('notFound.backHome')}
          </LocaleLink>
        </div>
      </main>
    </>
  );
}

export default NotFoundPage;
