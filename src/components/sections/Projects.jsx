import { useTranslation } from 'react-i18next';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import MaterialIcon from '../common/MaterialIcon';
import { useProjects } from '../../hooks/useLocalizedContent';

function Projects({ showHeading = true }) {
  const { t } = useTranslation();
  const projects = useProjects();

  return (
    <section id="projects" className="py-5">
      <div className="container-fluid px-3 px-md-5">
        {showHeading ? (
          <h2 className="text-center fw-bold mb-5">
            {t('projects.featuredProjects').replace(t('projects.featuredHighlight'), '').trim()}{' '}
            <span className="text-primary">{t('projects.featuredHighlight')}</span>
          </h2>
        ) : null}
        <Row className="g-4">
          {projects.map((project) => (
            <Col key={project.id} xs={12} md={6} lg={4}>
              <Card className="glass-card h-100 border-0">
                <Card.Body className="d-flex flex-column">
                  <Card.Subtitle className="text-primary small mb-2">{project.association}</Card.Subtitle>
                  <Card.Title className="h6 fw-bold">{project.title}</Card.Title>
                  <Card.Text className="small text-secondary flex-grow-1">{project.description}</Card.Text>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} bg="light" text="dark" className="border border-primary border-opacity-25">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  {project.url ? (
                    <Button
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline-primary"
                      size="sm"
                      className="align-self-start rounded-pill"
                    >
                      {t('projects.visitSite')} <MaterialIcon name="open_in_new" className="ms-1" />
                    </Button>
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-5">
          <Button href="https://github.com/waqas-yousaf" target="_blank" variant="primary" className="rounded-pill px-4">
            {t('projects.viewMoreGithub')} <MaterialIcon name="arrow_forward" className="ms-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Projects;
