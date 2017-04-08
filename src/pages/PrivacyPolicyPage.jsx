import { useTranslation } from 'react-i18next';
import PageSeo from '../components/seo/PageSeo';
import LegalPageLayout from '../components/layout/LegalPageLayout';
import { PRIVACY_PATH } from '../data/legal';
import { SITE_NAME, SITE_URL } from '../config/site';
import { usePrivacySections } from '../hooks/useLocalizedContent';
import { useLocale } from '../i18n/useLocale';
import { localizePath } from '../i18n/paths';

function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const sections = usePrivacySections();

  return (
    <>
      <PageSeo
        title={t('legal.privacy.seoTitle', { siteName: SITE_NAME })}
        description={t('legal.privacy.seoDescription', { siteName: SITE_NAME })}
        keywords={t('legal.privacy.seoKeywords')}
        canonical={`${SITE_URL}${localizePath(PRIVACY_PATH, locale)}`}
        locale={locale}
      />
      <LegalPageLayout
        eyebrow={t('legal.eyebrow')}
        title={t('legal.privacy.title')}
        intro={t('legal.privacy.intro')}
        sections={sections}
      />
    </>
  );
}

export default PrivacyPolicyPage;
