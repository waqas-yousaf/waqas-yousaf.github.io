import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToolLayout from './ToolLayout';
import CopyButton from './CopyButton';
import {
  encodeUrlComponent,
  decodeUrlComponent,
  encodeUrlFull,
  decodeUrlFull,
} from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

function UrlEncoder() {
  const { t } = useTranslation();
  const tool = useTool('url-encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('component-encode');

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }
    try {
      if (mode === 'component-encode') setOutput(encodeUrlComponent(input));
      if (mode === 'component-decode') setOutput(decodeUrlComponent(input));
      if (mode === 'full-encode') setOutput(encodeUrlFull(input));
      if (mode === 'full-decode') setOutput(decodeUrlFull(input));
    } catch {
      setOutput(t('tools.ui.urlEncode.invalidInput'));
    }
  }, [input, mode, t]);

  const swapFields = () => {
    setInput(output);
    setOutput(input);
  };

  if (!tool) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <ButtonGroup className="mb-3 flex-wrap">
        <Button size="sm" variant={mode === 'component-encode' ? 'primary' : 'outline-primary'} onClick={() => setMode('component-encode')}>
          {t('tools.ui.urlEncode.encodeComponent')}
        </Button>
        <Button size="sm" variant={mode === 'component-decode' ? 'primary' : 'outline-primary'} onClick={() => setMode('component-decode')}>
          {t('tools.ui.urlEncode.decodeComponent')}
        </Button>
        <Button size="sm" variant={mode === 'full-encode' ? 'primary' : 'outline-primary'} onClick={() => setMode('full-encode')}>
          {t('tools.ui.urlEncode.encodeUri')}
        </Button>
        <Button size="sm" variant={mode === 'full-decode' ? 'primary' : 'outline-primary'} onClick={() => setMode('full-decode')}>
          {t('tools.ui.urlEncode.decodeUri')}
        </Button>
      </ButtonGroup>
      <Row className="g-4">
        <Col md={6}>
          <Form.Label className="fw-bold">{t('tools.ui.shared.input')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('tools.ui.urlEncode.inputPlaceholder')}
            className="tool-code-input font-monospace small"
          />
        </Col>
        <Col md={6}>
          <Form.Label className="fw-bold">{t('tools.ui.shared.output')}</Form.Label>
          <Form.Control as="textarea" rows={8} readOnly value={output} className="tool-code-input font-monospace small" />
        </Col>
      </Row>
      <div className="tool-action-bar">
        <Button variant="outline-secondary" className="rounded-pill" onClick={swapFields}>
          {t('tools.ui.shared.swap')}
        </Button>
        <CopyButton text={output} label={t('tools.ui.shared.copyOutput')} variant="outline-primary" />
      </div>
    </ToolLayout>
  );
}

export default UrlEncoder;
