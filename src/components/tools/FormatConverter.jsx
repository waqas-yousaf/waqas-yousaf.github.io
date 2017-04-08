import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToolLayout from './ToolLayout';
import CopyButton from './CopyButton';
import ToolStatus from './ToolStatus';
import MaterialIcon from '../common/MaterialIcon';
import { bcdToDecimal, validateBcdInput } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

const SAMPLE_BCD = '0x12345678';

const CONVERTER_TOOL_CONFIG = {
  'bcd-to-decimal': {
    convert: bcdToDecimal,
    validate: validateBcdInput,
    accept: '.txt,.hex',
    sample: SAMPLE_BCD,
  },
};

function FormatConverter({ toolId }) {
  const { t } = useTranslation();
  const tool = useTool(toolId);
  const config = CONVERTER_TOOL_CONFIG[toolId];
  const fileInputRef = useRef(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState({ valid: null, message: '' });

  const uiKey = toolId.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

  useEffect(() => {
    if (!config) return undefined;
    const timer = setTimeout(() => setStatus(config.validate(input)), 250);
    return () => clearTimeout(timer);
  }, [config, input]);

  const charCount = useMemo(() => input.length, [input]);

  const handleConvert = () => {
    if (!config) return;

    try {
      setOutput(config.convert(input));
      setStatus({ valid: true, message: t(`tools.ui.${uiKey}.converted`) });
    } catch (error) {
      setOutput('');
      setStatus({ valid: false, message: error.message || t(`tools.ui.${uiKey}.convertError`) });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setInput(String(reader.result ?? ''));
      setFileName(file.name);
      setOutput('');
    };
    reader.onerror = () => {
      setStatus({ valid: false, message: t(`tools.ui.${uiKey}.readError`) });
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  if (!tool || !config) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <ToolStatus valid={status.valid} message={status.message} />

      <div className="d-flex flex-wrap gap-2 align-items-center mb-3 mt-3">
        <input ref={fileInputRef} type="file" accept={config.accept} className="d-none" onChange={handleFileChange} />
        <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => fileInputRef.current?.click()}>
          <MaterialIcon name="upload_file" className="me-2" />
          {t(`tools.ui.${uiKey}.uploadFile`)}
        </Button>
        <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => setInput(config.sample)}>
          {t('tools.ui.shared.loadSample')}
        </Button>
        {fileName ? <span className="small text-secondary">{fileName}</span> : null}
        <span className="small text-secondary ms-auto">{t('tools.ui.shared.characters', { count: charCount })}</span>
      </div>

      <p className="small text-secondary mb-4">{t(`tools.ui.${uiKey}.fileHint`)}</p>

      <Row className="g-4">
        <Col md={6}>
          <Form.Label className="fw-bold">{t(`tools.ui.${uiKey}.inputLabel`)}</Form.Label>
          <Form.Control
            as="textarea"
            rows={14}
            placeholder={t(`tools.ui.${uiKey}.inputPlaceholder`)}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setFileName('');
            }}
            className={`font-monospace small tool-code-input ${status.valid === false ? 'tool-input-invalid' : ''}`}
          />
        </Col>
        <Col md={6}>
          <Form.Label className="fw-bold">{t(`tools.ui.${uiKey}.outputLabel`)}</Form.Label>
          <Form.Control
            as="textarea"
            rows={14}
            readOnly
            value={output}
            placeholder={t('tools.ui.shared.result')}
            className="font-monospace small tool-code-input"
          />
        </Col>
      </Row>

      <div className="tool-action-bar">
        <Button variant="primary" className="rounded-pill" onClick={handleConvert} disabled={!input.trim()}>
          {t(`tools.ui.${uiKey}.convert`)}
        </Button>
        <Button
          variant="outline-secondary"
          className="rounded-pill"
          onClick={() => {
            setInput('');
            setOutput('');
            setFileName('');
          }}
        >
          {t('tools.ui.shared.clear')}
        </Button>
        <CopyButton text={output} label={t('tools.ui.shared.copyOutput')} variant="outline-primary" />
      </div>
    </ToolLayout>
  );
}

export default FormatConverter;
