import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import MaterialIcon from '../common/MaterialIcon';
import LocaleLink from '../common/LocaleLink';
import RelatedToolCard from './RelatedToolCard';
import { useTools, TOOLS_PATH } from '../../data/tools';
import { useLocalizedPath } from '../../i18n/useLocale';

function ToolLayout({
  toolId,
  icon,
  iconClass,
  title,
  description,
  immersive = false,
  contentCol = { xs: 12 },
  children,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();
  const tools = useTools();
  const current = tools.find((item) => item.id === toolId);

  const relatedTools = useMemo(() => {
    const others = tools.filter((item) => item.id !== toolId);
    const sameCategory = others.filter((item) => item.category === current?.category);
    const otherCategories = others.filter((item) => item.category !== current?.category);
    const picked = [...sameCategory.slice(0, 4)];

    if (picked.length < 4) {
      picked.push(...otherCategories.slice(0, 4 - picked.length));
    }

    return picked;
  }, [tools, toolId, current?.category]);

  const relatedSubtitle = current?.category
    ? t('tools.layout.relatedToolsSubtitle', { category: current.category })
    : t('tools.layout.relatedToolsFallback');

  const goToTools = () => {
    navigate(localizedPath(TOOLS_PATH));
  };

  if (immersive) {
    return (
      <main className="tool-page tool-page--immersive min-vh-100">
        <Container fluid className="px-3 px-lg-4">
          {children}
        </Container>
      </main>
    );
  }

  return (
    <main className="tool-page min-vh-75 py-5 mt-5 mb-3">
      <Container fluid className="px-3 px-lg-4">
        <nav aria-label="Breadcrumb" className="tool-breadcrumb mb-3">
          <ol className="list-unstyled d-flex flex-wrap align-items-center gap-2 mb-0 small">
            <li>
              <LocaleLink to="/">{t('tools.layout.breadcrumbHome')}</LocaleLink>
            </li>
            <li className="tool-breadcrumb-sep" aria-hidden="true">
              /
            </li>
            <li>
              <button type="button" className="tool-breadcrumb-btn" onClick={goToTools}>
                {t('tools.layout.breadcrumbTools')}
              </button>
            </li>
            <li className="tool-breadcrumb-sep" aria-hidden="true">
              /
            </li>
            <li aria-current="page" className="text-secondary">
              {current?.longTitle || title}
            </li>
          </ol>
        </nav>

        <LocaleLink to={TOOLS_PATH} className="tool-back-link mb-2">
          <MaterialIcon name="arrow_back" /> {t('tools.layout.allTools')}
        </LocaleLink>
        <Row className="g-4">
          <Col {...contentCol}>
            <article className="tool-panel">
              <header className="tool-panel-header">

                <div>
                  {current?.category ? <Badge className="tool-category-badge mb-2">{current.category}</Badge> : null}
                  <h1 className="h2 fw-bold mb-1">{title}</h1>
                  {description ? <p className="tool-panel-desc mb-0">{description}</p> : null}
                </div>
              </header>
              <div className="tool-panel-body">{children}</div>
            </article>
          </Col>

          <Col xs={12}>
            <aside className="tool-sidebar">
              <div className="tool-sidebar-horizontal">
                <div className="tool-sidebar-card">
                  <h2 className="h6 fw-bold mb-3">
                    <MaterialIcon name="shield" className="me-2 text-primary" />
                    {t('tools.layout.privateTitle')}
                  </h2>
                  <p className="small text-secondary mb-0">{t('tools.layout.privateDescription')}</p>
                </div>

                {current?.features ? (
                  <div className="tool-sidebar-card">
                    <h2 className="h6 fw-bold mb-3">{t('tools.layout.features')}</h2>
                    <ul className="tool-feature-sidebar list-unstyled mb-0">
                      {current.features.map((feature) => (
                        <li key={feature}>
                          <MaterialIcon name="check" className="me-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="tool-related-card">
                <div className="tool-related-card-header">
                  <div className="tool-related-card-heading">
                    <span className="tool-related-card-icon" aria-hidden="true">
                      <MaterialIcon name="apps" />
                    </span>
                    <div>
                      <h2 className="h6 fw-bold mb-1">{t('tools.layout.relatedTools')}</h2>
                      <p className="small text-secondary mb-0">{relatedSubtitle}</p>
                    </div>
                  </div>
                  <LocaleLink to={TOOLS_PATH} className="tool-related-browse">
                    {t('tools.layout.browseAllTools')}
                    <MaterialIcon name="arrow_forward" className="ms-1" />
                  </LocaleLink>
                </div>

                <div className="tool-related-grid">
                  {relatedTools.map((tool) => (
                    <RelatedToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            </aside>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default ToolLayout;
