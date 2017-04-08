import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import CopyButton from './CopyButton';
import MaterialIcon from '../common/MaterialIcon';
import {
  DEFAULT_REGEX_BUILDER_RULES,
  REGEX_PRESET_IDS,
  buildPatternFromRules,
  describeRules,
  getPresetById,
  rulesToFlags,
} from '../../utils/regexBuilder';

function RegexHelper({ pattern, onPatternChange, onFlagsChange, onSampleText }) {
  const { t } = useTranslation();
  const [rules, setRules] = useState(DEFAULT_REGEX_BUILDER_RULES);
  const [activePreset, setActivePreset] = useState(null);

  const builtPattern = useMemo(() => buildPatternFromRules(rules), [rules]);
  const summary = useMemo(() => describeRules(rules, t), [rules, t]);

  useEffect(() => {
    if (activePreset) return;
    onPatternChange(builtPattern);
    onFlagsChange(rulesToFlags(rules));
  }, [activePreset, builtPattern, rules, onPatternChange, onFlagsChange]);

  const updateRule = (key, value) => {
    setActivePreset(null);
    setRules((prev) => ({ ...prev, [key]: value }));
  };

  const handlePreset = (presetId) => {
    const preset = getPresetById(presetId);
    if (!preset) return;

    setActivePreset(presetId);
    onPatternChange(preset.pattern);
    onFlagsChange(preset.defaultFlags);
    onSampleText(preset.sampleText);
  };

  const showBuilderPattern = !activePreset;

  return (
    <div className="regex-helper">
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">{t('tools.ui.regexHelper.presets')}</Form.Label>
        <p className="small text-secondary mb-3">{t('tools.ui.regexHelper.presetsHint')}</p>
        <div className="regex-helper-presets">
          {REGEX_PRESET_IDS.map((presetId) => (
            <Button
              key={presetId}
              variant={activePreset === presetId ? 'primary' : 'outline-primary'}
              size="sm"
              className="rounded-pill"
              onClick={() => handlePreset(presetId)}
            >
              {t(`tools.ui.regexHelper.presetLabels.${presetId}`)}
            </Button>
          ))}
        </div>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">{t('tools.ui.regexHelper.buildYourOwn')}</Form.Label>
        <p className="small text-secondary mb-3">{t('tools.ui.regexHelper.buildHint')}</p>

        <div className="row g-3">
          <div className="col-md-6">
            <Form.Label className="small fw-bold">{t('tools.ui.regexHelper.matchType')}</Form.Label>
            <Form.Select
              value={rules.matchType}
              onChange={(event) => updateRule('matchType', event.target.value)}
            >
              {['anything', 'letters', 'numbers', 'alphanumeric', 'spaces', 'wordChars'].map((type) => (
                <option key={type} value={type}>
                  {t(`tools.ui.regexHelper.matchTypes.${type}`)}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="col-md-6">
            <Form.Label className="small fw-bold">{t('tools.ui.regexHelper.length')}</Form.Label>
            <Form.Select
              value={rules.lengthType}
              onChange={(event) => updateRule('lengthType', event.target.value)}
            >
              {['any', 'exact', 'min', 'max', 'between'].map((type) => (
                <option key={type} value={type}>
                  {t(`tools.ui.regexHelper.lengthTypes.${type}`)}
                </option>
              ))}
            </Form.Select>
          </div>

          {rules.lengthType === 'exact' ? (
            <div className="col-md-4">
              <Form.Label className="small fw-bold">{t('tools.ui.regexHelper.lengthExact')}</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={999}
                value={rules.lengthExact}
                onChange={(event) => updateRule('lengthExact', event.target.value)}
              />
            </div>
          ) : null}

          {rules.lengthType === 'min' || rules.lengthType === 'between' ? (
            <div className="col-md-4">
              <Form.Label className="small fw-bold">{t('tools.ui.regexHelper.lengthMin')}</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={999}
                value={rules.lengthMin}
                onChange={(event) => updateRule('lengthMin', event.target.value)}
              />
            </div>
          ) : null}

          {rules.lengthType === 'max' || rules.lengthType === 'between' ? (
            <div className="col-md-4">
              <Form.Label className="small fw-bold">{t('tools.ui.regexHelper.lengthMax')}</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={999}
                value={rules.lengthMax}
                onChange={(event) => updateRule('lengthMax', event.target.value)}
              />
            </div>
          ) : null}

          <div className="col-md-4">
            <Form.Label className="small fw-bold">{t('tools.ui.regexHelper.startsWith')}</Form.Label>
            <Form.Control
              value={rules.startsWith}
              placeholder={t('tools.ui.regexHelper.optional')}
              onChange={(event) => updateRule('startsWith', event.target.value)}
            />
          </div>

          <div className="col-md-4">
            <Form.Label className="small fw-bold">{t('tools.ui.regexHelper.endsWith')}</Form.Label>
            <Form.Control
              value={rules.endsWith}
              placeholder={t('tools.ui.regexHelper.optional')}
              onChange={(event) => updateRule('endsWith', event.target.value)}
            />
          </div>

          <div className="col-md-4">
            <Form.Label className="small fw-bold">{t('tools.ui.regexHelper.contains')}</Form.Label>
            <Form.Control
              value={rules.contains}
              placeholder={t('tools.ui.regexHelper.optional')}
              onChange={(event) => updateRule('contains', event.target.value)}
            />
          </div>

          <div className="col-12 d-flex flex-wrap gap-3">
            <label className={`tool-option-card ${rules.wholeText ? 'tool-option-card-active' : ''}`}>
              <Form.Check
                type="checkbox"
                id="regex-whole-text"
                label={t('tools.ui.regexHelper.wholeText')}
                checked={rules.wholeText}
                onChange={(event) => updateRule('wholeText', event.target.checked)}
              />
            </label>
            <label className={`tool-option-card ${rules.ignoreCase ? 'tool-option-card-active' : ''}`}>
              <Form.Check
                type="checkbox"
                id="regex-ignore-case"
                label={t('tools.ui.regexHelper.ignoreCase')}
                checked={rules.ignoreCase}
                onChange={(event) => updateRule('ignoreCase', event.target.checked)}
              />
            </label>
          </div>
        </div>
      </Form.Group>

      {showBuilderPattern ? (
        <>
          <div className="regex-helper-summary mb-3">
            <MaterialIcon name="info" className="me-2 text-primary" />
            <span>{summary}</span>
          </div>

          <Form.Group>
            <Form.Label className="fw-bold">{t('tools.ui.regexHelper.generatedPattern')}</Form.Label>
            <InputGroup>
              <Form.Control readOnly value={builtPattern} className="font-monospace small tool-output-field" />
              <CopyButton text={builtPattern} label={t('tools.ui.regexHelper.copyPattern')} />
            </InputGroup>
          </Form.Group>
        </>
      ) : (
        <div className="regex-helper-summary mb-3">
          <MaterialIcon name="check_circle" className="me-2 text-primary" />
          <span>
            {t('tools.ui.regexHelper.presetActive', {
              preset: t(`tools.ui.regexHelper.presetLabels.${activePreset}`),
            })}
          </span>
          <p className="small text-secondary mb-0 mt-2 font-monospace">{pattern}</p>
        </div>
      )}
    </div>
  );
}

export default RegexHelper;
