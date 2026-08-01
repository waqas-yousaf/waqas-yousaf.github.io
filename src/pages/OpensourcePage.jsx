import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import PageSeo from '../components/seo/PageSeo';
import MaterialIcon from '../components/common/MaterialIcon';
import LocaleLink from '../components/common/LocaleLink';
import { usePackages } from '../hooks/useLocalizedContent';
import { useLocale } from '../i18n/useLocale';
import { localizePath } from '../i18n/paths';
import { SITE_NAME, SITE_URL } from '../config/site';
import { OPENSOURCE_PATH } from '../data/packages';

const defaultStats = {
  dullahan: { stars: 12, downloads: 850 },
  'laravel-config-doctor': { stars: 8, downloads: 320 },
  inkstack: { stars: 15, downloads: 140 },
};

function OpensourcePage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const packages = usePackages();
  const [copiedId, setCopiedId] = useState(null);

  // Stats and Filters State
  const [stats, setStats] = useState(defaultStats);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const description = t('packages.seoDescription', { name: SITE_NAME });
  const canonical = `${SITE_URL}${localizePath(OPENSOURCE_PATH, locale)}`;

  const packagesJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Open Source Packages — ${SITE_NAME}`,
      description,
      url: canonical,
      hasPart: packages.map((pkg) => ({
        '@type': 'SoftwareApplication',
        name: pkg.title,
        description: pkg.description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        downloadUrl: pkg.githubUrl,
      })),
    }),
    [packages, description, canonical]
  );

  // Live stats fetching with fallback support
  useEffect(() => {
    packages.forEach(async (pkg) => {
      // 1. Fetch GitHub Stars & Forks
      try {
        const githubRes = await fetch(`https://api.github.com/repos/${pkg.name}`);
        if (githubRes.ok) {
          const githubData = await githubRes.json();
          setStats((prev) => ({
            ...prev,
            [pkg.id]: {
              ...prev[pkg.id],
              stars: githubData.stargazers_count !== undefined ? githubData.stargazers_count : prev[pkg.id].stars,
              forks: githubData.forks_count !== undefined ? githubData.forks_count : prev[pkg.id].forks,
            },
          }));
        }
      } catch (e) {
        console.warn(`Failed to fetch GitHub stats for ${pkg.id}`, e);
      }

      // 2. Fetch Downloads
      try {
        if (pkg.composerPackage) {
          const composerRes = await fetch(`https://packagist.org/packages/${pkg.composerPackage}.json`);
          if (composerRes.ok) {
            const composerData = await composerRes.json();
            const totalDownloads = composerData.package?.downloads?.total;
            if (totalDownloads !== undefined) {
              setStats((prev) => ({
                ...prev,
                [pkg.id]: {
                  ...prev[pkg.id],
                  downloads: totalDownloads,
                },
              }));
            }
          }
        } else if (pkg.npmPackage) {
          const npmRes = await fetch(`https://api.npmjs.org/downloads/point/last-month/${pkg.npmPackage}`);
          if (npmRes.ok) {
            const npmData = await npmRes.json();
            const totalDownloads = npmData.downloads;
            if (totalDownloads !== undefined) {
              setStats((prev) => ({
                ...prev,
                [pkg.id]: {
                  ...prev[pkg.id],
                  downloads: totalDownloads,
                },
              }));
            }
          }
        }
      } catch (e) {
        console.warn(`Failed to fetch downloads for ${pkg.id}`, e);
      }
    });
  }, [packages]);

  // Filter packages based on search query & category selection
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // Category Filter
      if (selectedCategory === 'php-laravel' && !pkg.composerPackage && !pkg.techStack.includes('PHP')) {
        return false;
      }
      if (selectedCategory === 'node-typescript' && !pkg.npmPackage && !pkg.techStack.includes('Node.js')) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = pkg.name.toLowerCase().includes(q);
        const matchTitle = pkg.title.toLowerCase().includes(q);
        const matchTagline = (pkg.tagline || '').toLowerCase().includes(q);
        const matchDesc = (pkg.description || '').toLowerCase().includes(q);
        const matchTech = pkg.techStack.some((tech) => tech.toLowerCase().includes(q));
        const matchFeatures = pkg.features && pkg.features.some((f) => f.toLowerCase().includes(q));

        return matchName || matchTitle || matchTagline || matchDesc || matchTech || matchFeatures;
      }

      return true;
    });
  }, [packages, searchQuery, selectedCategory]);

  const handleCopy = (id, command) => {
    navigator.clipboard.writeText(command).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getThemeClass = (id) => {
    if (id === 'dullahan') return 'theme-red';
    if (id === 'laravel-config-doctor') return 'theme-blue';
    if (id === 'inkstack') return 'theme-yellow';
    return 'theme-red';
  };

  const getPackageIcon = (id) => {
    if (id === 'dullahan') return 'article';
    if (id === 'laravel-config-doctor') return 'healing';
    if (id === 'inkstack') return 'storage';
    return 'extension';
  };

  return (
    <>
      <PageSeo
        title={t('packages.seoTitle', { name: SITE_NAME })}
        description={description}
        keywords={t('packages.seoKeywords')}
        canonical={canonical}
        jsonLd={packagesJsonLd}
        locale={locale}
      />

      <main className="opensource-page page-top-offset">
        <Container className="py-4">
          <nav aria-label="Breadcrumb" className="opensource-breadcrumb mb-4">
            <LocaleLink to="/" className="opensource-back-link">
              <MaterialIcon name="arrow_back" />
              {t('packages.backHome')}
            </LocaleLink>
          </nav>

          <div className="opensource-header text-center mb-5">
            <p className="opensource-eyebrow text-uppercase small fw-semibold mb-2">{t('packages.eyebrow')}</p>
            <h1 className="display-6 fw-bold mb-3">
              {t('packages.heading').replace(t('packages.headingHighlight'), '').trim()}{' '}
              <span className="text-primary">{t('packages.headingHighlight')}</span>
            </h1>
            <p className="opensource-intro mx-auto mb-0 text-secondary" style={{ maxWidth: 650 }}>
              {t('packages.intro')}
            </p>
          </div>

          {/* Filters & Search Section */}
          <div className="opensource-filter-wrapper">
            <Row className="g-3 align-items-center">
              <Col xs={12} md={6}>
                <div className="opensource-search-box">
                  <MaterialIcon name="search" className="opensource-search-icon" />
                  <input
                    type="text"
                    className="opensource-search-input"
                    placeholder={t('packages.filters.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label={t('packages.filters.searchPlaceholder')}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="btn-close position-absolute end-0 top-50 translate-middle-y me-3"
                      onClick={() => setSearchQuery('')}
                      aria-label={t('packages.filters.clearSearch')}
                    />
                  )}
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="opensource-filter-pills justify-content-md-end">
                  <button
                    type="button"
                    className={`opensource-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    {t('packages.filters.all')}
                  </button>
                  <button
                    type="button"
                    className={`opensource-filter-btn filter-php ${selectedCategory === 'php-laravel' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('php-laravel')}
                  >
                    {t('packages.filters.phpLaravel')}
                  </button>
                  <button
                    type="button"
                    className={`opensource-filter-btn filter-node ${selectedCategory === 'node-typescript' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('node-typescript')}
                  >
                    {t('packages.filters.nodeTs')}
                  </button>
                </div>
              </Col>
            </Row>
          </div>

          {filteredPackages.length === 0 ? (
            <div className="opensource-empty-state">
              <MaterialIcon name="search_off" className="opensource-empty-icon" />
              <h3 className="h4 fw-bold mb-2">{t('packages.filters.emptyState')}</h3>
              <Button
                variant="primary"
                className="mt-3 px-4 rounded-pill"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                {t('packages.filters.clearFilters')}
              </Button>
            </div>
          ) : (
            <Row className="g-4 justify-content-center">
              {filteredPackages.map((pkg) => {
                const themeClass = getThemeClass(pkg.id);
                const packageIcon = getPackageIcon(pkg.id);
                return (
                  <Col key={pkg.id} xs={12} lg={10} xl={8}>
                    <Card className={`package-card ${themeClass} border-0`}>
                      <div className="package-card-header-band" />
                      <Card.Body className="p-4 p-md-5">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
                          <div className="d-flex align-items-start gap-3">
                            <div className="package-icon-container d-none d-sm-flex align-items-center justify-content-center p-2 border border-2 border-dark" style={{ background: '#ffffff', minWidth: '48px', height: '48px' }}>
                              <MaterialIcon name={packageIcon} className="fs-3 text-dark" />
                            </div>
                            <div>
                              <Card.Subtitle className="text-primary small mb-1 fw-semibold">
                                {pkg.name}
                              </Card.Subtitle>
                              <Card.Title className="h3 fw-bold mb-2">{pkg.title}</Card.Title>
                              <p className="lead fs-6 text-secondary mb-0">{pkg.tagline}</p>
                            </div>
                          </div>

                          <Button
                            href={pkg.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="primary"
                            className="rounded-pill px-4 flex-shrink-0"
                          >
                            <MaterialIcon name="code" className="me-2" />
                            {t('packages.viewGitHub')}
                          </Button>
                        </div>

                        {/* Stats block */}
                        <div className="package-stats-grid">
                          {stats[pkg.id] && (
                            <>
                              <div className="package-stat-box" title={t('packages.stats.stars')}>
                                <MaterialIcon name="star" />
                                <span>{stats[pkg.id].stars} {t('packages.stats.stars')}</span>
                              </div>
                              {stats[pkg.id].forks !== undefined && (
                                <div className="package-stat-box" title={t('packages.stats.forks')}>
                                  <MaterialIcon name="fork_left" />
                                  <span>{stats[pkg.id].forks} {t('packages.stats.forks')}</span>
                                </div>
                              )}
                              {stats[pkg.id].downloads !== undefined && (
                                <div className="package-stat-box" title={t('packages.stats.downloads')}>
                                  <MaterialIcon name="download" />
                                  <span>
                                    {stats[pkg.id].downloads.toLocaleString()} {pkg.npmPackage ? 'NPM' : 'Packagist'}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="d-flex flex-wrap gap-2 mb-4 package-tech-badges">
                          {pkg.techStack.map((tech) => (
                            <Badge key={tech} bg="light" text="dark" className="border border-primary border-opacity-25">
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        <div className="mb-4">
                          <h3 className="h6 fw-bold text-dark mb-3">{t('packages.installCommand')}</h3>
                          <div className="package-installation-box">
                            <div className="package-terminal-header">
                              <div className="package-terminal-dots">
                                <span className="package-terminal-dot dot-red"></span>
                                <span className="package-terminal-dot dot-yellow"></span>
                                <span className="package-terminal-dot dot-green"></span>
                              </div>
                              <span className="package-terminal-title">
                                {pkg.npmPackage ? 'npm' : 'composer'}
                              </span>
                            </div>
                            <div className="package-terminal-body">
                              <pre className="package-installation-code">
                                <span className="cmd-prompt">$</span>
                                {pkg.npmPackage ? `npm install ${pkg.npmPackage}` : `composer require ${pkg.composerPackage}`}
                              </pre>
                              <button
                                type="button"
                                className="package-copy-btn"
                                onClick={() => handleCopy(
                                  pkg.id,
                                  pkg.npmPackage ? `npm install ${pkg.npmPackage}` : `composer require ${pkg.composerPackage}`
                                )}
                                aria-label="Copy installation command"
                              >
                                <MaterialIcon name={copiedId === pkg.id ? 'check' : 'content_copy'} />
                                <span>{copiedId === pkg.id ? 'Copied!' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <Card.Text className="text-secondary mb-4" style={{ lineHeight: 1.7 }}>
                          {pkg.description}
                        </Card.Text>

                        {pkg.features && pkg.features.length > 0 && (
                          <div>
                            <h3 className="h6 fw-bold text-dark mb-3">{t('packages.featuresTitle')}</h3>
                            <ul className="package-features-list">
                              {pkg.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Container>
      </main>
    </>
  );
}

export default OpensourcePage;
