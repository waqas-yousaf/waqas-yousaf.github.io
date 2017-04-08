import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToolLayout from './ToolLayout';
import ToolTabNav from './ToolTabNav';
import CopyButton from './CopyButton';
import ToolStatus from './ToolStatus';
import MaterialIcon from '../common/MaterialIcon';
import { encodeBase64, decodeBase64, hashText } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

const HASH_ALGORITHMS = ['SHA-256', 'SHA-384', 'SHA-512'];

function Base64Converter() {
  const { t } = useTranslation();
  const tool = useTool('base64');
  const [activeTab, setActiveTab] = useState('base64');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [live, setLive] = useState(true);
  const [error, setError] = useState('');
  const [hashInput, setHashInput] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [hashOutput, setHashOutput] = useState('');
  const [hashLoading, setHashLoading] = useState(false);

  const modeLabel = mode === 'encode' ? t('tools.ui.shared.encode') : t('tools.ui.shared.decode');

  const tabs = [
    {
      id: 'base64',
      icon: 'code',
      label: t('tools.ui.base64.tabBase64'),
      hint: t('tools.ui.base64.tabBase64Hint'),
    },
    {
      id: 'hash',
      icon: 'tag',
      label: t('tools.ui.base64.tabHash'),
      hint: t('tools.ui.base64.tabHashHint'),
    },
  ];

  useEffect(() => {
    if (!live || !input) {
      if (!input) setOutput('');
      return undefined;
    }

    try {
      setError('');
      setOutput(mode === 'encode' ? encodeBase64(input) : decodeBase64(input));
    } catch {
      setError(t('tools.ui.base64.invalidInput', { mode: modeLabel }));
      setOutput('');
    }

    return undefined;
  }, [input, mode, live, modeLabel, t]);

  useEffect(() => {
    if (!hashInput) {
      setHashOutput('');
      return undefined;
    }

    setHashLoading(true);
    const timer = setTimeout(async () => {
      try {
        const hash = await hashText(hashInput, algorithm);
        setHashOutput(hash);
      } catch {
        setHashOutput(t('tools.ui.uuidHash.hashError'));
      } finally {
        setHashLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [hashInput, algorithm, t]);

  const handleAction = (action) => {
    const actionLabel = action === 'encode' ? t('tools.ui.shared.encode') : t('tools.ui.shared.decode');

    try {
      setError('');
      setOutput(action === 'encode' ? encodeBase64(input) : decodeBase64(input));
    } catch {
      setError(t('tools.ui.base64.invalidInput', { mode: actionLabel }));
      setOutput('');
    }
  };

  const swapFields = () => {
    setInput(output);
    setOutput(input);
    setError('');
  };

  if (!tool) return null;

  const hashStatusMessage = hashLoading
    ? t('tools.ui.uuidHash.hashing')
    : hashInput
      ? t('tools.ui.uuidHash.hashReady', { algorithm })
      : t('tools.ui.uuidHash.enterTextToHash');

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <ToolTabNav
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ariaLabel={t('tools.ui.base64.tabNavAria')}
      />

      {activeTab === 'base64' ? (
        <div
          className="tool-tab-panel"
          role="tabpanel"
          id="tool-tabpanel-base64"
          aria-labelledby="tool-tab-base64"
        >
          <div className="base64-toolbar">
            <div className="base64-mode-pills" role="group" aria-label={t('tools.ui.base64.modeGroupAria')}>
              <button
                type="button"
                className={`base64-mode-pill${mode === 'encode' ? ' is-active' : ''}`}
                onClick={() => setMode('encode')}
              >
                <MaterialIcon name="north_east" />
                {t('tools.ui.shared.encode')}
              </button>
              <button
                type="button"
                className={`base64-mode-pill${mode === 'decode' ? ' is-active' : ''}`}
                onClick={() => setMode('decode')}
              >
                <MaterialIcon name="south_west" />
                {t('tools.ui.shared.decode')}
              </button>
            </div>

            <Form.Check
              type="switch"
              id="base64-live"
              className="base64-live-switch"
              label={t('tools.ui.base64.liveConversion')}
              checked={live}
              onChange={(event) => setLive(event.target.checked)}
            />
          </div>

          <Row className="g-3 g-lg-4">
            <Col lg={6}>
              <div className="tool-io-panel">
                <div className="tool-io-panel-header">
                  <span className="tool-io-panel-title">
                    <MaterialIcon name="input" />
                    {t('tools.ui.shared.input')}
                  </span>
                  <span className="tool-io-panel-meta">{t('tools.ui.shared.characters', { count: input.length })}</span>
                </div>
                <Form.Control
                  as="textarea"
                  rows={12}
                  placeholder={t('tools.ui.base64.inputPlaceholder')}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="font-monospace small tool-code-input tool-io-textarea"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="tool-io-panel">
                <div className="tool-io-panel-header">
                  <span className="tool-io-panel-title">
                    <MaterialIcon name="output" />
                    {t('tools.ui.shared.output')}
                  </span>
                  {error ? (
                    <span className="tool-io-panel-meta tool-io-panel-meta-error">{error}</span>
                  ) : (
                    <span className="tool-io-panel-meta">{t('tools.ui.shared.characters', { count: output.length })}</span>
                  )}
                </div>
                <Form.Control
                  as="textarea"
                  rows={12}
                  readOnly
                  value={error || output}
                  className={`font-monospace small tool-code-input tool-io-textarea ${error ? 'tool-input-invalid' : ''}`}
                />
              </div>
            </Col>
          </Row>

          <div className="tool-action-bar">
            {!live ? (
              <Button variant="primary" className="rounded-pill" onClick={() => handleAction(mode)}>
                {mode === 'encode' ? t('tools.ui.base64.runEncode') : t('tools.ui.base64.runDecode')}
              </Button>
            ) : null}
            <Button variant="outline-secondary" className="rounded-pill" onClick={swapFields}>
              <MaterialIcon name="swap_horiz" className="me-2" />
              {t('tools.ui.shared.swap')}
            </Button>
            <CopyButton text={output} label={t('tools.ui.shared.copyOutput')} variant="outline-primary" />
          </div>
        </div>
      ) : (
        <div
          className="tool-tab-panel"
          role="tabpanel"
          id="tool-tabpanel-hash"
          aria-labelledby="tool-tab-hash"
        >
          <p className="base64-hash-intro">{t('tools.ui.base64.hashHint')}</p>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold me-2">{t('tools.ui.shared.algorithm')}</Form.Label>
            <div className="hash-algo-pills" role="group" aria-label={t('tools.ui.shared.algorithm')}>
              {HASH_ALGORITHMS.map((algo) => (
                <button
                  key={algo}
                  type="button"
                  className={`hash-algo-pill${algorithm === algo ? ' is-active' : ''}`}
                  onClick={() => setAlgorithm(algo)}
                >
                  {algo}
                </button>
              ))}
            </div>
          </Form.Group>

          <div className="tool-io-panel mb-3">
            <div className="tool-io-panel-header">
              <span className="tool-io-panel-title">
                <MaterialIcon name="edit_note" />
                {t('tools.ui.uuidHash.inputText')}
              </span>
              <span className="tool-io-panel-meta">{t('tools.ui.shared.characters', { count: hashInput.length })}</span>
            </div>
            <Form.Control
              as="textarea"
              rows={7}
              placeholder={t('tools.ui.uuidHash.hashPlaceholder')}
              value={hashInput}
              onChange={(event) => setHashInput(event.target.value)}
              className="tool-code-input font-monospace small tool-io-textarea"
            />
          </div>

          <ToolStatus valid={hashInput ? true : null} message={hashStatusMessage} />

          <div className="tool-io-panel mt-4">
            <div className="tool-io-panel-header">
              <span className="tool-io-panel-title">
                <MaterialIcon name="fingerprint" />
                {t('tools.ui.uuidHash.hashOutput')}
              </span>
              <span className="tool-io-panel-meta">{algorithm}</span>
            </div>
            <div className="d-flex gap-2">
              <Form.Control readOnly value={hashOutput} className="font-monospace small tool-output-field" />
              <CopyButton text={hashOutput} />
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}

export default Base64Converter;
