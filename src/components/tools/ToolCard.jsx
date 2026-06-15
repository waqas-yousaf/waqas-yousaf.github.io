import { useTranslation } from 'react-i18next';
import Col from 'react-bootstrap/Col';
import MaterialIcon from '../common/MaterialIcon';

function ToolCard({ tool, colProps = { xs: 12, md: 6, lg: 3 }, variant = 'default' }) {
  const { t } = useTranslation();
  const isLanding = variant === 'landing';
  const visibleFeatures = isLanding ? tool.features.slice(0, 3) : tool.features;

  return (
    <Col {...colProps}>
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`tool-feature-card glass-card h-100 d-flex flex-column text-decoration-none${isLanding ? ' tool-feature-card-landing' : ''}`}
        aria-label={t('tools.layout.openToolAria', { title: tool.longTitle })}
      >
        <div className="tool-feature-card-top">
          <div className="tool-feature-icon-wrap">
            <MaterialIcon name={tool.icon} className={`${tool.iconColor || 'text-primary'} fs-3`} />
          </div>
          <span className="tool-card-category">{tool.category}</span>
        </div>

        <h3 className={`fw-bold mb-2 text-dark ${isLanding ? 'h5' : 'h6'}`}>{tool.longTitle}</h3>
        <p className={`text-secondary mb-3 flex-grow-1 ${isLanding ? 'small' : 'small'}`}>
          {isLanding ? tool.description : tool.seoDescription}
        </p>

        <ul className="tool-feature-list list-unstyled mb-3">
          {visibleFeatures.map((feature) => (
            <li key={feature} className="small">
              <MaterialIcon name="check" className="text-primary me-2" />
              {feature}
            </li>
          ))}
        </ul>

        <span className="tool-open-link mt-auto">
          {t('tools.layout.openTool')}
          <MaterialIcon name="open_in_new" className="ms-2" />
        </span>
      </a>
    </Col>
  );
}

export default ToolCard;
