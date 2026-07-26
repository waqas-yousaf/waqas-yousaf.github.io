import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MaterialIcon from '../common/MaterialIcon';
import ProtectedEmail from '../common/ProtectedEmail';
import LocaleLink from '../common/LocaleLink';
import BrandIcon from '../common/BrandIcon';
import { ABOUT_PATH, socialLinks } from '../../data/about';
import { PORTFOLIO_PATH } from '../../data/portfolio';
import { OPENSOURCE_PATH } from '../../data/packages';
import { SITE_NAME } from '../../config/site';
import { useTools, TOOLS_PATH, WISHDD_TOOLS_URL } from '../../data/tools';
import { PRIVACY_PATH, TERMS_PATH } from '../../data/legal';
import { resetCookieConsent } from '../../utils/cookieConsent';
import { useLocale } from '../../i18n/useLocale';
import { stripLocalePrefix } from '../../i18n/paths';

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();
  const { localizedPath } = useLocale();
  const tools = useTools();
  const featuredTools = tools.slice(0, 4);
  const pathname = stripLocalePrefix(location.pathname);
  const isHome = pathname === '/';
  const isToolsRoute = pathname === TOOLS_PATH;

  const pageLinks = [
    { to: '/', label: t('footer.home') },
    { to: ABOUT_PATH, label: t('footer.aboutMe') },
    { to: PORTFOLIO_PATH, label: t('nav.portfolio') },
    { to: OPENSOURCE_PATH, label: t('nav.opensource') },
    { to: TOOLS_PATH, label: t('footer.developerToolbox') },
  ];

  const homeSections = [{ id: 'skills', label: t('footer.skills') }];

  const goToSection = (id) => {
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(localizedPath('/'), { state: { scrollTo: id } });
    }
  };

  return (
    <footer className={`site-footer${isToolsRoute ? ' site-footer--tools' : ''}`}>
      <Container fluid={isToolsRoute} className={isToolsRoute ? 'site-footer-container px-3 px-lg-4' : undefined}>
        <Row className="g-4 g-lg-5 site-footer-main">
          <Col lg={4}>
            <LocaleLink to="/" className="site-footer-brand">
              <MaterialIcon name="code" className="me-2" />
              {SITE_NAME}
            </LocaleLink>
            <p className="site-footer-tagline mb-3">{t('site.tagline')}</p>
            <p className="site-footer-about small mb-0">{t('footer.about')}</p>
          </Col>

          <Col sm={6} lg={2}>
            <h2 className="site-footer-heading">{t('footer.navigate')}</h2>
            <ul className="site-footer-links list-unstyled mb-0">
              {pageLinks.map((link) => (
                <li key={link.to}>
                  <LocaleLink to={link.to}>{link.label}</LocaleLink>
                </li>
              ))}
              {homeSections.map((section) => (
                <li key={section.id}>
                  <button type="button" onClick={() => goToSection(section.id)}>
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </Col>

          <Col sm={6} lg={3}>
            <h2 className="site-footer-heading">{t('footer.popularTools')}</h2>
            <ul className="site-footer-links list-unstyled mb-0">
              {featuredTools.map((tool) => (
                <li key={tool.id}>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    {tool.title}
                  </a>
                </li>
              ))}
              <li>
                <a href={WISHDD_TOOLS_URL} target="_blank" rel="noopener noreferrer">
                  {t('footer.viewAllTools')}
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={3}>
            <h2 className="site-footer-heading">{t('footer.connect')}</h2>
            <div className="site-footer-social mb-3">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(`social.${link.id}`)}
                  title={t(`social.${link.id}`)}
                >
                  <BrandIcon name={link.id} />
                </a>
              ))}
              <ProtectedEmail variant="icon" className="site-footer-email-btn" />
            </div>
          </Col>
        </Row>

        <div className="site-footer-bottom">
          <p className="site-footer-copy mb-0">{t('footer.copyright', { year, siteName: SITE_NAME })}</p>
          <div className="site-footer-legal">
            <LocaleLink to={PRIVACY_PATH}>{t('footer.privacyPolicy')}</LocaleLink>
            <span aria-hidden="true">·</span>
            <LocaleLink to={TERMS_PATH}>{t('footer.termsConditions')}</LocaleLink>
            <span aria-hidden="true">·</span>
            <button type="button" className="site-footer-legal-btn" onClick={() => resetCookieConsent()}>
              {t('footer.cookieSettings')}
            </button>
          </div>
          <p className="site-footer-meta mb-0">{t('footer.builtWith')}</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
