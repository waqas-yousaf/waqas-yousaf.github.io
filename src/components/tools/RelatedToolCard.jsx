import { useTranslation } from 'react-i18next';
import MaterialIcon from '../common/MaterialIcon';
import LocaleLink from '../common/LocaleLink';

function RelatedToolCard({ tool }) {
  const { t } = useTranslation();

  return (
    <LocaleLink
      to={tool.path}
      className="tool-related-item"
      aria-label={t('tools.layout.openToolAria', { title: tool.longTitle })}
    >
      <div className="tool-related-item-icon">
        <MaterialIcon name={tool.icon} className={tool.iconColor || 'text-primary'} />
      </div>
      <div className="tool-related-item-body">
        <div className="tool-related-item-head">
          <h3 className="tool-related-item-title">{tool.title}</h3>
          <span className="tool-related-item-category">{tool.category}</span>
        </div>
        <p className="tool-related-item-desc">{tool.description}</p>
        <span className="tool-related-item-action">
          {t('tools.layout.openTool')}
          <MaterialIcon name="arrow_forward" className="ms-1" />
        </span>
      </div>
    </LocaleLink>
  );
}

export default RelatedToolCard;
