import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import ToolLayout from './ToolLayout';
import CopyButton from './CopyButton';
import {
  dateToTimestamp,
  dateToTimestampMs,
  formatTimestampVariants,
} from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

function TimestampRow({ label, value }) {
  return (
    <div className="timestamp-result-row">
      <span className="timestamp-result-label">{label}</span>
      <InputGroup size="sm">
        <Form.Control readOnly value={value || ''} className="font-monospace tool-output-field" />
        <CopyButton text={value} />
      </InputGroup>
    </div>
  );
}

function TimestampConverter() {
  const { t } = useTranslation();
  const tool = useTool('timestamp');
  const [now, setNow] = useState(() => Date.now());
  const [tsInput, setTsInput] = useState('');
  const [dateInput, setDateInput] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentSeconds = Math.floor(now / 1000);
  const currentMilliseconds = now;

  const tsVariants = useMemo(() => {
    if (!tsInput.trim()) return null;
    return formatTimestampVariants(tsInput.trim());
  }, [tsInput]);

  const dateSeconds = dateInput ? String(dateToTimestamp(dateInput)) : '';
  const dateMilliseconds = dateInput ? String(dateToTimestampMs(dateInput)) : '';

  if (!tool) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <div className="tool-live-clock text-center mb-4">
        <p className="small fw-semibold mb-2">{t('tools.ui.timestamp.currentEpoch')}</p>
        <div className="d-flex flex-wrap justify-content-center gap-4 mb-2">
          <div>
            <p className="small text-secondary mb-1">{t('tools.ui.timestamp.seconds')}</p>
            <div className="tool-live-clock-value">{currentSeconds}</div>
          </div>
          <div>
            <p className="small text-secondary mb-1">{t('tools.ui.timestamp.milliseconds')}</p>
            <div className="tool-live-clock-value">{currentMilliseconds}</div>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <CopyButton text={String(currentSeconds)} label={t('tools.ui.timestamp.copySeconds')} variant="outline-primary" />
          <CopyButton
            text={String(currentMilliseconds)}
            label={t('tools.ui.timestamp.copyMilliseconds')}
            variant="outline-primary"
          />
          <Button variant="link" size="sm" className="p-0" onClick={() => setTsInput(String(currentSeconds))}>
            {t('tools.ui.timestamp.useCurrent')}
          </Button>
        </div>
      </div>

      <hr className="border-primary border-opacity-25" />

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">{t('tools.ui.timestamp.timestampToDate')}</Form.Label>
        <Form.Control
          type="text"
          inputMode="numeric"
          placeholder={t('tools.ui.timestamp.timestampPlaceholder')}
          value={tsInput}
          onChange={(event) => setTsInput(event.target.value)}
          className="font-monospace tool-code-input mb-3"
        />
        {tsInput && !tsVariants ? (
          <div className="tool-result-box">{t('tools.ui.timestamp.invalidTimestamp')}</div>
        ) : null}
        {tsVariants ? (
          <div className="timestamp-results-grid">
            <TimestampRow label={t('tools.ui.timestamp.seconds')} value={String(tsVariants.seconds)} />
            <TimestampRow label={t('tools.ui.timestamp.milliseconds')} value={String(tsVariants.milliseconds)} />
            <TimestampRow label={t('tools.ui.timestamp.utc')} value={tsVariants.utc} />
            <TimestampRow label={t('tools.ui.timestamp.local')} value={tsVariants.local} />
            <TimestampRow label={t('tools.ui.timestamp.iso8601')} value={tsVariants.iso8601} />
            <TimestampRow label={t('tools.ui.timestamp.relative')} value={tsVariants.relative} />
          </div>
        ) : null}
      </Form.Group>

      <Form.Group>
        <Form.Label className="fw-bold">{t('tools.ui.timestamp.dateToTimestamp')}</Form.Label>
        <Form.Control
          type="datetime-local"
          value={dateInput}
          onChange={(event) => setDateInput(event.target.value)}
          className="font-monospace tool-code-input mb-3"
        />
        {dateInput ? (
          <div className="timestamp-results-grid">
            <TimestampRow label={t('tools.ui.timestamp.seconds')} value={dateSeconds} />
            <TimestampRow label={t('tools.ui.timestamp.milliseconds')} value={dateMilliseconds} />
          </div>
        ) : null}
      </Form.Group>
    </ToolLayout>
  );
}

export default TimestampConverter;
