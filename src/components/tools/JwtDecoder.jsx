import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import ToolLayout from './ToolLayout';
import CopyButton from './CopyButton';
import ToolStatus from './ToolStatus';
import { decodeJwt } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

function JwtDecoder() {
  const { t } = useTranslation();
  const tool = useTool('jwt-decoder');
  const [token, setToken] = useState('');

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    try {
      return { data: decodeJwt(token), error: null };
    } catch (e) {
      return { data: null, error: e.message };
    }
  }, [token]);

  const expiry = decoded?.data?.payload?.exp
    ? new Date(decoded.data.payload.exp * 1000).toLocaleString()
    : null;

  const headerJson = decoded?.data ? JSON.stringify(decoded.data.header, null, 2) : '';
  const payloadJson = decoded?.data ? JSON.stringify(decoded.data.payload, null, 2) : '';

  if (!tool) return null;

  const statusMessage = !token
    ? t('tools.ui.jwtDecoder.pasteToken')
    : decoded?.error || t('tools.ui.jwtDecoder.tokenDecoded');

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <ToolStatus valid={token ? !decoded?.error : null} message={statusMessage} />
      <Form.Group className="mt-3 mb-3">
        <Form.Label className="fw-bold">{t('tools.ui.jwtDecoder.jwtToken')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder={t('tools.ui.jwtDecoder.tokenPlaceholder')}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="font-monospace small tool-code-input"
        />
      </Form.Group>

      {decoded?.data ? (
        <>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {decoded.data.header.alg ? <Badge bg="light" text="dark">alg: {decoded.data.header.alg}</Badge> : null}
            {decoded.data.header.typ ? <Badge bg="light" text="dark">typ: {decoded.data.header.typ}</Badge> : null}
            {expiry ? <Badge bg="light" text="dark">exp: {expiry}</Badge> : null}
          </div>
          <Row className="g-4">
            <Col md={6}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="fw-bold mb-0">{t('tools.ui.shared.header')}</Form.Label>
                <CopyButton text={headerJson} label={t('tools.ui.shared.copy')} variant="outline-primary" />
              </div>
              <Form.Control as="textarea" rows={10} readOnly value={headerJson} className="tool-code-input font-monospace small" />
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="fw-bold mb-0">{t('tools.ui.shared.payload')}</Form.Label>
                <CopyButton text={payloadJson} label={t('tools.ui.shared.copy')} variant="outline-primary" />
              </div>
              <Form.Control as="textarea" rows={10} readOnly value={payloadJson} className="tool-code-input font-monospace small" />
            </Col>
          </Row>
        </>
      ) : null}
    </ToolLayout>
  );
}

export default JwtDecoder;
