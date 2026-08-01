import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
        <div className="container-fluid px-3 px-md-5 py-5">
          <nav aria-label="Breadcrumb" className="about-breadcrumb mb-4">
            <LocaleLink to="/" className="about-back-link">
              <MaterialIcon name="arrow_back" />
              {t('about.backHome')}
            </LocaleLink>
          </nav>

          <Row className="g-4 g-lg-5 align-items-start">
            <Col md={5} lg={4}>
              <div className="about-portrait-card glass-card p-0" style={{ overflow: 'hidden' }}>
                <img
                  src="https://res.cloudinary.com/dowsxszgp/image/upload/waqas-yousaf_nxwbc1"
                  alt={t('about.portraitAlt', { name: SITE_NAME })}
                  className="about-portrait"
                  width="70%"
                  height="auto"
                  loading="eager"
                  style={{ borderBottom: '4px solid #121212' }}
                />
                <div className="p-2">
                  <div className="about-social-links d-flex flex-column gap-2">
                    {socialLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="about-profile-social-link d-flex align-items-center gap-2 text-decoration-none"
                      >
                        <BrandIcon name={link.id} className="text-dark" />
                        <span className="small fw-bold text-secondary">
                          {t(`social.${link.id}`)}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={7} lg={8}>
              <p className="about-eyebrow text-uppercase small fw-semibold mb-2">{t('about.eyebrow')}</p>
              <h1 className="display-6 fw-bold mb-2">{SITE_NAME}</h1>
              <p className="lead text-primary mb-4 fw-bold">{tagline}</p>

              <div className="about-intro mb-4">
                {aboutIntro.map((paragraph, index) => (
                  <p key={index} className="text-secondary mb-3 fs-5" style={{ lineHeight: 1.7 }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="d-flex flex-wrap gap-3 pt-3 border-top border-light">
                <ProtectedEmail variant="link" linkClassName="about-email-btn btn btn-primary rounded-pill px-4 py-2 fw-bold" />
                <Button as={LocaleLink} to={PORTFOLIO_PATH} variant="outline-primary" className="rounded-pill px-4 py-2 fw-bold">
                  {t('about.viewPortfolio')}
                </Button>
                <Button as={LocaleLink} to={TOOLS_PATH} variant="outline-secondary" className=" rounded-pill px-4 py-2 fw-bold">
                  {t('about.exploreTools')}
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        <Experience />
        <Skills />
      </main>
    </>
  );
}

export default AboutPage;
