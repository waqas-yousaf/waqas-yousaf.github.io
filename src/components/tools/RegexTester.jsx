import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToolLayout from './ToolLayout';
import ToolStatus from './ToolStatus';
import MaterialIcon from '../common/MaterialIcon';
import RegexHelper from './RegexHelper';
import { buildPatternFromRules, DEFAULT_REGEX_BUILDER_RULES } from '../../utils/regexBuilder';
import { safeTestRegex } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

function RegexTester() {
  const { t } = useTranslation();
  const tool = useTool('regex');
  const [mode, setMode] = useState('helper');
  const [pattern, setPattern] = useState(() => buildPatternFromRules(DEFAULT_REGEX_BUILDER_RULES));
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [input, setInput] = useState('Hello world\nhello regex tester');

  const flagString = `${flags.g ? 'g' : ''}${flags.i ? 'i' : ''}${flags.m ? 'm' : ''}`;
  const result = useMemo(() => safeTestRegex(pattern, flagString, input), [pattern, flagString, input]);

  const statusMessage = result.error
    || (pattern
      ? t('helpers.regex.matchCount', { count: result.matchCount })
      : t('helpers.regex.enterPatternShort'));

  if (!tool) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <ButtonGroup className="mb-4 regex-mode-toggle">
        <Button
          variant={mode === 'helper' ? 'primary' : 'outline-primary'}
          className="rounded-pill me-2"
          onClick={() => setMode('helper')}
        >
          <MaterialIcon name="auto_fix_high" className="me-1" />
          {t('tools.ui.regexHelper.modeHelper')}
        </Button>
        <Button
          variant={mode === 'advanced' ? 'primary' : 'outline-primary'}
          className="rounded-pill"
          onClick={() => setMode('advanced')}
        >
          <MaterialIcon name="code" className="me-1" />
          {t('tools.ui.regexHelper.modeAdvanced')}
        </Button>
      </ButtonGroup>

      {mode === 'helper' ? (
        <RegexHelper
          pattern={pattern}
          onPatternChange={setPattern}
          onFlagsChange={setFlags}
          onSampleText={setInput}
        />
      ) : (
        <>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">{t('tools.ui.regex.regularExpression')}</Form.Label>
            <p className="small text-secondary mb-2">{t('tools.ui.regex.advancedHint')}</p>
            <Form.Control
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              placeholder={t('tools.ui.regex.patternPlaceholder')}
              className="font-monospace tool-code-input"
            />
          </Form.Group>
        </>
      )}

      <div className="d-flex flex-wrap gap-3 mb-4 mt-4">
        {[
          ['g', 'tools.ui.regex.global'],
          ['i', 'tools.ui.regex.ignoreCase'],
          ['m', 'tools.ui.regex.multiline'],
        ].map(([key, labelKey]) => (
          <Form.Check
            key={key}
            type="checkbox"
            id={`flag-${key}`}
            label={t(labelKey)}
            checked={flags[key]}
            onChange={(event) => setFlags((prev) => ({ ...prev, [key]: event.target.checked }))}
          />
        ))}
      </div>

      <Row className="g-4">
        <Col md={6}>
          <Form.Label className="fw-bold">{t('tools.ui.regex.testString')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="tool-code-input font-monospace small"
          />
        </Col>
        <Col md={6}>
          <Form.Label className="fw-bold">{t('tools.ui.regex.matches')}</Form.Label>
          <ToolStatus
            valid={result.error ? false : pattern ? true : null}
            message={statusMessage}
          />
          <div className="tool-match-list mt-3">
            {result.matches.length ? (
              result.matches.map((match, index) => (
                <div key={`${match}-${index}`} className="tool-match-item font-monospace small">
                  {match}
                </div>
              ))
            ) : (
              <p className="small text-secondary mb-0">{t('tools.ui.regex.noMatchesYet')}</p>
            )}
          </div>
        </Col>
      </Row>
    </ToolLayout>
  );
}

export default RegexTester;
