import Container from 'react-bootstrap/Container';
import { companies } from '../../data/companies';

const carouselItems = [...companies, ...companies];

function CompaniesCarousel() {
  return (
    <section className="companies-carousel-section" aria-labelledby="companies-carousel-heading">
      <Container>
        <div className="companies-carousel-header text-center">
          <h2 id="companies-carousel-heading" className="h5 fw-bold mb-0">

          </h2>
        </div>
      </Container>

      <div className="companies-carousel" aria-hidden="false">
        <div className="companies-carousel-track">
          {carouselItems.map((company, index) => (
            <a
              key={`${company.id}-${index}`}
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="companies-carousel-item"
              aria-label={company.name}
              title={company.name}
            >
              <img src={company.logo} alt={company.name} loading="lazy" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CompaniesCarousel;
