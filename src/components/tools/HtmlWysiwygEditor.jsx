import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import MaterialIcon from '../common/MaterialIcon';

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

function HtmlWysiwygEditor({ value, onChange, placeholder }) {
  const { t } = useTranslation();
  const editorRef = useRef(null);
  const isInternalChange = useRef(false);
  const [mode, setMode] = useState('visual');

  useEffect(() => {
    if (mode !== 'visual' || !editorRef.current || isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    const currentHtml = editorRef.current.innerHTML;
    const normalizedValue = value || '';

    if (normalizedValue !== currentHtml) {
      editorRef.current.innerHTML = normalizedValue;
    }
  }, [value, mode]);

  const emitChange = (html) => {
    isInternalChange.current = true;
    onChange(html);
  };

  const syncFromEditor = () => {
    if (!editorRef.current) return;
    emitChange(editorRef.current.innerHTML);
  };

  const runCommand = (command, arg, needsPrompt = false) => {
    if (mode !== 'visual' || !editorRef.current) return;

    editorRef.current.focus();

    if (needsPrompt) {
      const defaultUrl = 'https://';
      const url = window.prompt(t('tools.ui.htmlCleaner.toolbar.linkPrompt'), defaultUrl);
      if (!url) return;
      document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false, arg ?? null);
    }

    syncFromEditor();
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

    syncFromEditor();
  };

  return (
    <div className="html-wysiwyg-editor">
      <div className="html-wysiwyg-editor-header">
        <ButtonGroup size="sm" className="html-wysiwyg-mode-toggle">
          <Button
            variant={mode === 'visual' ? 'primary' : 'outline-primary'}
            onClick={() => setMode('visual')}
            className="rounded-pill me-2"
          >
            <MaterialIcon name="visibility" className="me-1" />
            {t('tools.ui.htmlCleaner.inputModes.visual')}
          </Button>
          <Button
            variant={mode === 'source' ? 'primary' : 'outline-primary'}
            onClick={() => setMode('source')}
            className="rounded-pill"
          >
            <MaterialIcon name="code" className="me-1" />
            {t('tools.ui.htmlCleaner.inputModes.source')}
          </Button>
        </ButtonGroup>
      </div>

      {mode === 'visual' ? (
        <>
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
            aria-label={t('tools.ui.htmlCleaner.inputLabel')}
            data-placeholder={placeholder}
            onInput={syncFromEditor}
            onBlur={syncFromEditor}
            onPaste={handlePaste}
            suppressContentEditableWarning
          />
        </>
      ) : (
        <Form.Control
          as="textarea"
          rows={16}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="font-monospace small tool-code-input html-wysiwyg-source"
        />
      )}
    </div>
  );
}

export default HtmlWysiwygEditor;
