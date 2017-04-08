import { useTranslation } from 'react-i18next';
import MaterialIcon from '../common/MaterialIcon';

function WhatsAppFab() {
  const { t } = useTranslation();

  return (
    <a
      href="https://wa.me/4917683081592"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label={t('whatsapp.ariaLabel')}
    >
      <MaterialIcon name="chat" />
    </a>
  );
}

export default WhatsAppFab;
