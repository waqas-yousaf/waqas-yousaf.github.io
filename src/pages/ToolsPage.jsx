import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PageSeo from '../components/seo/PageSeo';
import MaterialIcon from '../components/common/MaterialIcon';
import LocaleLink from '../components/common/LocaleLink';
import ToolCard from '../components/tools/ToolCard';
import { SITE_NAME, SITE_URL } from '../config/site';
import { useTools, getToolsLandingSeo, WISHDD_TOOLS_URL } from '../data/tools';
import { useLocale } from '../i18n/useLocale';
import { localizePath } from '../i18n/paths';

function ToolsPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const tools = useTools();
  const toolsLandingSeo = getToolsLandingSeo(t, locale);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const highlights = [
    { icon: 'shield', label: t('tools.highlights.clientSide') },
    { icon: 'bolt', label: t('tools.highlights.instant') },
    { icon: 'lock', label: t('tools.highlights.private') },
    { icon: 'redeem', label: t('tools.highlights.free') },
  ];

  const toolsByCategory = useMemo(
    () =>
      tools.reduce((groups, tool) => {
        if (!groups[tool.category]) {
          groups[tool.category] = [];
        }
        groups[tool.category].push(tool);
        return groups;
      }, {}),
    [tools]
  );

  const categoryList = useMemo(() => Object.keys(toolsByCategory), [toolsByCategory]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredToolsByCategory = useMemo(() => {
    const matchesQuery = (tool) => {
      if (!normalizedQuery) return true;

      const haystack = [
        tool.longTitle,
        tool.title,
        tool.description,
        tool.seoDescription,
        tool.category,
        ...(tool.features || []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    };

    const entries = Object.entries(toolsByCategory)
      .map(([category, categoryTools]) => {
        const filtered = categoryTools.filter(matchesQuery);
        return [category, filtered];
      })
      .filter(([, categoryTools]) => categoryTools.length > 0);

    if (activeCategory === 'all') {
      return Object.fromEntries(entries);
    }

    return Object.fromEntries(entries.filter(([category]) => category === activeCategory));
  }, [toolsByCategory, normalizedQuery, activeCategory]);

  const visibleToolCount = useMemo(
    () => Object.values(filteredToolsByCategory).reduce((sum, categoryTools) => sum + categoryTools.length, 0),
    [filteredToolsByCategory]
  );

  const toolsLandingJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: t('tools.landing.heading'),
          description: toolsLandingSeo.description,
          url: toolsLandingSeo.canonical,
          isPartOf: {
            '@type': 'WebSite',
            name: SITE_NAME,
            url: SITE_URL,
          },
          hasPart: tools.map((tool) => ({
            '@type': 'WebApplication',
            name: tool.longTitle,
            url: tool.url,
            description: tool.seoDescription,
          })),
        },
        {
          '@type': 'WebApplication',
          name: 'Developer Tools Hub',
          url: toolsLandingSeo.canonical,
          description: toolsLandingSeo.description,
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
    [t, tools, toolsLandingSeo, locale]
  );

  const scrollToCategory = (categoryId) => {
    const element = document.getElementById(categoryId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);

    if (category !== 'all') {
      const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      scrollToCategory(`tools-category-${slug}`);
    }
  };

  return (
    <>
      <PageSeo
        title={toolsLandingSeo.title}
        description={toolsLandingSeo.description}
        keywords={toolsLandingSeo.keywords}
        canonical={toolsLandingSeo.canonical}
        jsonLd={toolsLandingJsonLd}
        locale={locale}
      />

      <main className="tools-landing page-top-offset">
        <section className="tools-landing-hero">
          <Container className="py-4 py-lg-5">
            <nav aria-label="Breadcrumb" className="tools-landing-breadcrumb mb-4">
              <LocaleLink to="/" className="tools-landing-back-link">
                <MaterialIcon name="arrow_back" />
                {t('tools.landing.backHome')}
              </LocaleLink>
            </nav>

            <div className="tools-landing-header text-center">
              <p className="tools-landing-eyebrow text-uppercase small fw-semibold mb-2">{t('tools.landing.eyebrow')}</p>
              <h1 className="display-5 fw-bold mb-3">
                {t('tools.landing.heading').replace(t('tools.landing.headingHighlight'), '').trim()}{' '}
                <span className="text-primary">{t('tools.landing.headingHighlight')}</span>
              </h1>
              <p className="tools-landing-intro mx-auto mb-4">{t('tools.landing.intro', { count: tools.length })}</p>

              <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                <Button href={WISHDD_TOOLS_URL} target="_blank" rel="noopener noreferrer" variant="primary" className="rounded-pill px-4">
                  <MaterialIcon name="open_in_new" className="me-2" />
                  {t('tools.landing.openOnWishdd')}
                </Button>
              </div>

              <div className="tools-landing-search-wrap mx-auto">
                <MaterialIcon name="search" className="tools-landing-search-icon" />
                <Form.Control
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t('tools.landing.searchPlaceholder')}
                  className="tools-landing-search"
                  aria-label={t('tools.landing.searchPlaceholder')}
                />
                {searchQuery ? (
                  <button
                    type="button"
                    className="tools-landing-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label={t('tools.landing.clearSearch')}
                  >
                    <MaterialIcon name="close" />
                  </button>
                ) : null}
              </div>

              <p className="tools-landing-result-count small text-secondary mb-0 mt-3">
                {t('tools.landing.showingCount', { count: visibleToolCount, total: tools.length })}
              </p>
            </div>

            <Row className="g-3 justify-content-center mt-4 mb-2">
              {highlights.map((item) => (
                <Col key={item.label} xs={6} md={3}>
                  <div className="tool-highlight tools-landing-highlight glass-card text-center py-3 px-2 h-100">
                    <MaterialIcon name={item.icon} className="text-primary fs-4 mb-2 d-block" />
                    <span className="small fw-semibold">{item.label}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <div className="tools-landing-grid pb-5">
          <Container>
            <div className="tools-landing-filters" role="toolbar" aria-label={t('tools.landing.filterByCategory')}>
              <button
                type="button"
                className={`tools-landing-category-chip${activeCategory === 'all' ? ' is-active' : ''}`}
                onClick={() => handleCategoryClick('all')}
              >
                {t('tools.landing.allCategories')}
                <span className="tools-landing-category-count">{tools.length}</span>
              </button>
              {categoryList.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`tools-landing-category-chip${activeCategory === category ? ' is-active' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                  <span className="tools-landing-category-count">{toolsByCategory[category].length}</span>
                </button>
              ))}
            </div>

            {visibleToolCount === 0 ? (
              <div className="tools-landing-empty glass-card text-center py-5 px-4">
                <MaterialIcon name="search_off" className="text-primary fs-1 mb-3 d-block" />
                <h2 className="h5 fw-bold mb-2">{t('tools.landing.searchEmptyTitle')}</h2>
                <p className="small text-secondary mb-0">{t('tools.landing.searchEmpty')}</p>
              </div>
            ) : (
              Object.entries(filteredToolsByCategory).map(([category, categoryTools]) => {
                const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                return (
                  <section
                    key={category}
                    id={`tools-category-${categorySlug}`}
                    className="tools-landing-category mb-5"
                    aria-labelledby={`tools-category-heading-${categorySlug}`}
                  >
                    <div className="tools-landing-category-header mb-4">
                      <div>
                        <h2 id={`tools-category-heading-${categorySlug}`} className="h4 fw-bold mb-1">
                          {category}
                        </h2>
                        <p className="small text-secondary mb-0">
                          {t('tools.toolCount', { count: categoryTools.length })}
                        </p>
                      </div>
                      <span className="tools-landing-category-index" aria-hidden="true">
                        <MaterialIcon name="folder_open" />
                      </span>
                    </div>
                    <Row className="g-4">
                      {categoryTools.map((tool) => (
                        <ToolCard
                          key={tool.id}
                          tool={tool}
                          variant="landing"
                          colProps={{ xs: 12, md: 6, xl: 4 }}
                        />
                      ))}
                    </Row>
                  </section>
                );
              })
            )}
          </Container>
        </div>
      </main>
    </>
  );
}

export default ToolsPage;
