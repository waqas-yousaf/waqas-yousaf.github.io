import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import MaterialIcon from '../../common/MaterialIcon';

export const WELCOME_STORAGE_KEY = 'ayzal-studio-welcome-seen';

function ColorStudioSplash({ onGetStarted, onUpload }) {
  const { t } = useTranslation();

  return (
    <div className="image-color-splash" role="dialog" aria-modal="true" aria-labelledby="ayzal-splash-title">
      <div className="image-color-splash-card glass-card">
        <div className="image-color-splash-icon" aria-hidden="true">
          <MaterialIcon name="palette" />
        </div>
        <h1 id="ayzal-splash-title" className="h2 fw-bold mb-2">
          {t('tools.ui.imageColorStudio.splashTitle')}
        </h1>
        <p className="text-secondary mb-4">{t('tools.ui.imageColorStudio.splashSubtitle')}</p>

        <ul className="image-color-splash-features list-unstyled mb-4">
          {[
            { icon: 'colorize', key: 'splashFeaturePick' },
            { icon: 'gradient', key: 'splashFeaturePalette' },
            { icon: 'auto_awesome', key: 'splashFeatureCreative' },
            { icon: 'contrast', key: 'splashFeatureContrast' },
          ].map((feature) => (
            <li key={feature.key} className="image-color-splash-feature">
              <MaterialIcon name={feature.icon} className="me-2 text-primary" />
              {t(`tools.ui.imageColorStudio.${feature.key}`)}
            </li>
          ))}
        </ul>

        <div className="d-flex flex-wrap gap-2 justify-content-center">
          <Button variant="primary" className="rounded-pill px-4" onClick={onGetStarted}>
            <MaterialIcon name="arrow_forward" className="me-2" />
            {t('tools.ui.imageColorStudio.splashGetStarted')}
          </Button>
          <Button variant="outline-primary" className="rounded-pill px-4" onClick={onUpload}>
            <MaterialIcon name="upload" className="me-2" />
            {t('tools.ui.imageColorStudio.splashUpload')}
          </Button>
        </div>

        <p className="small text-secondary mt-4 mb-0">
          <MaterialIcon name="shield" className="me-1" />
          {t('tools.ui.imageColorStudio.studioPrivacy')}
        </p>
      </div>
    </div>
  );
}

export default ColorStudioSplash;
