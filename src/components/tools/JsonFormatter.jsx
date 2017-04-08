import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToolLayout from './ToolLayout';
import CopyButton from './CopyButton';
import ToolStatus from './ToolStatus';
import { formatJSON, minifyJSON, validateJSON } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

const SAMPLE_JSON = `{
  "name": "Waqas Yousaf",
  "role": "Backend Developer",
  "skills": ["PHP", "Laravel", "AWS", "Docker"],
  "available": true
}`;

function JsonFormatter() {
  const { t, i18n } = useTranslation();
  const tool = useTool('json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState({ valid: null, message: '' });

  useEffect(() => {
    const timer = setTimeout(() => setStatus(validateJSON(input)), 250);
    return () => clearTimeout(timer);
  }, [input, i18n.language]);

  const charCount = useMemo(() => input.length, [input]);

  const handleFormat = () => {
    try {
      setOutput(formatJSON(input));
    } catch (e) {
      setOutput(`${t('tools.ui.json.errorPrefix')}\n${e.message}`);
    }
  };

  const handleMinify = () => {
    try {
      setOutput(minifyJSON(input));
    } catch (e) {
      setOutput(`${t('tools.ui.json.errorPrefix')}\n${e.message}`);
    }
  };

  if (!tool) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <ToolStatus valid={status.valid} message={status.message} />
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mt-3 mb-3">
        <span className="small text-secondary">{t('tools.ui.shared.characters', { count: charCount })}</span>
        <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => setInput(SAMPLE_JSON)}>
          {t('tools.ui.shared.loadSample')}
        </Button>
      </div>
      <Row className="g-4">
        <Col md={6}>
          <Form.Label className="fw-bold">{t('tools.ui.json.inputJson')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={14}
            placeholder={t('tools.ui.json.inputPlaceholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`font-monospace small tool-code-input ${status.valid === false ? 'tool-input-invalid' : ''}`}
          />
        </Col>
        <Col md={6}>
          <Form.Label className="fw-bold">{t('tools.ui.shared.output')}</Form.Label>
          <Form.Control as="textarea" rows={14} readOnly value={output} className="font-monospace small tool-code-input" />
        </Col>
      </Row>
      <div className="tool-action-bar">
        <Button variant="primary" className="rounded-pill" onClick={handleFormat}>
          {t('tools.ui.shared.beautify')}
        </Button>
        <Button variant="dark" className="rounded-pill" onClick={handleMinify}>
          {t('tools.ui.shared.minify')}
        </Button>
        <Button variant="outline-secondary" className="rounded-pill" onClick={() => { setInput(''); setOutput(''); }}>
          {t('tools.ui.shared.clear')}
        </Button>
        <CopyButton text={output} label={t('tools.ui.shared.copyOutput')} variant="outline-primary" />
      </div>
    </ToolLayout>
  );
}

export default JsonFormatter;
