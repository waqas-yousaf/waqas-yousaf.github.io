import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageSeo from '../components/seo/PageSeo';
import MaterialIcon from '../components/common/MaterialIcon';
import LocaleLink from '../components/common/LocaleLink';
import Projects from '../components/sections/Projects';
import { SITE_NAME, SITE_URL } from '../config/site';
import { PORTFOLIO_PATH } from '../data/portfolio';
import { useProjects } from '../hooks/useLocalizedContent';
import { useLocale } from '../i18n/useLocale';
import { localizePath } from '../i18n/paths';

function PortfolioPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const projects = useProjects();
  const description = t('portfolio.seoDescription', { name: SITE_NAME });
  const canonical = `${SITE_URL}${localizePath(PORTFOLIO_PATH, locale)}`;

  const portfolioJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Portfolio — ${SITE_NAME}`,
      description,
      url: canonical,
      hasPart: projects.map((project) => ({
        '@type': 'CreativeWork',
        name: project.title,
        description: project.description,
        url: project.url || canonical,
      })),
    }),
    [projects, description, canonical]
  );

  return (
    <>
      <PageSeo
        title={t('portfolio.seoTitle', { name: SITE_NAME })}
        description={description}
        keywords={t('portfolio.seoKeywords')}
        canonical={canonical}
        jsonLd={portfolioJsonLd}
        locale={locale}
      />

      <main className="portfolio-page page-top-offset">
        <div className="container-fluid px-3 px-md-5 py-4">
          <nav aria-label="Breadcrumb" className="portfolio-breadcrumb mb-4">
            <LocaleLink to="/" className="portfolio-back-link">
              <MaterialIcon name="arrow_back" />
              {t('portfolio.backHome')}
            </LocaleLink>
          </nav>

          <div className="portfolio-header text-center mb-2">
            <p className="portfolio-eyebrow text-uppercase small fw-semibold mb-2">{t('portfolio.eyebrow')}</p>
            <h1 className="display-6 fw-bold mb-3">
              {t('portfolio.heading').replace(t('portfolio.headingHighlight'), '').trim()}{' '}
              <span className="text-primary">{t('portfolio.headingHighlight')}</span>
            </h1>
            <p className="portfolio-intro mx-auto mb-0">{t('portfolio.intro')}</p>
          </div>
        </div>

        <Projects showHeading={false} />
      </main>
    </>
  );
}

export default PortfolioPage;
