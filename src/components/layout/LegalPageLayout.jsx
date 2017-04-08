import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import MaterialIcon from '../common/MaterialIcon';
import LocaleLink from '../common/LocaleLink';

function LegalSection({ section }) {
  const paragraphs = Array.isArray(section.paragraphs) ? section.paragraphs : [];
  const list = Array.isArray(section.list) ? section.list : null;

  return (
    <section className="legal-section">
      <h2 className="h4 fw-bold mb-3">{section.title}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 32)} className="text-secondary mb-3">
          {paragraph}
        </p>
      ))}
      {list?.length ? (
        <ul className="legal-list text-secondary">
          {list.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function LegalPageLayout({ eyebrow, title, intro, sections }) {
  const { t } = useTranslation();

  return (
    <main className="legal-page page-top-offset">
      <Container className="py-5" style={{ maxWidth: 860 }}>
        <nav aria-label="Breadcrumb" className="legal-breadcrumb mb-4">
          <LocaleLink to="/" className="legal-back-link">
            <MaterialIcon name="arrow_back" />
            {t('legal.backHome')}
          </LocaleLink>
        </nav>

        <p className="legal-eyebrow text-uppercase small fw-semibold mb-2">{eyebrow}</p>
        <h1 className="display-6 fw-bold mb-3">{title}</h1>
        {intro ? <p className="lead text-secondary mb-5">{intro}</p> : null}

        <div className="legal-content glass-card p-4 p-md-5">
          {sections.map((section) => (
            <LegalSection key={section.title} section={section} />
          ))}
        </div>
      </Container>
    </main>
  );
}

export default LegalPageLayout;
