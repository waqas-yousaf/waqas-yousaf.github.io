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
import HtmlWysiwygEditor from './HtmlWysiwygEditor';
import {
  cleanHtml,
  DEFAULT_HTML_CLEANER_OPTIONS,
  HTML_CLEANER_PRESETS,
} from '../../utils/htmlCleaner';
import { useTool } from '../../data/tools';

const SAMPLE_HTML = `<div id="page" class="wrapper container" style="padding:16px" data-page-id="42" onclick="doSomething()">
  <!-- CMS wrapper -->
  <div class="row">
    <div class="col">
      <div class="content-block">
        <p class="lead" id="intro" style="color:#333">Hello <span class="bold">world</span></p>
        <a href="/docs" class="btn btn-primary" target="_blank" rel="noopener">Read docs</a>
        <img src="/logo.png" alt="Logo" class="logo" width="120" data-asset-id="9" />
      </div>
    </div>
  </div>
  <script>console.log('tracking');</script>
  <style>.lead { font-size: 1.25rem; }</style>
</div>`;

const OPTION_GROUPS = [
  {
    key: 'attributes',
    options: [
      'removeIds',
      'removeClasses',
      'removeStyles',
      'removeDataAttributes',
      'removeAriaAttributes',
      'removeEventHandlers',
      'removeOtherAttributes',
      'preserveHref',
      'preserveSrc',
      'preserveAlt',
      'preserveTitle',
    ],
  },
  {
    key: 'structure',
    options: [
      'removeEmptyDivs',
      'unwrapExtraDivs',
      'unwrapSpans',
      'removeEmptyElements',
    ],
  },
  {
    key: 'content',
    options: ['removeComments', 'removeScripts', 'removeStyleTags', 'removeMetaLink'],
  },
  {
    key: 'output',
    options: ['beautify', 'minify'],
  },
];

function HtmlCleaner() {
  const { t } = useTranslation();
  const tool = useTool('html-cleaner');
  const fileInputRef = useRef(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');
  const [options, setOptions] = useState(DEFAULT_HTML_CLEANER_OPTIONS);
  const [status, setStatus] = useState({ valid: null, message: t('helpers.htmlCleaner.pasteOrUpload') });

  const charCount = useMemo(() => input.length, [input]);

  const updateOption = (key, value) => {
    setOptions((prev) => {
      const next = { ...prev, [key]: value };

      if (key === 'beautify' && value) {
        next.minify = false;
      }

      if (key === 'minify' && value) {
        next.beautify = false;
      }

      return next;
    });
  };

  const applyPreset = (presetKey) => {
    setOptions(HTML_CLEANER_PRESETS[presetKey]);
  };

  const runClean = (html, sourceLabel = '') => {
    const result = cleanHtml(html, options);

    if (result.error === 'empty') {
      setOutput('');
      setStatus({ valid: null, message: t('helpers.htmlCleaner.pasteOrUpload') });
      return;
    }

    if (result.error === 'invalid') {
      setOutput('');
      setStatus({ valid: false, message: t('helpers.htmlCleaner.invalidHtml') });
      return;
    }

    setOutput(result.html);
    setStatus({
      valid: true,
      message: sourceLabel
        ? t('tools.ui.htmlCleaner.cleanedFrom', {
            source: sourceLabel,
            attrs: result.stats.removedAttributes,
            divs: result.stats.unwrappedDivs,
            bytes: result.stats.savedBytes,
          })
        : t('tools.ui.htmlCleaner.cleaned', {
            attrs: result.stats.removedAttributes,
            divs: result.stats.unwrappedDivs,
            bytes: result.stats.savedBytes,
          }),
    });
  };

  const handleClean = () => {
    runClean(input, fileName || t('tools.ui.htmlCleaner.fromText'));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      setInput(text);
      setFileName(file.name);
      runClean(text, file.name);
    };
    reader.onerror = () => {
      setStatus({ valid: false, message: t('tools.ui.htmlCleaner.readError') });
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  if (!tool) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <ToolStatus valid={status.valid} message={status.message} />

      <div className="d-flex flex-wrap gap-2 align-items-center mb-3 mt-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.htm,.txt,text/html"
          className="d-none"
          onChange={handleFileChange}
        />
        <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => fileInputRef.current?.click()}>
          <MaterialIcon name="upload_file" className="me-2" />
          {t('tools.ui.htmlCleaner.uploadFile')}
        </Button>
        <Button
          variant="outline-primary"
          size="sm"
          className="rounded-pill"
          onClick={() => {
            setInput(SAMPLE_HTML);
            setFileName('');
            runClean(SAMPLE_HTML);
          }}
        >
          {t('tools.ui.shared.loadSample')}
        </Button>
        {fileName ? <span className="small text-secondary">{fileName}</span> : null}
        <span className="small text-secondary ms-auto">{t('tools.ui.shared.characters', { count: charCount })}</span>
      </div>

      <p className="small text-secondary mb-3">{t('tools.ui.htmlCleaner.fileHint')}</p>

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold me-2">{t('tools.ui.htmlCleaner.presetsLabel')}</Form.Label>
        <ButtonGroup className="flex-wrap">
          {Object.keys(HTML_CLEANER_PRESETS).map((presetKey) => (
            <Button
              key={presetKey}
              variant="outline-secondary"
              size="sm"
              className="rounded-pill me-2 mb-2"
              onClick={() => applyPreset(presetKey)}
            >
              {t(`tools.ui.htmlCleaner.presets.${presetKey}`)}
            </Button>
          ))}
        </ButtonGroup>
      </Form.Group>

      <Row className="g-4">
        <Col xl={7}>
          <HtmlWysiwygEditor
            value={input}
            placeholder={t('tools.ui.htmlCleaner.inputPlaceholder')}
            onChange={(html) => {
              setInput(html);
              setFileName('');
            }}
          />
        </Col>

        <Col xl={5}>
          <Form.Label className="fw-bold">{t('tools.ui.htmlCleaner.optionsLabel')}</Form.Label>
          <div className="html-cleaner-options">
            {OPTION_GROUPS.map((group) => (
              <div key={group.key} className="html-cleaner-option-group mb-3">
                <div className="small fw-bold text-secondary mb-2">
                  {t(`tools.ui.htmlCleaner.groups.${group.key}`)}
                </div>
                <div className="row g-2">
                  {group.options.map((optionKey) => (
                    <div key={optionKey} className="col-sm-6">
                      <label
                        className={`tool-option-card ${options[optionKey] ? 'tool-option-card-active' : ''}`}
                      >
                        <Form.Check
                          type="checkbox"
                          id={`html-cleaner-${optionKey}`}
                          label={t(`tools.ui.htmlCleaner.options.${optionKey}`)}
                          checked={Boolean(options[optionKey])}
                          onChange={(event) => updateOption(optionKey, event.target.checked)}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      <Row className="g-4 mt-1">
        <Col>
          <Form.Label className="fw-bold">{t('tools.ui.htmlCleaner.outputLabel')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={14}
            readOnly
            value={output}
            placeholder={t('tools.ui.htmlCleaner.outputPlaceholder')}
            className="font-monospace small tool-code-input"
          />
        </Col>
      </Row>

      <div className="tool-action-bar">
        <Button variant="primary" className="rounded-pill" onClick={handleClean} disabled={!input.trim()}>
          {t('tools.ui.htmlCleaner.cleanHtml')}
        </Button>
        <Button
          variant="outline-secondary"
          className="rounded-pill"
          onClick={() => {
            setInput('');
            setOutput('');
            setFileName('');
            setStatus({ valid: null, message: t('helpers.htmlCleaner.pasteOrUpload') });
          }}
        >
          {t('tools.ui.shared.clear')}
        </Button>
        <CopyButton text={output} label={t('tools.ui.shared.copyOutput')} variant="outline-primary" />
      </div>
    </ToolLayout>
  );
}

export default HtmlCleaner;
