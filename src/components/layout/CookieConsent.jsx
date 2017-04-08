import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import MaterialIcon from '../common/MaterialIcon';
import LocaleLink from '../common/LocaleLink';
import { PRIVACY_PATH } from '../../data/legal';
import { applyStoredConsent, hasConsentDecision, saveCookieConsent } from '../../utils/cookieConsent';

function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    applyStoredConsent();
    setVisible(!hasConsentDecision());
  }, []);

  const handleChoice = (choice) => {
    saveCookieConsent(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-labelledby="cookie-consent-title" aria-live="polite">
      <div className="cookie-consent-panel glass-card">
        <div className="cookie-consent-icon" aria-hidden="true">
          <MaterialIcon name="cookie" />
        </div>
        <div className="cookie-consent-body">
          <h2 id="cookie-consent-title" className="h6 fw-bold mb-2">
            {t('cookie.title')}
          </h2>
          <p className="small text-secondary mb-0">
            {t('cookie.description')}{' '}
            <LocaleLink to={PRIVACY_PATH}>{t('cookie.privacyLink')}</LocaleLink>.
          </p>
        </div>
        <div className="cookie-consent-actions">
          <Button variant="outline-primary" className="rounded-pill" onClick={() => handleChoice('essential')}>
            {t('cookie.essentialOnly')}
          </Button>
          <Button variant="primary" className="rounded-pill cookie-consent-accept" onClick={() => handleChoice('all')}>
            {t('cookie.acceptAll')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
