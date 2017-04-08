import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToolLayout from './ToolLayout';
import CopyButton from './CopyButton';
import ToolStatus from './ToolStatus';
import MaterialIcon from '../common/MaterialIcon';
import { minifyJS, beautifyJS } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

const SAMPLE_JS = `function greet(name) {
  if (!name) {
    return 'Hello, world!';
  }

  return \`Hello, \${name}!\`;
}

const users = ['Ada', 'Linus', 'Waqas'];
users.forEach((user) => console.log(greet(user)));`;

function JsFormatter() {
  const { t } = useTranslation();
  const tool = useTool('js-formatter');
  const fileInputRef = useRef(null);
  const [inputMode, setInputMode] = useState('text');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState({ valid: null, message: '' });
  const [stats, setStats] = useState(null);

  const initialStatusMessage = t('helpers.jsFormatter.pasteOrUpload');
  const charCount = useMemo(() => input.length, [input]);

  const applyResult = (result, successKey, sourceLabel = '') => {
    if (result.error) {
      setOutput('');
      setStats(null);
      setStatus({ valid: false, message: result.error });
      return;
    }

    setOutput(result.js);
    setStats(result.stats);
    setStatus({
      valid: true,
      message: sourceLabel
        ? t(`tools.ui.jsFormatter.${successKey}From`, {
            source: sourceLabel,
            bytes: result.stats.savedBytes,
            percent: result.stats.savedPercent,
          })
        : t(`tools.ui.jsFormatter.${successKey}`, {
            bytes: result.stats.savedBytes,
            percent: result.stats.savedPercent,
          }),
    });
  };

  const handleMinify = () => {
    applyResult(minifyJS(input), 'minified', fileName || t('tools.ui.jsFormatter.fromText'));
  };

  const handleBeautify = () => {
    applyResult(beautifyJS(input), 'beautified', fileName || t('tools.ui.jsFormatter.fromText'));
  };

  const handleFile = (file) => {
    if (!file) return;

    const isJsFile =
      file.type === 'text/javascript' ||
      file.type === 'application/javascript' ||
      file.type === 'application/x-javascript' ||
      file.name.toLowerCase().endsWith('.js') ||
      file.name.toLowerCase().endsWith('.mjs') ||
      file.type === 'text/plain' ||
      file.type === '';

    if (!isJsFile) {
      setStatus({ valid: false, message: t('tools.ui.jsFormatter.invalidFile') });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      setInput(text);
      setFileName(file.name);
      setInputMode('file');
      applyResult(minifyJS(text), 'minified', file.name);
    };
    reader.onerror = () => {
      setStatus({ valid: false, message: t('tools.ui.jsFormatter.readError') });
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setFileName('');
    setStats(null);
    setStatus({ valid: null, message: initialStatusMessage });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!tool) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <ToolStatus valid={status.valid} message={status.message || initialStatusMessage} />

      <ButtonGroup className="mb-3">
        <Button variant={inputMode === 'text' ? 'primary' : 'outline-primary'} onClick={() => setInputMode('text')}>
          {t('tools.ui.jsFormatter.fromText')}
        </Button>
        <Button variant={inputMode === 'file' ? 'primary' : 'outline-primary'} onClick={() => setInputMode('file')}>
          {t('tools.ui.jsFormatter.fromFile')}
        </Button>
      </ButtonGroup>

      {inputMode === 'file' ? (
        <div className="css-minifier-upload glass-card p-4 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".js,.mjs,text/javascript,application/javascript,text/plain"
            className="d-none"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFile(file);
              event.target.value = '';
            }}
          />
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Button variant="primary" className="rounded-pill" onClick={() => fileInputRef.current?.click()}>
              <MaterialIcon name="upload_file" className="me-2" />
              {t('tools.ui.jsFormatter.uploadJsFile')}
            </Button>
            {fileName ? <span className="small text-secondary">{fileName}</span> : null}
          </div>
          <p className="small text-secondary mb-0 mt-3">{t('tools.ui.jsFormatter.fileHint')}</p>
        </div>
      ) : null}

      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <span className="small text-secondary">{t('tools.ui.shared.characters', { count: charCount })}</span>
        <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => setInput(SAMPLE_JS)}>
          {t('tools.ui.shared.loadSample')}
        </Button>
      </div>

      <Row className="g-4">
        <Col md={6}>
          <Form.Label className="fw-bold">
            {inputMode === 'file' ? t('tools.ui.jsFormatter.loadedJs') : t('tools.ui.jsFormatter.inputJs')}
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={14}
            placeholder={t('tools.ui.jsFormatter.inputPlaceholder')}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              if (inputMode === 'file') {
                setFileName('');
              }
            }}
            className="font-monospace small tool-code-input"
          />
        </Col>
        <Col md={6}>
          <Form.Label className="fw-bold d-flex justify-content-between align-items-center">
            <span>{t('tools.ui.jsFormatter.outputJs')}</span>
            {stats ? (
              <span className="small fw-normal text-secondary">
                {t('tools.ui.jsFormatter.sizeRange', {
                  original: stats.originalSize.toLocaleString(),
                  formatted: stats.minifiedSize.toLocaleString(),
                })}
              </span>
            ) : null}
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={14}
            readOnly
            value={output}
            placeholder={t('tools.ui.jsFormatter.outputPlaceholder')}
            className="font-monospace small tool-code-input"
          />
        </Col>
      </Row>

      <div className="tool-action-bar">
        <Button variant="primary" className="rounded-pill" onClick={handleBeautify} disabled={!input.trim()}>
          {t('tools.ui.shared.beautify')}
        </Button>
        <Button variant="dark" className="rounded-pill" onClick={handleMinify} disabled={!input.trim()}>
          {t('tools.ui.jsFormatter.minifyJs')}
        </Button>
        <Button variant="outline-secondary" className="rounded-pill" onClick={handleClear}>
          {t('tools.ui.shared.clear')}
        </Button>
        <CopyButton text={output} label={t('tools.ui.shared.copyOutput')} variant="outline-primary" />
      </div>
    </ToolLayout>
  );
}

export default JsFormatter;
