import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import MaterialIcon from '../common/MaterialIcon';
import LocaleLink from '../common/LocaleLink';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { ABOUT_PATH } from '../../data/about';
import { PORTFOLIO_PATH } from '../../data/portfolio';
import { OPENSOURCE_PATH } from '../../data/packages';
import { useTools, TOOLS_PATH, WISHDD_TOOLS_URL } from '../../data/tools';
import { stripLocalePrefix } from '../../i18n/paths';
import { SITE_NAME } from '../../config/site';

function SiteNavbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const tools = useTools();
  const pathname = stripLocalePrefix(location.pathname);
  const [navExpanded, setNavExpanded] = useState(false);

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

  const isToolsRoute = pathname === TOOLS_PATH;

  const navLinkClass = (path) => {
    const isActive = pathname === path;
    return `site-nav-link${isActive ? ' active' : ''}`;
  };

  return (
    <header className={`site-navbar-wrapper${isToolsRoute ? ' site-navbar-wrapper--tools' : ''}`}>
      <Navbar
        expand="lg"
        className="site-navbar glass-nav"
        collapseOnSelect
        expanded={navExpanded}
        onToggle={setNavExpanded}
      >
        <div className={`container-fluid site-navbar-container${isToolsRoute ? ' site-navbar-container--tools' : ''}`}>
          <Navbar.Brand as={LocaleLink} to="/" className="site-navbar-brand">
            <a class="site-header-brand" href="/" data-discover="true"><span class="material-icons me-2" aria-hidden="true">code</span>Waqas Yousaf</a>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="site-nav"
            aria-expanded={navExpanded}
            aria-label={navExpanded ? t('nav.closeNavigation') : t('nav.toggleNavigation')}
            className={`site-navbar-toggle${navExpanded ? ' is-open' : ''}`}
          >
            {navExpanded ? (
              <MaterialIcon name="close" className="site-navbar-toggle-icon" />
            ) : (
              <>
                <span className="site-navbar-toggle-bar" />
                <span className="site-navbar-toggle-bar" />
                <span className="site-navbar-toggle-bar" />
              </>
            )}
          </Navbar.Toggle>

          <Navbar.Collapse id="site-nav" className="site-navbar-collapse">
            <Nav className="site-navbar-nav ms-lg-auto align-items-lg-center">
              <div className="site-navbar-links">
                <Nav.Link as={LocaleLink} to={ABOUT_PATH} className={navLinkClass(ABOUT_PATH)}>
                  {t('nav.about')}
                </Nav.Link>

                <Nav.Link as={LocaleLink} to={PORTFOLIO_PATH} className={navLinkClass(PORTFOLIO_PATH)}>
                  {t('nav.portfolio')}
                </Nav.Link>

                <Nav.Link as={LocaleLink} to={OPENSOURCE_PATH} className={navLinkClass(OPENSOURCE_PATH)}>
                  {t('nav.opensource')}
                </Nav.Link>



                <NavDropdown
                  title={
                    <span className="site-nav-dropdown-title">
                      <MaterialIcon name="handyman" className="site-nav-icon" />
                      {t('nav.toolbox')}
                    </span>
                  }
                  id="tools-nav-dropdown"
                  className={`site-tools-dropdown d-none d-lg-block${isToolsRoute ? ' is-tools-active' : ''}`}
                  align="end"
                >
                  <div className="site-tools-mega-header">
                    <div>
                      <p className="site-tools-mega-eyebrow mb-1">{t('nav.developerUtilities')}</p>
                    </div>
                    <a href={WISHDD_TOOLS_URL} target="_blank" rel="noopener noreferrer" className="site-tools-mega-link">
                      {t('nav.viewAll')}
                      <MaterialIcon name="open_in_new" />
                    </a>
                  </div>
                  <NavDropdown.Divider className="site-tools-mega-divider" />
                  <div className="site-tools-mega-grid">
                    {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
                      <div key={category} className="site-tools-mega-group">
                        <NavDropdown.Header className="site-tools-mega-category">{category}</NavDropdown.Header>
                        {categoryTools.map((tool) => (
                          <NavDropdown.Item
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={tool.id}
                            className="site-tool-dropdown-item"
                          >
                            <MaterialIcon name={tool.icon} className={`site-tool-dropdown-icon ${tool.iconColor || ''}`} />
                            <span>{tool.title}</span>
                          </NavDropdown.Item>
                        ))}
                      </div>
                    ))}
                  </div>
                </NavDropdown>
              </div>

              <div className="site-navbar-actions">
                <LanguageSwitcher className="me-2" />
                <Button
                  href="https://wa.me/4917683081592"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-navbar-hire hire-btn rounded-pill px-4"
                  variant="primary"
                >
                  <MaterialIcon name="chat" className="me-2" />
                  {t('nav.hireMe')}
                </Button>
              </div>

              <div className="site-navbar-tools-mobile d-lg-none">

                <a
                  href={WISHDD_TOOLS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-navbar-tools-all-link"
                >
                  <MaterialIcon name="open_in_new" className="me-2" />
                  {t('nav.browseAllTools')}
                </a>
                <p className="site-navbar-tools-label">{t('nav.quickAccess')}</p>
                <div className="site-navbar-tools-grid">
                  {tools.map((tool) => (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={tool.id}
                      className="site-tool-mobile-link"
                    >
                      <MaterialIcon name={tool.icon} className={`me-2 ${tool.iconColor || ''}`} />
                      {tool.title}
                    </a>
                  ))}
                </div>
              </div>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </header>
  );
}

export default SiteNavbar;
