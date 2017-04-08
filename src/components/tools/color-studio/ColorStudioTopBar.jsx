import { useTranslation } from 'react-i18next';
import MaterialIcon from '../../common/MaterialIcon';
import LocaleLink from '../../common/LocaleLink';
import { TOOLS_PATH } from '../../../data/tools';

function ColorStudioTopBar({ title, imageName, status }) {
  const { t } = useTranslation();

  return (
    <header className="image-color-studio-topbar">
      <div className="image-color-studio-topbar-start">
        <LocaleLink to={TOOLS_PATH} className="image-color-studio-back">
          <MaterialIcon name="arrow_back" />
          <span>{t('tools.ui.imageColorStudio.studioBack')}</span>
        </LocaleLink>
        <h1 className="image-color-studio-title h5 fw-bold mb-0">{title}</h1>
      </div>
      <div className="image-color-studio-topbar-end">
        <p className="small text-secondary mb-0 image-color-studio-status" role="status">
          {imageName ? <strong className="me-2">{imageName}</strong> : null}
          {status}
        </p>
      </div>
    </header>
  );
}

export default ColorStudioTopBar;
