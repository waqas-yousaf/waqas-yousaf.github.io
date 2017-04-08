import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { copyProtectedEmail, openProtectedEmail } from '../../utils/emailProtection';
import MaterialIcon from './MaterialIcon';
import { SITE_NAME } from '../../config/site';

function ProtectedEmail({ variant = 'icon', className = '', linkClassName = '' }) {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpen = () => {
    openProtectedEmail();
  };

  const handleReveal = async () => {
    if (revealed) {
      handleOpen();
      return;
    }
    setRevealed(true);
  };

  const handleCopy = async (event) => {
    event.stopPropagation();
    await copyProtectedEmail();
    setCopied(true);
    setRevealed(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        className={`protected-email-btn ${className}`}
        onClick={handleOpen}
        aria-label={t('protectedEmail.sendEmailAria', { name: SITE_NAME })}
        title={t('protectedEmail.sendEmailTitle')}
      >
        <MaterialIcon name="mail" />
      </button>
    );
  }

  if (variant === 'link') {
    return (
      <button type="button" className={`protected-email-link ${linkClassName}`} onClick={handleOpen}>
        <MaterialIcon name="mail" className="me-2" />
        {t('protectedEmail.emailMe')}
      </button>
    );
  }

  return (
    <span className={`protected-email-reveal ${className}`}>
      <button type="button" className={`protected-email-link ${linkClassName}`} onClick={handleReveal}>
        <MaterialIcon name="mail" className="me-2" />
      </button>
      {revealed ? (
        <span className="protected-email-actions">
          <button type="button" className="protected-email-copy" onClick={handleCopy}>
            {t('protectedEmail.copy')}
          </button>
          <span className="protected-email-mask" aria-live="polite">
            {copied ? t('tools.ui.shared.copied') : 'waqas(a)wishdd.com'}
          </span>
        </span>
      ) : null}
    </span>
  );
}

export default ProtectedEmail;
