import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import ToolLayout from './ToolLayout';
import MarkdownEditor from './MarkdownEditor';
import MaterialIcon from '../common/MaterialIcon';
import { exportMarkdownToDocx, exportMarkdownToPdf } from '../../utils/markdownExport';
import { useTool } from '../../data/tools';

const SAMPLE_MARKDOWN = `# Project Notes

## Summary
Build a **client-side** markdown exporter with _privacy first_ design.

## Features
- Upload \`.md\` files locally
- Download DOCX
- Download PDF
- Live HTML preview

> Nothing leaves your browser.

\`\`\`js
console.log('Hello from Markdown!');
\`\`\`
`;

function MarkdownExporter() {
  const { t } = useTranslation();
  const tool = useTool('markdown-export');
  const fileInputRef = useRef(null);
  const [input, setInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [busy, setBusy] = useState(null);

  const charCount = useMemo(() => input.length, [input]);

  const handlePreviewStatus = useCallback((nextStatus) => {
    setStatus(nextStatus);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setInput(String(reader.result ?? ''));
      setFileName(file.name);
    };
    reader.onerror = () => {
      setStatus({ type: 'error', message: t('tools.ui.markdownExport.readError') });
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleDocxDownload = async () => {
    setBusy('docx');
    try {
      await exportMarkdownToDocx(input, `${fileName.replace(/\.[^.]+$/, '') || 'document'}.docx`);
      setStatus({ type: 'ok', message: t('tools.ui.markdownExport.docxReady') });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || t('tools.ui.markdownExport.docxError') });
    } finally {
      setBusy(null);
    }
  };

  const handlePdfDownload = async () => {
    setBusy('pdf');
    try {
      await exportMarkdownToPdf(input, `${fileName.replace(/\.[^.]+$/, '') || 'document'}.pdf`);
      setStatus({ type: 'ok', message: t('tools.ui.markdownExport.pdfReady') });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || t('tools.ui.markdownExport.pdfError') });
    } finally {
      setBusy(null);
    }
  };

  if (!tool) return null;

  return (
    <ToolLayout toolId={tool.id} icon={tool.icon} title={tool.longTitle} description={tool.seoDescription}>
      {status.message ? (
        <p className={`small mb-0 mt-3 ${status.type === 'error' ? 'text-danger' : 'text-secondary'}`}>{status.message}</p>
      ) : null}

      <div className="d-flex flex-wrap gap-2 align-items-center mb-3 mt-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt,text/markdown"
          className="d-none"
          onChange={handleFileChange}
        />
        <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => fileInputRef.current?.click()}>
          <MaterialIcon name="upload_file" className="me-2" />
          {t('tools.ui.markdownExport.uploadFile')}
        </Button>
        <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => setInput(SAMPLE_MARKDOWN)}>
          {t('tools.ui.shared.loadSample')}
        </Button>
        {fileName ? <span className="small text-secondary">{fileName}</span> : null}
        <span className="small text-secondary ms-auto">{t('tools.ui.shared.characters', { count: charCount })}</span>
      </div>

      <p className="small text-secondary mb-4">{t('tools.ui.markdownExport.fileHint')}</p>

      <MarkdownEditor
        value={input}
        onChange={(nextValue) => {
          setInput(nextValue);
          setFileName('');
        }}
        placeholder={t('tools.ui.markdownExport.inputPlaceholder')}
        onPreviewStatus={handlePreviewStatus}
      />

      <div className="tool-action-bar mt-4">
        <Button
          variant="primary"
          className="rounded-pill"
          onClick={handleDocxDownload}
          disabled={!input.trim() || busy !== null}
        >
          <MaterialIcon name="description" className="me-2" />
          {busy === 'docx' ? t('tools.ui.markdownExport.exporting') : t('tools.ui.markdownExport.downloadDocx')}
        </Button>
        <Button
          variant="outline-primary"
          className="rounded-pill"
          onClick={handlePdfDownload}
          disabled={!input.trim() || busy !== null}
        >
          <MaterialIcon name="picture_as_pdf" className="me-2" />
          {busy === 'pdf' ? t('tools.ui.markdownExport.exporting') : t('tools.ui.markdownExport.downloadPdf')}
        </Button>
        <Button
          variant="outline-secondary"
          className="rounded-pill"
          onClick={() => {
            setInput('');
            setFileName('');
            setStatus({ type: 'idle', message: '' });
          }}
        >
          {t('tools.ui.shared.clear')}
        </Button>
      </div>
    </ToolLayout>
  );
}

export default MarkdownExporter;
