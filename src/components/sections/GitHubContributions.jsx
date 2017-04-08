import { useTranslation } from 'react-i18next';
import { GitHubCalendar } from 'react-github-calendar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import MaterialIcon from '../common/MaterialIcon';
import { GITHUB_URL, GITHUB_USERNAME } from '../../config/site';

const calendarTheme = {
  light: ['#e8f1fb', '#b8daf7', '#7ab8f5', '#3d8fd9', '#1d4ed8'],
  dark: ['#1e293b', '#1e3a5f', '#2563eb', '#3b82f6', '#60a5fa'],
};

function GitHubContributions() {
  const { t } = useTranslation();

  return (
    <section id="github" className="github-contributions-section py-5" aria-labelledby="github-contributions-heading">
      <Container>
        <div className="text-center mb-4 mb-md-5">
          <p className="github-contributions-eyebrow text-uppercase small fw-semibold mb-2">{t('github.eyebrow')}</p>
          <h2 id="github-contributions-heading" className="display-6 fw-bold mb-3">
            {t('github.heading').replace(t('github.headingHighlight'), '').trim()}{' '}
            <span className="text-primary">{t('github.headingHighlight')}</span>
          </h2>
          <p className="github-contributions-intro mx-auto mb-0">{t('github.intro')}</p>
        </div>

        <div className="github-contributions-card glass-card p-3 p-md-4">
          <div
            className="github-contributions-calendar"
            aria-label={t('github.calendarAria', { username: GITHUB_USERNAME })}
          >
            <GitHubCalendar
              username={GITHUB_USERNAME}
              colorScheme="light"
              theme={calendarTheme}
              blockSize={12}
              blockMargin={4}
              fontSize={14}
              labels={{
                totalCount: t('github.totalCount'),
              }}
            />
          </div>

          <div className="github-contributions-footer d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4 pt-3">
            <p className="small text-secondary mb-0">
              {t('github.dataSourced')}{' '}
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="github-contributions-link">
                @{GITHUB_USERNAME}
              </a>
            </p>
            <Button
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-primary"
              className="rounded-pill px-4"
            >
              <MaterialIcon name="code" className="me-2" />
              {t('github.viewOnGitHub')}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default GitHubContributions;
