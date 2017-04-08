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
import { getJsonHubConversion, JSON_HUB_PAIRS } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

function JsonConverterHub() {
  const { t } = useTranslation();
  const tool = useTool('json-converter');
  const fileInputRef = useRef(null);
  const [pair, setPair] = useState('xml');
  const [direction, setDirection] = useState('json-to-target');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState({ valid: null, message: '' });

  const config = useMemo(() => getJsonHubConversion(pair, direction), [pair, direction]);

  useEffect(() => {
    if (!config) return undefined;
    const timer = setTimeout(() => setStatus(config.validate(input)), 250);
    return () => clearTimeout(timer);
  }, [config, input]);

  useEffect(() => {
    setOutput('');
    setFileName('');
    if (config) {
      setStatus(config.validate(''));
    }
  }, [pair, direction]);

  const charCount = useMemo(() => input.length, [input]);

  const handleConvert = () => {
    if (!config) return;

    try {
      setOutput(config.convert(input));
      setStatus({ valid: true, message: t('tools.ui.jsonConverter.converted') });
    } catch (error) {
      setOutput('');
      setStatus({ valid: false, message: error.message || t('tools.ui.jsonConverter.convertError') });
    }
  };

  const handleSwapDirection = () => {
    setDirection((prev) => (prev === 'json-to-target' ? 'target-to-json' : 'json-to-target'));
    setInput(output);
    setOutput('');
    setFileName('');
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
      setStatus({ valid: false, message: t('tools.ui.jsonConverter.readError') });
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  if (!tool || !config) return null;

  const inputFormatKey = direction === 'json-to-target' ? 'json' : pair;
  const outputFormatKey = direction === 'json-to-target' ? pair : 'json';

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <ToolStatus valid={status.valid} message={status.message} />

      <Form.Group className="mb-4 mt-3">
        <Form.Label className="fw-bold">{t('tools.ui.jsonConverter.pairLabel')}</Form.Label>
        <div className="d-flex flex-wrap gap-3 json-converter-radios">
          {JSON_HUB_PAIRS.map((pairId) => (
            <Form.Check
              key={pairId}
              type="radio"
              id={`json-pair-${pairId}`}
              name="json-pair"
              label={t(`tools.ui.jsonConverter.pairs.${pairId}`)}
              checked={pair === pairId}
              onChange={() => setPair(pairId)}
              inline
            />
          ))}
        </div>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">{t('tools.ui.jsonConverter.directionLabel')}</Form.Label>
        <div className="d-flex flex-wrap gap-3 align-items-center json-converter-radios">
          <Form.Check
            type="radio"
            id="json-direction-forward"
            name="json-direction"
            label={t(`tools.ui.jsonConverter.directions.${pair}.toTarget`)}
            checked={direction === 'json-to-target'}
            onChange={() => setDirection('json-to-target')}
            inline
          />
          <Form.Check
            type="radio"
            id="json-direction-reverse"
            name="json-direction"
            label={t(`tools.ui.jsonConverter.directions.${pair}.toJson`)}
            checked={direction === 'target-to-json'}
            onChange={() => setDirection('target-to-json')}
            inline
          />
          <Button variant="outline-secondary" size="sm" className="rounded-pill" onClick={handleSwapDirection}>
            <MaterialIcon name="swap_horiz" className="me-1" />
            {t('tools.ui.jsonConverter.swapDirection')}
          </Button>
        </div>
      </Form.Group>

      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <input ref={fileInputRef} type="file" accept={config.accept} className="d-none" onChange={handleFileChange} />
        <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => fileInputRef.current?.click()}>
          <MaterialIcon name="upload_file" className="me-2" />
          {t('tools.ui.jsonConverter.uploadFile')}
        </Button>
        <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => setInput(config.sample)}>
          {t('tools.ui.shared.loadSample')}
        </Button>
        {fileName ? <span className="small text-secondary">{fileName}</span> : null}
        <span className="small text-secondary ms-auto">{t('tools.ui.shared.characters', { count: charCount })}</span>
      </div>

      <p className="small text-secondary mb-4">{t(`tools.ui.jsonConverter.hints.${pair}`)}</p>

      <Row className="g-4">
        <Col md={6}>
          <Form.Label className="fw-bold">
            {t(`tools.ui.jsonConverter.formats.${inputFormatKey}`)} {t('tools.ui.jsonConverter.inputSuffix')}
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={14}
            placeholder={t('tools.ui.jsonConverter.inputPlaceholder')}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setFileName('');
            }}
            className={`font-monospace small tool-code-input ${status.valid === false ? 'tool-input-invalid' : ''}`}
          />
        </Col>
        <Col md={6}>
          <Form.Label className="fw-bold">
            {t(`tools.ui.jsonConverter.formats.${outputFormatKey}`)} {t('tools.ui.jsonConverter.outputSuffix')}
          </Form.Label>
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
          {t('tools.ui.jsonConverter.convert')}
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

export default JsonConverterHub;
