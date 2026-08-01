import { useTranslation } from 'react-i18next';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MaterialIcon from '../common/MaterialIcon';
import { allTechnologies } from '../../data/skills';
import { useSkillStats, useSkillCategories, useEcosystemSkills } from '../../hooks/useLocalizedContent';

function SkillBar({ name, level }) {
  return (
    <div className="skills-bar-item">
      <div className="skills-bar-meta">
        <span className="skills-bar-label">{name}</span>
        <span className="skills-bar-value">{level}%</span>
      </div>
      <div className="skills-bar-track" role="presentation">
        <span className="skills-bar-fill" style={{ '--skill-level': `${level}%` }} />
      </div>
    </div>
  );
}

function Skills() {
  const { t } = useTranslation();
  const skillStats = useSkillStats();
  const skillCategories = useSkillCategories();
  const ecosystem = useEcosystemSkills();

  return (
    <section id="skills" className="skills-section py-5">
      <div className="skills-section-bg" aria-hidden="true" />

      <div className="container-fluid skills-section-inner px-3 px-md-5">
        <div className="text-center mb-5">
          <p className="skills-eyebrow text-uppercase small fw-semibold mb-2">{t('skills.eyebrow')}</p>
          <h2 className="display-6 fw-bold mb-3">
            {t('skills.heading').replace(t('skills.headingHighlight'), '').trim()}{' '}
            <span className="text-primary">{t('skills.headingHighlight')}</span>
          </h2>
          <p className="skills-intro mx-auto mb-0">{t('skills.intro')}</p>
        </div>

        <Row className="g-3 g-md-4 mb-5 skills-stats-row">
          {skillStats.map((stat) => (
            <Col key={stat.label} xs={6} lg={3}>
              <div className="skills-stat-card glass-card h-100">
                <MaterialIcon name={stat.icon} className="skills-stat-icon" />
                <span className="skills-stat-value">{stat.value}</span>
                <span className="skills-stat-label">{stat.label}</span>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="g-4 mb-5">
          {skillCategories.map((category) => (
            <Col key={category.id} md={6} xl={4}>
              <article className={`skills-category-card skills-accent-${category.accent}`}>
                <div className="skills-category-header">
                  <div className="skills-category-icon">
                    <MaterialIcon name={category.icon} />
                  </div>
                  <div>
                    <h3 className="h5 fw-bold mb-1">{category.title}</h3>
                    <p className="skills-category-summary mb-0">{category.summary}</p>
                  </div>
                </div>

                <div className="skills-category-bars">
                  {category.coreSkills.map((skill) => (
                    <SkillBar key={skill.name} name={skill.name} level={skill.level} />
                  ))}
                </div>

                <div className="skills-chip-row">
                  {category.technologies.map((tech) => (
                    <span key={tech} className="skills-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            </Col>
          ))}
        </Row>

        <div className="skills-ecosystem glass-card">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h3 className="h5 fw-bold mb-1">{ecosystem.title}</h3>
              <p className="skills-ecosystem-desc mb-0">{ecosystem.description}</p>
            </div>
            <span className="skills-ecosystem-count">{ecosystem.countLabel}</span>
          </div>
          <div className="skills-ecosystem-grid">
            {allTechnologies.map((tech) => (
              <span key={tech} className="skills-ecosystem-chip">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
