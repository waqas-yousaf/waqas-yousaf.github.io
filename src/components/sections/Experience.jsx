import { useTranslation } from 'react-i18next';
import Badge from 'react-bootstrap/Badge';
import MaterialIcon from '../common/MaterialIcon';
import { useWorkHistory } from '../../hooks/useLocalizedContent';

const roleIcons = {
  gip: 'layers',
  wish: 'flight_takeoff',
  sorcim: 'dns',
  kdk: 'bolt',
  wizgates: 'school',
};

function getPeriodParts(period) {
  const [start, end] = period.split(' - ');
  return { start: start?.trim(), end: end?.trim(), isCurrent: end?.includes('Present') };
}

function Experience() {
  const { t } = useTranslation();
  const workHistory = useWorkHistory();

  return (
    <section id="experience" className="experience-section py-5">
      <div className="container-fluid px-3 px-md-5">
        <div className="text-center mb-5">
          <p className="experience-eyebrow text-uppercase small fw-semibold mb-2">{t('experience.eyebrow')}</p>
          <h2 className="display-6 fw-bold mb-3 experience-heading">
            {t('experience.heading').replace(t('experience.headingHighlight'), '').trim()}{' '}
            <span className="text-primary">{t('experience.headingHighlight')}</span>
          </h2>
          <p className="experience-intro mx-auto mb-0">{t('experience.intro')}</p>
        </div>

        <ol className="timeline list-unstyled mb-0">
          {workHistory.map((job, index) => {
            const { start, end, isCurrent } = getPeriodParts(job.period);
            const isLeft = index % 2 === 0;

            return (
              <li
                key={job.id}
                className={`timeline-entry ${isLeft ? 'timeline-entry-left' : 'timeline-entry-right'} ${isCurrent ? 'timeline-entry-current' : ''}`}
              >
                <div className="timeline-entry-content">
                  <article className="timeline-card">
                    <div className="timeline-card-header">
                      <div className="timeline-card-icon" aria-hidden="true">
                        <MaterialIcon name={roleIcons[job.id] || 'work'} />
                      </div>
                      <div className="timeline-card-meta">
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                          <span className="timeline-period">{start}</span>
                          <MaterialIcon name="arrow_forward" className="timeline-period-arrow" />
                          <span className={`timeline-period ${isCurrent ? 'timeline-period-live' : ''}`}>{end}</span>
                          {isCurrent ? <Badge className="timeline-live-badge">{t('experience.current')}</Badge> : null}
                        </div>
                        <h3 className="h5 fw-bold mb-1">{job.role}</h3>
                        <p className="timeline-company mb-0">{job.company}</p>
                      </div>
                    </div>

                    <ul className="timeline-details list-unstyled small mb-3">
                      <li>
                        <MaterialIcon name="work" className="me-2" />
                        {job.employmentType}
                      </li>
                      <li>
                        <MaterialIcon name="location_on" className="me-2" />
                        {job.location}
                      </li>
                    </ul>

                    <p className="timeline-description small mb-3">{job.description}</p>

                    <div className="d-flex flex-wrap gap-1">
                      {job.skills.slice(0, 5).map((skill) => (
                        <Badge key={skill} className="timeline-skill-badge">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </article>
                </div>

                <div className="timeline-entry-marker" aria-hidden="true">
                  <span className="timeline-marker-ring" />
                  <span className="timeline-marker-core" />
                </div>

                <div className="timeline-entry-spacer" aria-hidden="true" />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default Experience;
