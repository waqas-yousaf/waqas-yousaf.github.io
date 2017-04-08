import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import ToolTabNav from './ToolTabNav';
import MaterialIcon from '../common/MaterialIcon';
import { renderMarkdownPreview } from '../../utils/markdownExport';

const TOOLBAR_ACTIONS = [
  { command: 'bold', icon: 'format_bold', key: 'bold' },
  { command: 'italic', icon: 'format_italic', key: 'italic' },
  { command: 'underline', icon: 'format_underlined', key: 'underline' },
  { type: 'separator' },
  { command: 'formatBlock', arg: 'h2', icon: 'title', key: 'heading2' },
  { command: 'formatBlock', arg: 'h3', icon: 'format_size', key: 'heading3' },
  { command: 'formatBlock', arg: 'p', icon: 'notes', key: 'paragraph' },
  { type: 'separator' },
  { command: 'insertUnorderedList', icon: 'format_list_bulleted', key: 'bulletList' },
  { command: 'insertOrderedList', icon: 'format_list_numbered', key: 'numberedList' },
  { type: 'separator' },
  { command: 'createLink', icon: 'link', key: 'link', prompt: true },
  { command: 'unlink', icon: 'link_off', key: 'unlink' },
  { command: 'removeFormat', icon: 'format_clear', key: 'clearFormat' },
  { type: 'separator' },
  { command: 'undo', icon: 'undo', key: 'undo' },
  { command: 'redo', icon: 'redo', key: 'redo' },
];

function MarkdownEditor({ value, onChange, placeholder, onPreviewStatus }) {
  const { t } = useTranslation();
  const editorRef = useRef(null);
  const turndownRef = useRef(null);
  const isInternalChange = useRef(false);
  const [activeTab, setActiveTab] = useState('visual');
  const [previewHtml, setPreviewHtml] = useState('');

  const tabs = [
    {
      id: 'visual',
      icon: 'visibility',
      label: t('tools.ui.markdownExport.inputModes.visual'),
    },
    {
      id: 'markdown',
      icon: 'code',
      label: t('tools.ui.markdownExport.inputModes.markdown'),
    },
    {
      id: 'preview',
      icon: 'preview',
      label: t('tools.ui.markdownExport.inputModes.preview'),
    },
  ];

  const getTurndown = async () => {
    if (!turndownRef.current) {
      const [{ default: TurndownService }, { gfm }] = await Promise.all([
        import('turndown'),
        import('turndown-plugin-gfm'),
      ]);
      const service = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' });
      service.use(gfm);
      turndownRef.current = service;
    }
    return turndownRef.current;
  };

  useEffect(() => {
    if (activeTab !== 'visual' || !editorRef.current || isInternalChange.current) {
      isInternalChange.current = false;
      return undefined;
    }

    let cancelled = false;

    renderMarkdownPreview(value || '').then((html) => {
      if (cancelled || !editorRef.current) return;
      if (editorRef.current.innerHTML !== html) {
        editorRef.current.innerHTML = html;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [value, activeTab]);

  useEffect(() => {
    if (activeTab !== 'preview') {
      return undefined;
    }

    if (!value.trim()) {
      setPreviewHtml('');
      return undefined;
    }

    const timer = setTimeout(async () => {
      try {
        const html = await renderMarkdownPreview(value);
        setPreviewHtml(html);
        onPreviewStatus?.({ type: 'ok', message: t('tools.ui.markdownExport.previewReady') });
      } catch (error) {
        setPreviewHtml('');
        onPreviewStatus?.({
          type: 'error',
          message: error.message || t('tools.ui.markdownExport.previewError'),
        });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [value, activeTab, onPreviewStatus, t]);

  const emitChange = (markdown) => {
    isInternalChange.current = true;
    onChange(markdown);
  };

  const syncFromVisual = async () => {
    if (!editorRef.current) return;
    const turndown = await getTurndown();
    emitChange(turndown.turndown(editorRef.current.innerHTML));
  };

  const runCommand = (command, arg, needsPrompt = false) => {
    if (activeTab !== 'visual' || !editorRef.current) return;

    editorRef.current.focus();

    if (needsPrompt) {
      const defaultUrl = 'https://';
      const url = window.prompt(t('tools.ui.htmlCleaner.toolbar.linkPrompt'), defaultUrl);
      if (!url) return;
      document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false, arg ?? null);
    }

    syncFromVisual();
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const html = event.clipboardData.getData('text/html');
    const text = event.clipboardData.getData('text/plain');

    if (html) {
      document.execCommand('insertHTML', false, html);
    } else {
      document.execCommand('insertText', false, text);
    }

    syncFromVisual();
  };

  return (
    <div className="markdown-editor">
      <ToolTabNav
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ariaLabel={t('tools.ui.markdownExport.tabNavAria')}
        className="markdown-editor-tab-nav mb-3"
      />

      {activeTab === 'visual' ? (
        <div className="html-wysiwyg-editor" role="tabpanel" id="tool-tabpanel-visual" aria-labelledby="tool-tab-visual">
          <div className="html-wysiwyg-toolbar" role="toolbar" aria-label={t('tools.ui.htmlCleaner.toolbar.label')}>
            {TOOLBAR_ACTIONS.map((action, index) => {
              if (action.type === 'separator') {
                return <span key={`sep-${index}`} className="html-wysiwyg-toolbar-sep" aria-hidden="true" />;
              }

              return (
                <button
                  key={action.key}
                  type="button"
                  className="html-wysiwyg-toolbar-btn"
                  title={t(`tools.ui.htmlCleaner.toolbar.${action.key}`)}
                  aria-label={t(`tools.ui.htmlCleaner.toolbar.${action.key}`)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => runCommand(action.command, action.arg, action.prompt)}
                >
                  <MaterialIcon name={action.icon} />
                </button>
              );
            })}
          </div>

          <div
            ref={editorRef}
            className="html-wysiwyg-surface"
            contentEditable
            role="textbox"
            aria-multiline="true"
            aria-label={t('tools.ui.markdownExport.inputLabel')}
            data-placeholder={placeholder}
            onInput={syncFromVisual}
            onBlur={syncFromVisual}
            onPaste={handlePaste}
            suppressContentEditableWarning
          />
        </div>
      ) : null}

      {activeTab === 'markdown' ? (
        <Form.Control
          as="textarea"
          rows={16}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="font-monospace small tool-code-input markdown-editor-source"
          role="tabpanel"
          id="tool-tabpanel-markdown"
          aria-labelledby="tool-tab-markdown"
        />
      ) : null}

      {activeTab === 'preview' ? (
        <div
          className="markdown-editor-preview tool-code-input"
          role="tabpanel"
          id="tool-tabpanel-preview"
          aria-labelledby="tool-tab-preview"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      ) : null}
    </div>
  );
}

export default MarkdownEditor;
