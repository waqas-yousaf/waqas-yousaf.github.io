import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToolLayout from './ToolLayout';
import CopyButton from './CopyButton';
import MaterialIcon from '../common/MaterialIcon';
import { getBrowserInfo } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

function InfoRow({ label, value }) {
  return (
    <div className="browser-info-row">
      <span className="browser-info-label">{label}</span>
      <code className="browser-info-value">{value || '—'}</code>
      <CopyButton text={value} />
    </div>
  );
}

function BrowserInfo() {
  const { t, i18n } = useTranslation();
  const tool = useTool('browser-info');
  const browserInfo = useMemo(() => getBrowserInfo(), [i18n.language]);

  const copyAllText = [
    t('tools.ui.browserInfo.copyAllSectionBrowser'),
    t('tools.ui.browserInfo.copyBrowser', { value: browserInfo.browserName }),
    t('tools.ui.browserInfo.copyUserAgent', { value: browserInfo.userAgent }),
    t('tools.ui.browserInfo.copyLanguage', { value: browserInfo.language }),
    t('tools.ui.browserInfo.copyPlatform', { value: browserInfo.platform }),
    t('tools.ui.browserInfo.copyTimezone', { value: browserInfo.timezone }),
    t('tools.ui.browserInfo.copyScreen', { value: browserInfo.screenSize }),
    t('tools.ui.browserInfo.copyViewport', { value: browserInfo.viewport }),
  ].join('\n');

  if (!tool) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
        <p className="small text-secondary mb-0">{t('tools.ui.browserInfo.intro')}</p>
        <CopyButton text={copyAllText} label={t('tools.ui.shared.copyAll')} variant="outline-primary" />
      </div>

      <Row className="g-4">
        <Col lg={12}>
          <div className="browser-info-card glass-card p-4 h-100">
            <h2 className="h6 fw-bold mb-3">
              <MaterialIcon name="devices" className="me-2 text-primary" />
              {t('tools.ui.browserInfo.browserDevice')}
            </h2>
            <InfoRow label={t('helpers.browserInfo.browser')} value={browserInfo.browserName} />
            <InfoRow label={t('helpers.browserInfo.userAgent')} value={browserInfo.userAgent} />
            <InfoRow label={t('helpers.browserInfo.language')} value={browserInfo.language} />
            <InfoRow label={t('helpers.browserInfo.languages')} value={browserInfo.languages} />
            <InfoRow label={t('helpers.browserInfo.platform')} value={browserInfo.platform} />
            <InfoRow label={t('helpers.browserInfo.timezone')} value={browserInfo.timezone} />
            <InfoRow label={t('helpers.browserInfo.screen')} value={browserInfo.screenSize} />
            <InfoRow label={t('helpers.browserInfo.viewport')} value={browserInfo.viewport} />
            <InfoRow label={t('helpers.browserInfo.pixelRatio')} value={browserInfo.pixelRatio} />
            <InfoRow label={t('helpers.browserInfo.cookiesEnabled')} value={browserInfo.cookiesEnabled} />
            <InfoRow label={t('helpers.browserInfo.online')} value={browserInfo.online} />
          </div>
        </Col>
      </Row>
    </ToolLayout>
  );
}

export default BrowserInfo;
