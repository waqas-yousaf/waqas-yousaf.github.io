import { useState, useMemo } from 'react';
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
import { PACKAGES_PATH } from '../data/packages';

function PackagesPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const packages = usePackages();
  const [copiedId, setCopiedId] = useState(null);

  const description = t('packages.seoDescription', { name: SITE_NAME });
  const canonical = `${SITE_URL}${localizePath(PACKAGES_PATH, locale)}`;

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

  const handleCopy = (id, command) => {
    navigator.clipboard.writeText(command).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
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

      <main className="packages-page page-top-offset">
        <Container className="py-4">
          <nav aria-label="Breadcrumb" className="packages-breadcrumb mb-4">
            <LocaleLink to="/" className="packages-back-link">
              <MaterialIcon name="arrow_back" />
              {t('packages.backHome')}
            </LocaleLink>
          </nav>

          <div className="packages-header text-center mb-5">
            <p className="packages-eyebrow text-uppercase small fw-semibold mb-2">{t('packages.eyebrow')}</p>
            <h1 className="display-6 fw-bold mb-3">
              {t('packages.heading').replace(t('packages.headingHighlight'), '').trim()}{' '}
              <span className="text-primary">{t('packages.headingHighlight')}</span>
            </h1>
            <p className="packages-intro mx-auto mb-0 text-secondary" style={{ maxWidth: 650 }}>
              {t('packages.intro')}
            </p>
          </div>

          <Row className="g-4 justify-content-center">
            {packages.map((pkg) => (
              <Col key={pkg.id} xs={12} lg={10} xl={8}>
                <Card className="glass-card package-card border-0">
                  <Card.Body className="p-4 p-md-5">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
                      <div>
                        <Card.Subtitle className="text-primary small mb-1 fw-semibold">
                          {pkg.name}
                        </Card.Subtitle>
                        <Card.Title className="h3 fw-bold mb-2">{pkg.title}</Card.Title>
                        <p className="lead fs-6 text-secondary mb-0">{pkg.tagline}</p>
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
                        <pre className="package-installation-code">composer require {pkg.composerPackage}</pre>
                        <button
                          type="button"
                          className="package-copy-btn"
                          onClick={() => handleCopy(pkg.id, `composer require ${pkg.composerPackage}`)}
                          aria-label="Copy installation command"
                        >
                          <MaterialIcon name={copiedId === pkg.id ? 'check' : 'content_copy'} />
                          <span>{copiedId === pkg.id ? 'Copied!' : 'Copy'}</span>
                        </button>
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
            ))}
          </Row>
        </Container>
      </main>
    </>
  );
}

export default PackagesPage;
