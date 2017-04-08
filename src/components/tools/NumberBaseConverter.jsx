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
import {
  NUMBER_BASE_FORMATS,
  NUMBER_BASE_SAMPLES,
  convertNumberBase,
  validateNumberBaseInput,
} from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

function NumberBaseConverter() {
  const { t } = useTranslation();
  const tool = useTool('bcd-to-decimal');
  const fileInputRef = useRef(null);
  const [sourceFormat, setSourceFormat] = useState('decimal');
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState({});
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState({ valid: null, message: '' });

  useEffect(() => {
    const timer = setTimeout(() => setStatus(validateNumberBaseInput(input, sourceFormat)), 250);
    return () => clearTimeout(timer);
  }, [input, sourceFormat]);

  useEffect(() => {
    setOutputs({});
    setFileName('');
    setStatus(validateNumberBaseInput('', sourceFormat));
  }, [sourceFormat]);

  const charCount = useMemo(() => input.length, [input]);

  const handleConvert = () => {
    try {
      setOutputs(convertNumberBase(input, sourceFormat));
      setStatus({ valid: true, message: t('tools.ui.numberBaseConverter.converted') });
    } catch (error) {
      setOutputs({});
      setStatus({ valid: false, message: error.message || t('tools.ui.numberBaseConverter.convertError') });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setInput(String(reader.result ?? '').trim());
      setFileName(file.name);
      setOutputs({});
    };
    reader.onerror = () => {
      setStatus({ valid: false, message: t('tools.ui.numberBaseConverter.readError') });
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  if (!tool) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <ToolStatus valid={status.valid} message={status.message} />

      <Form.Group className="mb-4 mt-3">
        <Form.Label className="fw-bold">{t('tools.ui.numberBaseConverter.sourceFormatLabel')}</Form.Label>
        <div className="d-flex flex-wrap gap-3 json-converter-radios">
          {NUMBER_BASE_FORMATS.map((format) => (
            <Form.Check
              key={format}
              type="radio"
              id={`number-base-${format}`}
              name="number-base-source"
              label={t(`tools.ui.numberBaseConverter.formats.${format}`)}
              checked={sourceFormat === format}
              onChange={() => setSourceFormat(format)}
              inline
            />
          ))}
        </div>
      </Form.Group>

      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <input ref={fileInputRef} type="file" accept=".txt,.hex" className="d-none" onChange={handleFileChange} />
        <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => fileInputRef.current?.click()}>
          <MaterialIcon name="upload_file" className="me-2" />
          {t('tools.ui.numberBaseConverter.uploadFile')}
        </Button>
        <Button
          variant="outline-primary"
          size="sm"
          className="rounded-pill"
          onClick={() => setInput(NUMBER_BASE_SAMPLES[sourceFormat])}
        >
          {t('tools.ui.shared.loadSample')}
        </Button>
        {fileName ? <span className="small text-secondary">{fileName}</span> : null}
        <span className="small text-secondary ms-auto">{t('tools.ui.shared.characters', { count: charCount })}</span>
      </div>

      <p className="small text-secondary mb-4">{t(`tools.ui.numberBaseConverter.hints.${sourceFormat}`)}</p>

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">
          {t('tools.ui.numberBaseConverter.inputLabel', {
            format: t(`tools.ui.numberBaseConverter.formats.${sourceFormat}`),
          })}
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder={t(`tools.ui.numberBaseConverter.placeholders.${sourceFormat}`)}
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setFileName('');
            setOutputs({});
          }}
          className={`font-monospace small tool-code-input ${status.valid === false ? 'tool-input-invalid' : ''}`}
        />
      </Form.Group>

      <Row className="g-3 mb-4">
        {NUMBER_BASE_FORMATS.map((format) => (
          <Col key={format} md={6} xl={4}>
            <Form.Label className="fw-bold small text-secondary text-uppercase">
              {t(`tools.ui.numberBaseConverter.formats.${format}`)}
            </Form.Label>
            <div className="d-flex gap-2 align-items-start">
              <Form.Control
                readOnly
                value={outputs[format] ?? ''}
                placeholder={t('tools.ui.shared.result')}
                className="font-monospace small tool-code-input"
              />
              <CopyButton text={outputs[format] ?? ''} />
            </div>
          </Col>
        ))}
      </Row>

      <div className="tool-action-bar">
        <Button variant="primary" className="rounded-pill" onClick={handleConvert} disabled={!input.trim()}>
          {t('tools.ui.numberBaseConverter.convert')}
        </Button>
        <Button
          variant="outline-secondary"
          className="rounded-pill"
          onClick={() => {
            setInput('');
            setOutputs({});
            setFileName('');
          }}
        >
          {t('tools.ui.shared.clear')}
        </Button>
      </div>
    </ToolLayout>
  );
}

export default NumberBaseConverter;
