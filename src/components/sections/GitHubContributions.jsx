import { useTranslation } from 'react-i18next';
import { GitHubCalendar } from 'react-github-calendar';
import MaterialIcon from '../common/MaterialIcon';
import { GITHUB_URL, GITHUB_USERNAME } from '../../config/site';

const calendarTheme = {
  light: ['#ffffff', '#fee2e2', '#fca5a5', '#f87171', '#ef4444'], // Red scale
  dark: ['#1c1917', '#450a0a', '#7f1d1d', '#b91c1c', '#f87171'],
};

function GitHubContributions() {
  const { t } = useTranslation();

  return (
    <section id="github" className="github-contributions-section py-5" aria-labelledby="github-contributions-heading">
      <div className="container-fluid px-3 px-md-5">
        <div className="text-center mb-4 mb-md-5">
          <p className="github-contributions-eyebrow text-uppercase small fw-semibold mb-2">{t('github.eyebrow')}</p>
          <h2 id="github-contributions-heading" className="display-6 fw-bold mb-3">
            {t('github.heading').replace(t('github.headingHighlight'), '').trim()}{' '}
            <span className="text-primary">{t('github.headingHighlight')}</span>
          </h2>
          <p className="github-contributions-intro mx-auto mb-0">{t('github.intro')}</p>
        </div>

        <div className="github-contributions-card glass-card p-0" style={{ overflow: 'hidden' }}>
          <div className="package-card-header-band" style={{ backgroundColor: 'var(--accent-color)', height: '12px', borderBottom: '4px solid #121212' }} />
          
          <div className="p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <MaterialIcon name="code" className="text-dark fs-5" />
                <h3 className="h6 fw-bold mb-0 text-dark" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('github.heading')}
                </h3>
              </div>
              <div className="hero-github-status" title="Live status check" style={{ color: '#16a34a' }}>
                <span className="hero-github-status-dot" style={{ backgroundColor: '#16a34a', boxShadow: '0 0 8px #16a34a' }}></span>
                <span className="small fw-semibold">{t('github.eyebrow')}</span>
              </div>
            </div>

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

            <div className="github-contributions-footer d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4 pt-3 border-top border-dark">
              <p className="small text-secondary mb-0 fw-semibold">
                {t('github.dataSourced')}{' '}
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="github-contributions-link" style={{ color: 'var(--accent-color)' }}>
                  @{GITHUB_USERNAME}
                </a>
              </p>
              
              <button
                type="button"
                onClick={() => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')}
                className="opensource-filter-btn"
                style={{ padding: '0.4rem 1.2rem', fontSize: '0.78rem' }}
              >
                <MaterialIcon name="open_in_new" className="me-1" />
                {t('github.viewOnGitHub')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GitHubContributions;
