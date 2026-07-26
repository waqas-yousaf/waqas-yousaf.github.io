import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PageSeo from '../components/seo/PageSeo';
import Experience from '../components/sections/Experience';
import MaterialIcon from '../components/common/MaterialIcon';
import BrandIcon from '../components/common/BrandIcon';
import ProtectedEmail from '../components/common/ProtectedEmail';
import LocaleLink from '../components/common/LocaleLink';
import { SITE_NAME, SITE_URL } from '../config/site';
import { PORTFOLIO_PATH } from '../data/portfolio';
import { TOOLS_PATH } from '../data/tools';
import Skills from '../components/sections/Skills';
import { ABOUT_PATH, socialLinks } from '../data/about';
import { useLocale } from '../i18n/useLocale';
import { localizePath } from '../i18n/paths';

function AboutPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const tagline = t('site.tagline');

  const aboutIntro = t('about.intro', { returnObjects: true, name: SITE_NAME, tagline });

  const aboutJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name: SITE_NAME,
        jobTitle: tagline,
        url: SITE_URL,
        image: `${SITE_URL}/waqas-yousaf.png`,
        sameAs: socialLinks.map((link) => link.href),
      },
    }),
    [tagline]
  );

  return (
    <>
      <PageSeo
        title={t('about.seoTitle', { name: SITE_NAME, tagline })}
        description={t('about.seoDescription', { name: SITE_NAME })}
        keywords={t('about.seoKeywords')}
        canonical={`${SITE_URL}${localizePath(ABOUT_PATH, locale)}`}
        jsonLd={aboutJsonLd}
        locale={locale}
      />

      <main className="about-page page-top-offset">
        <Container className="py-5" style={{ maxWidth: 1300 }}>
          <nav aria-label="Breadcrumb" className="about-breadcrumb mb-4">
            <LocaleLink to="/" className="about-back-link">
              <MaterialIcon name="arrow_back" />
              {t('about.backHome')}
            </LocaleLink>
          </nav>

          <Row className="g-4 g-lg-5 align-items-start">
            <Col md={5} lg={5}>
              <div className="about-portrait-card">
                <img
                  src="https://res.cloudinary.com/dowsxszgp/image/upload/waqas-yousaf_nxwbc1"
                  alt={t('about.portraitAlt', { name: SITE_NAME })}
                  className="about-portrait"
                  width={360}
                  height={450}
                  loading="eager"
                />
              </div>
            </Col>

            <Col md={7} lg={7}>
              <p className="about-eyebrow text-uppercase small fw-semibold mb-2">{t('about.eyebrow')}</p>
              <h1 className="display-6 fw-bold mb-2">{SITE_NAME}</h1>
              <p className="lead text-primary mb-4">{tagline}</p>

              <div className="about-intro mb-4">
                {aboutIntro.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-secondary mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="about-social mb-4">
                <h2 className="h6 fw-bold mb-3">{t('about.connect')}</h2>
                <div className="about-social-links">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="about-social-link"
                      aria-label={t(`social.${link.id}`)}
                    >
                      <BrandIcon name={link.id} className="me-2" />
                      {t(`social.${link.id}`)}
                    </a>
                  ))}
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <ProtectedEmail variant="link" linkClassName="about-social-link about-social-email rounded-pill px-4" />
                <Button as={LocaleLink} to={PORTFOLIO_PATH} variant="outline-primary" className="rounded-pill px-4">
                  {t('about.viewPortfolio')}
                </Button>
                <Button as={LocaleLink} to={TOOLS_PATH} variant="primary" className="rounded-pill px-4">
                  {t('about.exploreTools')}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>

        <Experience />
        <Skills />
      </main>
    </>
  );
}

export default AboutPage;
