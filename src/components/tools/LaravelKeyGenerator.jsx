import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Badge from 'react-bootstrap/Badge';
import ToolLayout from './ToolLayout';
import AppKeySelect from './AppKeySelect';
import CopyButton from './CopyButton';
import MaterialIcon from '../common/MaterialIcon';
import {
  SERVICE_KEY_COUNT,
  generateAppKey,
  generateServiceKeys,
  isServiceKeyGenerator,
  isValidAppKeyGeneratorId,
} from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';
import { useLocalizedPath } from '../../i18n/useLocale';

const DEFAULT_GENERATOR_ID = 'laravel';

const APP_ICONS = {
  laravel: 'terminal',
  symfony: 'extension',
  adonisjs: 'terminal',
  craftcms: 'brush',
  django: 'code',
  flask: 'science',
  fastapi: 'speed',
  express: 'bolt',
  nestjs: 'hub',
  nextjs: 'web',
  nuxt: 'web',
  remix: 'route',
  sveltekit: 'bolt',
  strapi: 'database',
  rails: 'directions_railway',
  phoenix: 'local_fire_department',
  spring: 'coffee',
  aspnet: 'window',
  wordpress: 'article',
  genericHex128: 'tag',
  genericHex256: 'tag',
  genericBase64: 'data_object',
  genericBase64Url: 'lock',
  genericApiKey: 'key',
  oauthClient: 'vpn_key',
  uuid: 'fingerprint',
  apiKey: 'key',
  hex128: 'tag',
  hex256: 'tag',
  jwtSecret: 'lock',
  mongoObjectId: 'storage',
  wifiWpa: 'wifi',
};

function LaravelKeyGenerator() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();
  const { app: appSlug } = useParams();
  const tool = useTool('laravel-key');
  const initialId = appSlug && isValidAppKeyGeneratorId(appSlug) ? appSlug : DEFAULT_GENERATOR_ID;
  const [selectedId, setSelectedId] = useState(initialId);
  const [appKey, setAppKey] = useState(() => generateAppKey(initialId));
  const [serviceValues, setServiceValues] = useState(() =>
    isServiceKeyGenerator(initialId)
      ? generateServiceKeys(initialId, SERVICE_KEY_COUNT)
      : generateServiceKeys('uuid', SERVICE_KEY_COUNT)
  );
  const [wifiLength, setWifiLength] = useState(16);

  const isService = isServiceKeyGenerator(selectedId);

  const envHint = useMemo(
    () => (isService ? null : t(`tools.ui.appKeys.envHints.${selectedId}`, { key: appKey })),
    [t, selectedId, appKey, isService]
  );

  const syncUrl = useCallback(
    (nextId) => {
      if (!tool) return;
      navigate(localizedPath(`${tool.path}/${nextId}`), { replace: true });
    },
    [localizedPath, navigate, tool]
  );

  const applySelection = useCallback(
    (nextId, options = {}) => {
      const { syncRoute = true } = options;
      setSelectedId(nextId);

      if (isServiceKeyGenerator(nextId)) {
        setServiceValues(
          generateServiceKeys(nextId, SERVICE_KEY_COUNT, nextId === 'wifiWpa' ? { length: wifiLength } : {})
        );
      } else {
        setAppKey(generateAppKey(nextId));
      }

      if (syncRoute) {
        syncUrl(nextId);
      }
    },
    [syncUrl, wifiLength]
  );

  useEffect(() => {
    if (!appSlug) return;

    if (!isValidAppKeyGeneratorId(appSlug)) {
      navigate(localizedPath(tool?.path || '/tools/app-key-generator'), { replace: true });
      return;
    }

    if (appSlug !== selectedId) {
      applySelection(appSlug, { syncRoute: false });
    }
  }, [appSlug, applySelection, localizedPath, navigate, selectedId, tool?.path]);

  const handleSelectionChange = useCallback(
    (nextId) => {
      applySelection(nextId);
    },
    [applySelection]
  );

  const handleRegenerate = () => {
    if (isService) {
      setServiceValues(
        generateServiceKeys(selectedId, SERVICE_KEY_COUNT, selectedId === 'wifiWpa' ? { length: wifiLength } : {})
      );
      return;
    }

    setAppKey(generateAppKey(selectedId));
  };

  const handleWifiLengthChange = (length) => {
    setWifiLength(length);
    if (selectedId === 'wifiWpa') {
      setServiceValues(generateServiceKeys('wifiWpa', SERVICE_KEY_COUNT, { length }));
    }
  };

  if (!tool) return null;

  const icon = APP_ICONS[selectedId] || 'vpn_key';
  const title = isService
    ? t(`tools.ui.uuidHash.secretTypes.${selectedId}`)
    : t(`tools.ui.appKeys.apps.${selectedId}.title`);
  const hint = isService
    ? t(`tools.ui.uuidHash.secretHints.${selectedId}`)
    : t(`tools.ui.appKeys.apps.${selectedId}.hint`);
  const formatLabel = isService
    ? t(`tools.ui.appKeys.serviceFormats.${selectedId}`)
    : t(`tools.ui.appKeys.apps.${selectedId}.format`);
  const copyAllText = isService ? serviceValues.join('\n') : appKey;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} iconClass={tool.iconColor} title={tool.longTitle} description={tool.seoDescription}>
      <section className="app-key-generator" aria-labelledby="secrets-generator-heading">
        <h2 id="secrets-generator-heading" className="fs-6 mb-2">

          {t('tools.ui.appKeys.sectionHint')}
        </h2>


        <Form.Group className="col-12 col-md-9 col-lg-6 mb-4 app-key-select-wrap">

          <AppKeySelect
            value={selectedId}
            className="app-key-select"
            onChange={handleSelectionChange}
            ariaLabel={t('tools.ui.appKeys.selectType')}
          />
        </Form.Group>

        <article className="generator-service-card app-key-card app-key-panel">
          <header className="generator-service-card-header">
            <MaterialIcon name={icon} className="generator-service-card-icon text-primary" />
            <div>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                <h3 className="h6 fw-bold mb-0">{title}</h3>
                <Badge className="tool-category-badge">{formatLabel}</Badge>
              </div>
              <p className="small text-secondary mb-0">{hint}</p>
            </div>
          </header>

          {isService && selectedId === 'wifiWpa' ? (
            <Form.Group className="generator-service-card-option">
              <Form.Label className="fw-bold small mb-1">
                {t('tools.ui.uuidHash.wifiLength')} <span className="text-primary">{wifiLength}</span>
              </Form.Label>
              <Form.Range min={8} max={63} value={wifiLength} onChange={(event) => handleWifiLengthChange(Number(event.target.value))} />
            </Form.Group>
          ) : null}

          {isService ? (
            <div className="generator-service-keys">
              {serviceValues.map((value, index) => (
                <div key={`${selectedId}-${index}`} className="generator-service-key-row">
                  <span className="generator-service-key-index">{index + 1}</span>
                  <Form.Control readOnly value={value} className="font-monospace small tool-output-field" />
                  <CopyButton text={value} />
                </div>
              ))}
            </div>
          ) : (
            <>
              <Form.Label className="fw-bold small">{t('tools.ui.appKeys.generatedKey')}</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control readOnly value={appKey} className="font-monospace small tool-output-field" />
                <CopyButton text={appKey} />
              </InputGroup>

              <Form.Label className="fw-bold small">{t('tools.ui.appKeys.envLine')}</Form.Label>
              <p className="small text-secondary mb-0 app-key-env-hint">
                <MaterialIcon name="settings" className="me-1" />
                {envHint}
              </p>
            </>
          )}

          <div className="generator-service-card-actions mt-3">
            <Button variant="primary" className="rounded-pill" onClick={handleRegenerate}>
              <MaterialIcon name="refresh" className="me-2" />
              {isService ? t('tools.ui.uuidHash.regenerateService') : t('tools.ui.appKeys.regenerateKey')}
            </Button>
            {isService ? (
              <CopyButton text={copyAllText} label={t('tools.ui.uuidHash.copyServiceKeys')} variant="outline-primary" />
            ) : (
              <>
                <CopyButton text={envHint} label={t('tools.ui.appKeys.copyEnvLine')} variant="outline-primary" />
                <CopyButton text={appKey} label={t('tools.ui.appKeys.copyKeyOnly')} variant="outline-secondary" />
              </>
            )}
          </div>
        </article>
      </section>
    </ToolLayout>
  );
}

export default LaravelKeyGenerator;
