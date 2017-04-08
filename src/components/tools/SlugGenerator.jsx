import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ToolLayout from './ToolLayout';
import CopyButton from './CopyButton';
import { generateSlug } from '../../utils/toolHelpers';
import { useTool } from '../../data/tools';

function SlugGenerator() {
  const { t } = useTranslation();
  const tool = useTool('slug');
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const output = generateSlug(input, separator);

  if (!tool) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">{t('tools.ui.slug.separator')}</Form.Label>
        <Form.Select value={separator} onChange={(e) => setSeparator(e.target.value)} style={{ maxWidth: 160 }}>
          <option value="-">{t('tools.ui.slug.hyphen')}</option>
          <option value="_">{t('tools.ui.slug.underscore')}</option>
          <option value=".">{t('tools.ui.slug.dot')}</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">{t('tools.ui.slug.inputText')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder={t('tools.ui.slug.inputPlaceholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="tool-code-input"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label className="fw-bold">{t('tools.ui.slug.slugOutput')}</Form.Label>
        <InputGroup>
          <Form.Control readOnly value={output} className="font-monospace tool-output-field" />
          <CopyButton text={output} />
        </InputGroup>
      </Form.Group>
    </ToolLayout>
  );
}

export default SlugGenerator;
