import { useTranslation } from 'react-i18next';
import PageSeo from '../components/seo/PageSeo';
import LegalPageLayout from '../components/layout/LegalPageLayout';
import { TERMS_PATH } from '../data/legal';
import { SITE_NAME, SITE_URL } from '../config/site';
import { useTermsSections } from '../hooks/useLocalizedContent';
import { useLocale } from '../i18n/useLocale';
import { localizePath } from '../i18n/paths';

function TermsPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const sections = useTermsSections();

  return (
    <>
      <PageSeo
        title={t('legal.terms.seoTitle', { siteName: SITE_NAME })}
        description={t('legal.terms.seoDescription', { siteName: SITE_NAME })}
        keywords={t('legal.terms.seoKeywords')}
        canonical={`${SITE_URL}${localizePath(TERMS_PATH, locale)}`}
        locale={locale}
      />
      <LegalPageLayout
        eyebrow={t('legal.eyebrow')}
        title={t('legal.terms.title')}
        intro={t('legal.terms.intro')}
        sections={sections}
      />
    </>
  );
}

export default TermsPage;
