import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToolLayout from './ToolLayout';
import CopyButton from './CopyButton';
import { encodeHtmlEntities, decodeHtmlEntities } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

function HtmlEntityConverter() {
  const { t } = useTranslation();
  const tool = useTool('html-entities');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }
    setOutput(mode === 'encode' ? encodeHtmlEntities(input) : decodeHtmlEntities(input));
  }, [input, mode]);

  if (!tool) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} iconClass={tool.iconColor} title={tool.longTitle} description={tool.seoDescription}>
      <ButtonGroup className="mb-3">
        <Button variant={mode === 'encode' ? 'primary' : 'outline-primary'} onClick={() => setMode('encode')}>
          {t('tools.ui.shared.encode')}
        </Button>
        <Button variant={mode === 'decode' ? 'primary' : 'outline-primary'} onClick={() => setMode('decode')}>
          {t('tools.ui.shared.decode')}
        </Button>
      </ButtonGroup>
      <Row className="g-4">
        <Col md={6}>
          <Form.Label className="fw-bold">{t('tools.ui.shared.input')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'encode'
                ? t('tools.ui.htmlEntities.encodePlaceholder')
                : t('tools.ui.htmlEntities.decodePlaceholder')
            }
            className="tool-code-input font-monospace small"
          />
        </Col>
        <Col md={6}>
          <Form.Label className="fw-bold">{t('tools.ui.shared.output')}</Form.Label>
          <Form.Control as="textarea" rows={10} readOnly value={output} className="tool-code-input font-monospace small" />
        </Col>
      </Row>
      <div className="tool-action-bar">
        <CopyButton text={output} label={t('tools.ui.shared.copyOutput')} variant="outline-primary" />
      </div>
    </ToolLayout>
  );
}

export default HtmlEntityConverter;
