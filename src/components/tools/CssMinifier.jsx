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
import { minifyCSS, beautifyCSS } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

const SAMPLE_CSS = `/* Hero section */
.hero {
  display: flex;
  align-items: center;
  padding: 2rem 1.5rem;
  background-color: #1d4ed8;
}

.hero .title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: #ffffff;
  margin-bottom: 0.75rem;
}

@media (min-width: 768px) {
  .hero {
    padding: 3rem 2rem;
  }
}`;

function CssMinifier() {
  const { t } = useTranslation();
  const tool = useTool('css-minifier');
  const fileInputRef = useRef(null);
  const [inputMode, setInputMode] = useState('text');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState({ valid: null, message: '' });
  const [stats, setStats] = useState(null);

  const initialStatusMessage = t('helpers.cssMinifier.pasteOrUpload');

  const charCount = useMemo(() => input.length, [input]);

  const runMinify = (css, sourceLabel = '') => {
    const result = minifyCSS(css);

    if (result.error) {
      setOutput('');
      setStats(null);
      setStatus({ valid: false, message: result.error });
      return;
    }

    setOutput(result.css);
    setStats(result.stats);
    setStatus({
      valid: true,
      message: sourceLabel
        ? t('tools.ui.cssMinifier.minifiedFrom', {
            source: sourceLabel,
            bytes: result.stats.savedBytes,
            percent: result.stats.savedPercent,
          })
        : t('tools.ui.cssMinifier.saved', {
            bytes: result.stats.savedBytes,
            percent: result.stats.savedPercent,
          }),
    });
  };

  const runBeautify = (css, sourceLabel = '') => {
    const result = beautifyCSS(css);

    if (result.error) {
      setOutput('');
      setStats(null);
      setStatus({ valid: false, message: result.error });
      return;
    }

    setOutput(result.css);
    setStats(result.stats);
    setStatus({
      valid: true,
      message: sourceLabel
        ? t('tools.ui.cssMinifier.beautifiedFrom', {
            source: sourceLabel,
            original: result.stats.originalSize.toLocaleString(),
            formatted: result.stats.minifiedSize.toLocaleString(),
          })
        : t('tools.ui.cssMinifier.beautified', {
            original: result.stats.originalSize.toLocaleString(),
            formatted: result.stats.minifiedSize.toLocaleString(),
          }),
    });
  };

  const handleMinify = () => {
    runMinify(input, fileName || t('tools.ui.cssMinifier.fromText'));
  };

  const handleBeautify = () => {
    runBeautify(input, fileName || t('tools.ui.cssMinifier.fromText'));
  };

  const handleFile = (file) => {
    if (!file) return;

    const isCssFile =
      file.type === 'text/css' ||
      file.name.toLowerCase().endsWith('.css') ||
      file.type === 'text/plain' ||
      file.type === '';

    if (!isCssFile) {
      setStatus({ valid: false, message: t('tools.ui.cssMinifier.invalidFile') });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      setInput(text);
      setFileName(file.name);
      setInputMode('file');
      runMinify(text, file.name);
    };
    reader.onerror = () => {
      setStatus({ valid: false, message: t('tools.ui.cssMinifier.readError') });
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

  const statusMessage = status.message || initialStatusMessage;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <ToolStatus valid={status.valid} message={statusMessage} />

      <ButtonGroup className="mb-3">
        <Button variant={inputMode === 'text' ? 'primary' : 'outline-primary'} onClick={() => setInputMode('text')}>
          {t('tools.ui.cssMinifier.fromText')}
        </Button>
        <Button variant={inputMode === 'file' ? 'primary' : 'outline-primary'} onClick={() => setInputMode('file')}>
          {t('tools.ui.cssMinifier.fromFile')}
        </Button>
      </ButtonGroup>

      {inputMode === 'file' ? (
        <div className="css-minifier-upload glass-card p-4 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".css,text/css,text/plain"
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
              {t('tools.ui.cssMinifier.uploadCssFile')}
            </Button>
            {fileName ? <span className="small text-secondary">{fileName}</span> : null}
          </div>
          <p className="small text-secondary mb-0 mt-3">{t('tools.ui.cssMinifier.fileHint')}</p>
        </div>
      ) : null}

      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <span className="small text-secondary">{t('tools.ui.shared.characters', { count: charCount })}</span>
        <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => setInput(SAMPLE_CSS)}>
          {t('tools.ui.shared.loadSample')}
        </Button>
      </div>

      <Row className="g-4">
        <Col md={6}>
          <Form.Label className="fw-bold">
            {inputMode === 'file' ? t('tools.ui.cssMinifier.loadedCss') : t('tools.ui.cssMinifier.inputCss')}
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={14}
            placeholder={t('tools.ui.cssMinifier.inputPlaceholder')}
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
            <span>{t('tools.ui.cssMinifier.outputCss')}</span>
            {stats ? (
              <span className="small fw-normal text-secondary">
                {t('tools.ui.cssMinifier.sizeRange', {
                  original: stats.originalSize.toLocaleString(),
                  minified: stats.minifiedSize.toLocaleString(),
                })}
              </span>
            ) : null}
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={14}
            readOnly
            value={output}
            placeholder={t('tools.ui.cssMinifier.outputPlaceholder')}
            className="font-monospace small tool-code-input"
          />
        </Col>
      </Row>

      <div className="tool-action-bar">
        <Button variant="primary" className="rounded-pill" onClick={handleBeautify} disabled={!input.trim()}>
          {t('tools.ui.shared.beautify')}
        </Button>
        <Button variant="dark" className="rounded-pill" onClick={handleMinify} disabled={!input.trim()}>
          {t('tools.ui.cssMinifier.minifyCss')}
        </Button>
        <Button variant="outline-secondary" className="rounded-pill" onClick={handleClear}>
          {t('tools.ui.shared.clear')}
        </Button>
        <CopyButton text={output} label={t('tools.ui.shared.copyOutput')} variant="outline-primary" />
      </div>
    </ToolLayout>
  );
}

export default CssMinifier;
