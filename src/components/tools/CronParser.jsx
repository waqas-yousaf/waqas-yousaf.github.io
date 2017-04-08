import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ToolLayout from './ToolLayout';
import ToolStatus from './ToolStatus';
import { parseCronExpression } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

const PRESET_KEYS = [
  { labelKey: 'tools.ui.cron.every5Minutes', value: '*/5 * * * *' },
  { labelKey: 'tools.ui.cron.dailyMidnight', value: '0 0 * * *' },
  { labelKey: 'tools.ui.cron.weekdays9Am', value: '0 9 * * 1-5' },
  { labelKey: 'tools.ui.cron.monthlyFirst', value: '0 0 1 * *' },
];

function CronParser() {
  const { t, i18n } = useTranslation();
  const tool = useTool('cron');
  const [expression, setExpression] = useState('0 9 * * 1-5');
  const parsed = useMemo(() => parseCronExpression(expression), [expression, i18n.language]);

  if (!tool) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <ToolStatus valid={parsed.valid} message={parsed.message} />
      <Form.Group className="mt-3 mb-3">
        <Form.Label className="fw-bold">{t('tools.ui.cron.cronExpression')}</Form.Label>
        <Form.Control
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder={t('tools.ui.cron.expressionPlaceholder')}
          className="font-monospace tool-code-input fs-5"
        />
        <Form.Text>{t('tools.ui.cron.formatHint')}</Form.Text>
      </Form.Group>
      <div className="d-flex flex-wrap gap-2 mb-4">
        {PRESET_KEYS.map((preset) => (
          <Button
            key={preset.value}
            size="sm"
            variant="outline-primary"
            className="rounded-pill"
            onClick={() => setExpression(preset.value)}
          >
            {t(preset.labelKey)}
          </Button>
        ))}
      </div>
      {parsed.valid ? (
        <>
          <p className="fw-semibold mb-3">{parsed.summary}</p>
          <div className="tool-cron-grid">
            {parsed.fields.map((field) => (
              <div key={field.name} className="tool-cron-field">
                <span className="tool-cron-field-name">{field.name}</span>
                <code className="tool-cron-field-value">{field.value}</code>
                <span className="tool-cron-field-desc">{field.description}</span>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </ToolLayout>
  );
}

export default CronParser;
