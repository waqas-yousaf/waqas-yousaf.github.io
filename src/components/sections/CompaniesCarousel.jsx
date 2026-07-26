import Container from 'react-bootstrap/Container';
import { companies } from '../../data/companies';
import LogoLoop from '../common/LogoLoop';

const logoItems = companies.map((company) => ({
  src: company.logo,
  alt: company.name,
  href: company.url,
  title: company.name,
}));

function CompaniesCarousel() {
  return (
    <section className="companies-carousel-section" aria-labelledby="companies-carousel-heading">
      <Container>
        <div className="companies-carousel-header text-center">
          <h2 id="companies-carousel-heading" className="h5 fw-bold mb-0">
            {/* Keeping heading node semantic but empty or title if needed */}
          </h2>
        </div>
      </Container>

      <div className="companies-carousel-wrap py-4">
        <LogoLoop
          logos={logoItems}
          speed={50}
          direction="left"
          logoHeight={32}
          gap={60}
          fadeOut
          scaleOnHover
          hoverSpeed={0}
          ariaLabel="Trusted partners and client companies"
        />
      </div>
    </section>
  );
}

export default CompaniesCarousel;
