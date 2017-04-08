import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import MaterialIcon from '../common/MaterialIcon';
import ToolLayout from './ToolLayout';
import ToolTabNav from './ToolTabNav';
import CopyButton from './CopyButton';
import PasswordStrength from './PasswordStrength';
import { generateFunnyPassword, generateMemorablePassword, generatePassword } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

const DEFAULT_OPTIONS = {
  useUpper: true,
  useLower: true,
  useNumbers: true,
  useSymbols: false,
};

const DEFAULT_MEMORABLE_OPTIONS = {
  wordCount: 3,
  separator: '-',
  capitalize: true,
  includeNumber: true,
};

const DEFAULT_FUNNY_OPTIONS = {
  wordCount: 3,
  separator: '-',
  capitalize: true,
  includeNumber: false,
  includeSymbol: false,
};

function PasswordGenerator() {
  const { t } = useTranslation();
  const tool = useTool('password');

  const createRandomPassword = (length, options) =>
    generatePassword(length, options) || t('tools.ui.password.selectOneSet');

  const [mode, setMode] = useState('funny');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [memorableOptions, setMemorableOptions] = useState(DEFAULT_MEMORABLE_OPTIONS);
  const [funnyOptions, setFunnyOptions] = useState(DEFAULT_FUNNY_OPTIONS);
  const [password, setPassword] = useState(() => generateFunnyPassword(DEFAULT_FUNNY_OPTIONS));

  const regenerate = (
    nextMode = mode,
    len = length,
    opts = options,
    memorableOpts = memorableOptions,
    funnyOpts = funnyOptions
  ) => {
    if (nextMode === 'memorable') {
      setPassword(generateMemorablePassword(memorableOpts));
      return;
    }

    if (nextMode === 'funny') {
      setPassword(generateFunnyPassword(funnyOpts));
      return;
    }

    setPassword(createRandomPassword(Number(len), opts));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    regenerate(nextMode, length, options, memorableOptions, funnyOptions);
  };

  const updateOption = (key, value) => {
    const next = { ...options, [key]: value };
    setOptions(next);
    regenerate('random', length, next, memorableOptions, funnyOptions);
  };

  const updateMemorableOption = (key, value) => {
    const next = { ...memorableOptions, [key]: value };
    setMemorableOptions(next);
    regenerate('memorable', length, options, next, funnyOptions);
  };

  const updateFunnyOption = (key, value) => {
    const next = { ...funnyOptions, [key]: value };
    setFunnyOptions(next);
    regenerate('funny', length, options, memorableOptions, next);
  };

  const tabs = useMemo(
    () => [
      { id: 'funny',  label: t('tools.ui.password.funny') },
      { id: 'random',  label: t('tools.ui.password.secureRandom') },
      { id: 'memorable',  label: t('tools.ui.password.easyToRemember') },
    ],
    [t]
  );

  const hintKey =
    mode === 'memorable'
      ? 'tools.ui.password.memorableHint'
      : mode === 'funny'
        ? 'tools.ui.password.funnyHint'
        : 'tools.ui.password.randomHint';

  if (!tool) return null;

  return (
    <ToolLayout
      toolId={tool.id}
      icon={tool.icon}
      title={tool.longTitle}
      description={tool.seoDescription}
      contentCol={{ xs: 12, md: 8, lg: 8 }}
    >
      <div className="password-generator">
        <ToolTabNav
          tabs={tabs}
          activeTab={mode}
          onTabChange={switchMode}
          ariaLabel={t('tools.ui.password.tabNavAria')}
          className="password-generator-tab-nav mb-2"
        />

        <div className={`password-generator-hero glass-card password-generator-hero--${mode}`}>
          <div className="password-generator-hero-top">
            <Form.Control
              readOnly
              value={password}
              className="password-generator-output font-monospace"
              aria-label={t('tools.ui.password.generatedPasswordAria')}
            />
            <CopyButton text={password} label={t('tools.ui.shared.copy')} />
          </div>

          <PasswordStrength password={password} />

          <div className="password-generator-hero-footer">
            <p className="password-generator-hint small mb-0">{t(hintKey)}</p>
            <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => regenerate()}>
              <MaterialIcon name="refresh" className="me-2" />
              {t('tools.ui.shared.regenerate')}
            </Button>
          </div>
        </div>

        <div className="password-generator-options glass-card">
          {mode === 'random' ? (
            <>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  {t('tools.ui.password.passwordLength')}{' '}
                  <span className="text-primary">{length}</span>
                </Form.Label>
                <Form.Range
                  min={8}
                  max={64}
                  value={length}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    setLength(next);
                    regenerate('random', next, options, memorableOptions, funnyOptions);
                  }}
                />
              </Form.Group>
              <div className="row g-3">
                {[
                  ['useUpper', 'tools.ui.password.uppercase'],
                  ['useLower', 'tools.ui.password.lowercase'],
                  ['useNumbers', 'tools.ui.password.numbers'],
                  ['useSymbols', 'tools.ui.password.symbols'],
                ].map(([key, labelKey]) => (
                  <div key={key} className="col-md-6">
                    <label className={`tool-option-card ${options[key] ? 'tool-option-card-active' : ''}`}>
                      <Form.Check
                        type="checkbox"
                        id={key}
                        label={t(labelKey)}
                        checked={options[key]}
                        onChange={(event) => updateOption(key, event.target.checked)}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {mode === 'memorable' ? (
            <>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  {t('tools.ui.password.wordCount')}{' '}
                  <span className="text-primary">{memorableOptions.wordCount}</span>
                </Form.Label>
                <Form.Range
                  min={3}
                  max={6}
                  value={memorableOptions.wordCount}
                  onChange={(event) => updateMemorableOption('wordCount', Number(event.target.value))}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">{t('tools.ui.password.separator')}</Form.Label>
                <Form.Select
                  value={memorableOptions.separator}
                  onChange={(event) => updateMemorableOption('separator', event.target.value)}
                  style={{ maxWidth: 220 }}
                >
                  <option value="-">{t('tools.ui.password.separatorHyphen')}</option>
                  <option value="_">{t('tools.ui.password.separatorUnderscore')}</option>
                  <option value=".">{t('tools.ui.password.separatorDot')}</option>
                  <option value=" ">{t('tools.ui.password.separatorSpace')}</option>
                </Form.Select>
              </Form.Group>

              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    className={`tool-option-card ${memorableOptions.capitalize ? 'tool-option-card-active' : ''}`}
                  >
                    <Form.Check
                      type="checkbox"
                      id="memorable-capitalize"
                      label={t('tools.ui.password.capitalizeWords')}
                      checked={memorableOptions.capitalize}
                      onChange={(event) => updateMemorableOption('capitalize', event.target.checked)}
                    />
                  </label>
                </div>
                <div className="col-md-6">
                  <label
                    className={`tool-option-card ${memorableOptions.includeNumber ? 'tool-option-card-active' : ''}`}
                  >
                    <Form.Check
                      type="checkbox"
                      id="memorable-number"
                      label={t('tools.ui.password.includeNumberSuffix')}
                      checked={memorableOptions.includeNumber}
                      onChange={(event) => updateMemorableOption('includeNumber', event.target.checked)}
                    />
                  </label>
                </div>
              </div>
            </>
          ) : null}

          {mode === 'funny' ? (
            <>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  {t('tools.ui.password.wordCount')}{' '}
                  <span className="text-primary">{funnyOptions.wordCount}</span>
                </Form.Label>
                <Form.Range
                  min={3}
                  max={6}
                  value={funnyOptions.wordCount}
                  onChange={(event) => updateFunnyOption('wordCount', Number(event.target.value))}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">{t('tools.ui.password.separator')}</Form.Label>
                <Form.Select
                  value={funnyOptions.separator}
                  onChange={(event) => updateFunnyOption('separator', event.target.value)}
                  style={{ maxWidth: 220 }}
                >
                  <option value="">{t('tools.ui.password.separatorNone')}</option>
                  <option value="-">{t('tools.ui.password.separatorHyphen')}</option>
                  <option value="_">{t('tools.ui.password.separatorUnderscore')}</option>
                  <option value=".">{t('tools.ui.password.separatorDot')}</option>
                  <option value=" ">{t('tools.ui.password.separatorSpace')}</option>
                </Form.Select>
              </Form.Group>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className={`tool-option-card ${funnyOptions.capitalize ? 'tool-option-card-active' : ''}`}>
                    <Form.Check
                      type="checkbox"
                      id="funny-capitalize"
                      label={t('tools.ui.password.capitalizeWords')}
                      checked={funnyOptions.capitalize}
                      onChange={(event) => updateFunnyOption('capitalize', event.target.checked)}
                    />
                  </label>
                </div>
                <div className="col-md-6">
                  <label className={`tool-option-card ${funnyOptions.includeNumber ? 'tool-option-card-active' : ''}`}>
                    <Form.Check
                      type="checkbox"
                      id="funny-number"
                      label={t('tools.ui.password.includeNumberSuffix')}
                      checked={funnyOptions.includeNumber}
                      onChange={(event) => updateFunnyOption('includeNumber', event.target.checked)}
                    />
                  </label>
                </div>
                <div className="col-md-6">
                  <label className={`tool-option-card ${funnyOptions.includeSymbol ? 'tool-option-card-active' : ''}`}>
                    <Form.Check
                      type="checkbox"
                      id="funny-symbol"
                      label={t('tools.ui.password.includeSymbolSuffix')}
                      checked={funnyOptions.includeSymbol}
                      onChange={(event) => updateFunnyOption('includeSymbol', event.target.checked)}
                    />
                  </label>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="tool-action-bar mt-4">
          <CopyButton text={password} label={t('tools.ui.password.copyPassword')} variant="primary" />
        </div>
      </div>
    </ToolLayout>
  );
}

export default PasswordGenerator;
