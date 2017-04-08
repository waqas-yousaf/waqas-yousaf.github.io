import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ToolLayout from './ToolLayout';
import CopyButton from './CopyButton';
import { generateLorem } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

const UNIT_LIMITS = {
  paragraphs: { min: 1, max: 20, default: 3 },
  sentences: { min: 1, max: 50, default: 5 },
  words: { min: 10, max: 500, default: 50 },
};

function LoremGenerator() {
  const { t } = useTranslation();
  const tool = useTool('lorem');
  const [unit, setUnit] = useState('paragraphs');
  const [count, setCount] = useState(UNIT_LIMITS.paragraphs.default);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [htmlOutput, setHtmlOutput] = useState(false);
  const [output, setOutput] = useState('');

  const limits = UNIT_LIMITS[unit];

  const clampCount = (value) => {
    const next = Number(value);
    if (Number.isNaN(next)) return limits.min;
    return Math.min(limits.max, Math.max(limits.min, next));
  };

  const handleUnitChange = (nextUnit) => {
    setUnit(nextUnit);
    setCount(UNIT_LIMITS[nextUnit].default);
  };

  const handleGenerate = () => {
    setOutput(
      generateLorem({
        unit,
        count: clampCount(count),
        startWithLorem,
        format: htmlOutput ? 'html' : 'plain',
      })
    );
  };

  const countLabel = useMemo(() => {
    if (unit === 'paragraphs') return t('tools.ui.lorem.unitParagraphs');
    if (unit === 'sentences') return t('tools.ui.lorem.unitSentences');
    return t('tools.ui.lorem.unitWords');
  }, [unit, t]);

  if (!tool) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <Form.Group>
            <Form.Label className="fw-bold">{t('tools.ui.lorem.unit')}</Form.Label>
            <Form.Select value={unit} onChange={(event) => handleUnitChange(event.target.value)}>
              <option value="paragraphs">{t('tools.ui.lorem.unitParagraphs')}</option>
              <option value="sentences">{t('tools.ui.lorem.unitSentences')}</option>
              <option value="words">{t('tools.ui.lorem.unitWords')}</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group>
            <Form.Label className="fw-bold">
              {t('tools.ui.lorem.count')} ({countLabel})
            </Form.Label>
            <Form.Control
              type="number"
              min={limits.min}
              max={limits.max}
              value={count}
              onChange={(event) => setCount(clampCount(event.target.value))}
            />
          </Form.Group>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className={`tool-option-card ${startWithLorem ? 'tool-option-card-active' : ''}`}>
            <Form.Check
              type="checkbox"
              id="lorem-start"
              label={t('tools.ui.lorem.startWithLorem')}
              checked={startWithLorem}
              onChange={(event) => setStartWithLorem(event.target.checked)}
            />
          </label>
        </div>
        <div className="col-md-6">
          <label className={`tool-option-card ${htmlOutput ? 'tool-option-card-active' : ''}`}>
            <Form.Check
              type="checkbox"
              id="lorem-html"
              label={t('tools.ui.lorem.htmlOutput')}
              checked={htmlOutput}
              onChange={(event) => setHtmlOutput(event.target.checked)}
            />
          </label>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
        <Button variant="primary" className="rounded-pill" onClick={handleGenerate}>
          {t('tools.ui.shared.generate')}
        </Button>
        <CopyButton text={output} label={t('tools.ui.shared.copy')} variant="outline-primary" />
      </div>

      <Form.Control as="textarea" rows={12} readOnly value={output} className="tool-code-input leading-relaxed" />
    </ToolLayout>
  );
}

export default LoremGenerator;
