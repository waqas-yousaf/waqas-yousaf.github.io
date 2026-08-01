import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { GitHubCalendar } from 'react-github-calendar';
import ProtectedEmail from '../common/ProtectedEmail';
import LocaleLink from '../common/LocaleLink';
import BrandIcon from '../common/BrandIcon';
import MaterialIcon from '../common/MaterialIcon';
import Waves from '../common/Waves';
import { ABOUT_PATH } from '../../data/about';
import { GITHUB_URL, GITHUB_USERNAME } from '../../config/site';

const calendarTheme = {
  light: ['#ffffff', '#fee2e2', '#fca5a5', '#f87171', '#ef4444'], // Red scale
  dark: ['#1c1917', '#450a0a', '#7f1d1d', '#b91c1c', '#f87171'], // Bauhaus dark red scale
};

function Hero() {
  const { t } = useTranslation();
  const roles = useMemo(() => t('hero.roles', { returnObjects: true }), [t]);
  const [roleIndex, setRoleIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!roles.length) return undefined;
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section id="hero" className="hero-section page-top-offset">
      <Waves
        lineColor="#fff"
        backgroundColor="rgba(255, 255, 255, 0.2)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />

      <Container className="hero-container py-5">
        <Row className="justify-content-center text-center">
          <Col lg={8} md={10}>
            <div className={`hero-copy ${mounted ? 'hero-copy-visible' : ''}`}>
              <h1 className="hero-title hero-stagger" style={{ '--i': 2 }}>
                {t('hero.greeting')}{' '}
                <span className="hero-name">{t('hero.name')}</span>
              </h1>

              <p className="hero-role-line hero-stagger" style={{ '--i': 3 }}>
                {t('hero.roleLine', { role: roles[roleIndex] })}
              </p>

              <div className="hero-actions hero-stagger justify-content-center" style={{ '--i': 6 }}>
                <Button
                  as={LocaleLink}
                  to={ABOUT_PATH}
                  variant="outline-primary"
                  size="lg"
                  className="hero-btn-outline rounded-pill px-4"
                >
                  {t('hero.moreAboutMe')}
                </Button>
              </div>

              <div className="hero-social hero-stagger justify-content-center mb-4" style={{ '--i': 7 }}>
                <a href="https://github.com/waqas-yousaf" target="_blank" rel="noopener noreferrer" aria-label={t('hero.socialGitHub')}>
                  <BrandIcon name="github" />
                </a>
                <a href="https://linkedin.com/in/waqasbiz" target="_blank" rel="noopener noreferrer" aria-label={t('hero.socialLinkedIn')}>
                  <BrandIcon name="linkedin" />
                </a>
                <a href="https://x.com/imakewebapps" target="_blank" rel="noopener noreferrer" aria-label={t('hero.socialTwitter')}>
                  <BrandIcon name="x" />
                </a>
                <ProtectedEmail variant="icon" />
              </div>
            </div>
          </Col>
        </Row>

        {/* GitHub Contributions Section integrated into Hero */}
        <Row className="justify-content-center mt-4">
          <Col lg={10} xl={9}>
            <div className={`hero-github-card hero-stagger ${mounted ? 'hero-copy-visible' : ''}`} style={{ '--i': 8 }}>
              <div className="hero-github-card-header">
                <div className="hero-github-title-group">
                  <MaterialIcon name="code" className="text-white fs-5" />
                  <h2 className="hero-github-title">{t('github.heading')}</h2>
                </div>
                <div className="hero-github-status" title="Live status check">
                  <span className="hero-github-status-dot"></span>
                  <span>{t('github.eyebrow')}</span>
                </div>
              </div>

              <div
                className="hero-github-calendar"
                aria-label={t('github.calendarAria', { username: GITHUB_USERNAME })}
              >
                <GitHubCalendar
                  username={GITHUB_USERNAME}
                  colorScheme="dark"
                  theme={calendarTheme}
                  blockSize={11}
                  blockMargin={4}
                  fontSize={13}
                  labels={{
                    totalCount: t('github.totalCount'),
                  }}
                />
              </div>

              <div className="hero-github-footer">
                <p className="hero-github-text">
                  {t('github.dataSourced')}{' '}
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hero-github-username-link">
                    @{GITHUB_USERNAME}
                  </a>
                </p>
                <button
                  type="button"
                  onClick={() => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')}
                  className="hero-github-btn"
                >
                  <MaterialIcon name="open_in_new" className="me-1" />
                  {t('github.viewOnGitHub')}
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Hero;
