import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import MaterialIcon from '../common/MaterialIcon';
import LocaleLink from '../common/LocaleLink';
import ToolCard from '../tools/ToolCard';
import { useTools, TOOLS_PATH } from '../../data/tools';

function ToolsPreview() {
  const { t } = useTranslation();
  const tools = useTools();
  const featuredTools = tools.slice(0, 4);

  return (
    <section id="tools" className="py-5 section-tools" aria-labelledby="tools-preview-heading">
      <Container>
        <div className="text-center mb-5">
          <p className="text-primary fw-semibold text-uppercase small mb-2">{t('toolsPreview.eyebrow')}</p>
          <h2 id="tools-preview-heading" className="display-6 fw-bold mb-3 text-primary">
            {t('toolsPreview.heading').replace(t('toolsPreview.headingHighlight'), '').trim()}{' '}
            <span className="text-primary">{t('toolsPreview.headingHighlight')}</span>
          </h2>
          <p className="lead text-primary mx-auto tools-intro">{t('toolsPreview.intro', { count: tools.length })}</p>
        </div>

        <Row className="g-4 mb-4">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </Row>

        <div className="text-center">
          <Button as={LocaleLink} to={TOOLS_PATH} variant="primary" className="rounded-pill px-4">
            <MaterialIcon name="apps" className="me-2" />
            {t('toolsPreview.browseAll', { count: tools.length })}
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default ToolsPreview;
