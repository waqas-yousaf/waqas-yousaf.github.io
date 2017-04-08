import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import MaterialIcon from '../common/MaterialIcon';
import { copyToClipboard } from '../../utils/toolHelpers';

function CopyButton({ text, label, variant = 'primary', disabled = false }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (label) {
    return (
      <Button variant={variant} className="" onClick={handleCopy} disabled={disabled || !text}>
        {copied ? <MaterialIcon name="check" className="me-2" /> : null}
        {copied ? t('tools.ui.shared.copied') : label}
      </Button>
    );
  }

  return (
    <Button variant={variant} onClick={handleCopy} title={t('tools.ui.shared.copy')} disabled={disabled || !text}>
      <MaterialIcon name={copied ? 'check' : 'content_copy'} className={copied ? 'text-success' : ''} />
    </Button>
  );
}

export default CopyButton;
