import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ProtectedEmail from '../common/ProtectedEmail';
import MaterialIcon from '../common/MaterialIcon';
import LocaleLink from '../common/LocaleLink';
import { ABOUT_PATH } from '../../data/about';

const FALLBACK_TERMINAL_LINES = [
  'grep -r "works on my machine" ./',
  'git commit -m "fixed bug (trust me bro)"',
  'npm install --legacy-peer-deps --no-questions-asked',
  'php artisan migrate --force --no-regrets',
  'kubectl rollout undo deploy/api # proactive rollback',
];

function shuffleArray(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

const FLOATING_TAGS = [
  { icon: 'terminal', label: 'Laravel' },
  { icon: 'device_hub', label: 'Postgres' },
  { icon: 'cloud', label: 'AWS' },
  { icon: 'code', label: 'React' },
  { icon: 'layers', label: 'Docker' },
];

function Hero() {
  const { t, i18n } = useTranslation();
  const roles = useMemo(() => t('hero.roles', { returnObjects: true }), [t]);
  const [roleIndex, setRoleIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [mounted, setMounted] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const commandPool = useMemo(() => {
    const commands = t('hero.terminalLines', { returnObjects: true });
    return Array.isArray(commands) && commands.length ? commands : FALLBACK_TERMINAL_LINES;
  }, [t, i18n.language]);

  const buildTerminalSession = useCallback(() => {
    const minCommands = Math.min(4, commandPool.length);
    const maxCommands = Math.min(6, commandPool.length);
    const commandCount = minCommands + Math.floor(Math.random() * (maxCommands - minCommands + 1));
    const pickedCommands = shuffleArray(commandPool).slice(0, commandCount);

    return [
      ...pickedCommands.map((text) => ({ prompt: '$', text, status: 'run' })),
      { prompt: '✓', text: t('hero.terminalOk'), status: 'ok' },
    ];
  }, [commandPool, t]);

  const terminalLines = useMemo(() => buildTerminalSession(), [buildTerminalSession, sessionKey]);

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

  useEffect(() => {
    const line = terminalLines[lineIndex];
    let charIndex = 0;
    setTypedText('');

    const typeInterval = setInterval(() => {
      charIndex += 1;
      setTypedText(line.text.slice(0, charIndex));
      if (charIndex >= line.text.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setLineIndex((prev) => {
            if (prev >= terminalLines.length - 1) {
              setSessionKey((current) => current + 1);
              return 0;
            }

            return prev + 1;
          });
        }, 1800);
      }
    }, 45);

    return () => clearInterval(typeInterval);
  }, [lineIndex, terminalLines]);

  const activeLine = terminalLines[lineIndex];

  return (
    <section id="hero" className="hero-section page-top-offset">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>

      <Container className="hero-container py-5">
        <Row className="align-items-center g-5">
          <Col lg={6} className="p-0">
            <div className={`hero-copy ${mounted ? 'hero-copy-visible' : ''}`}>
              <span className="hero-badge hero-stagger" style={{ '--i': 0 }}>
                <span className="hero-badge-dot" />
                {t('hero.badge')}
              </span>

              <h1 className="hero-title hero-stagger" style={{ '--i': 2 }}>
                {t('hero.greeting')}{' '}
                <span className="hero-name">{t('hero.name')}</span>
              </h1>

              <p className="hero-role-line hero-stagger" style={{ '--i': 3 }}>
                {t('hero.roleLine', { role: roles[roleIndex] })}
              </p>

              <div className="hero-actions hero-stagger" style={{ '--i': 6 }}>
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

              <div className="hero-social hero-stagger" style={{ '--i': 7 }}>
                <a href="https://github.com/waqas-yousaf" target="_blank" rel="noopener noreferrer" aria-label={t('hero.socialGitHub')}>
                  <MaterialIcon name="code" />
                </a>
                <a href="https://linkedin.com/in/waqasbiz" target="_blank" rel="noopener noreferrer" aria-label={t('hero.socialLinkedIn')}>
                  <MaterialIcon name="work" />
                </a>
                <a href="https://x.com/imakewebapps" target="_blank" rel="noopener noreferrer" aria-label={t('hero.socialTwitter')}>
                  <MaterialIcon name="tag" />
                </a>
                <ProtectedEmail variant="icon" />
              </div>
            </div>
          </Col>

          <Col lg={6}>
            <div className={`hero-visual ${mounted ? 'hero-visual-visible' : ''}`}>
              <div className="hero-terminal">
                <div className="hero-terminal-bar">
                  <span className="hero-terminal-dot hero-terminal-dot-red" />
                  <span className="hero-terminal-dot hero-terminal-dot-yellow" />
                  <span className="hero-terminal-dot hero-terminal-dot-green" />
                  <span className="hero-terminal-title">{t('hero.terminalTitle')}</span>
                </div>
                <div className="hero-terminal-body">
                  {terminalLines.slice(0, lineIndex).map((line, idx) => (
                    <div key={`${line.text}-${idx}`} className="hero-terminal-line hero-terminal-line-done">
                      <span className="hero-terminal-prompt">{line.prompt}</span>
                      <span className={line.status === 'ok' ? 'hero-terminal-ok' : ''}>{line.text}</span>
                    </div>
                  ))}
                  <div className="hero-terminal-line hero-terminal-line-active">
                    <span className="hero-terminal-prompt">{activeLine.prompt}</span>
                    <span className={activeLine.status === 'ok' ? 'hero-terminal-ok' : ''}>{typedText}</span>
                    <span className="hero-terminal-cursor" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="hero-float-tags">
                {FLOATING_TAGS.map((tag) => (
                  <div key={tag.label} className="hero-float-tag mt-5">
                    <MaterialIcon name={tag.icon} />
                    {tag.label}
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Hero;
