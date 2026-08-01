import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ProtectedEmail from '../common/ProtectedEmail';
import LocaleLink from '../common/LocaleLink';
import BrandIcon from '../common/BrandIcon';
import Waves from '../common/Waves';
import { ABOUT_PATH } from '../../data/about';

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

      <div className="container-fluid hero-container px-3 px-md-5 py-5">
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
      </div>
    </section>
  );
}

export default Hero;
