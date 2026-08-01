import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import PageSeo from '../components/seo/PageSeo';
import Hero from '../components/sections/Hero';
import GitHubContributions from '../components/sections/GitHubContributions';
import CompaniesCarousel from '../components/sections/CompaniesCarousel';
import ToolsPreview from '../components/sections/ToolsPreview';
import { SITE_URL, useTools, TOOLS_PATH } from '../data/tools';
import { useLocale } from '../i18n/useLocale';
import { localizePath } from '../i18n/paths';
import { SITE_NAME } from '../config/site';

function HomePage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { locale } = useLocale();
  const tools = useTools();

  const homeJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          name: SITE_NAME,
          jobTitle: t('site.tagline'),
          url: SITE_URL,
          sameAs: ['https://github.com/waqas-yousaf', 'https://linkedin.com/in/waqasbiz', 'https://x.com/imakewebapps'],
          knowsAbout: ['PHP', 'Laravel', 'DevOps', 'Cloud Computing', 'Web Development'],
        },
        {
          '@type': 'WebApplication',
          name: 'Developer Tools Hub',
          url: `${SITE_URL}${localizePath(TOOLS_PATH, locale)}`,
          description: t('tools.landing.seoDescription'),
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          hasPart: tools.map((tool) => ({
            '@type': 'WebApplication',
            name: tool.longTitle,
            url: tool.url,
            description: tool.seoDescription,
          })),
        },
      ],
    }),
    [t, locale, tools]
  );

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  return (
    <>
      <PageSeo
        title={t('home.seoTitle')}
        description={t('home.seoDescription')}
        keywords={t('home.seoKeywords')}
        canonical={`${SITE_URL}${localizePath('/', locale)}`}
        jsonLd={homeJsonLd}
        locale={locale}
      />
      <Hero />
      <GitHubContributions />
      <ToolsPreview />
      <CompaniesCarousel />
    </>
  );
}

export default HomePage;
