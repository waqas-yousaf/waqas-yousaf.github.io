function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function configureMarked(marked) {
  marked.setOptions({ gfm: true, breaks: true });
  return marked;
}

function extractTokenText(token) {
  if (!token) return '';
  if (token.type === 'text') return token.text ?? '';
  if (token.tokens?.length) return token.tokens.map(extractTokenText).join('');
  return token.text ?? '';
}

function createParagraphChildren(tokens, docx) {
  const { TextRun, ExternalHyperlink } = docx;
  const children = [];

  (tokens ?? []).forEach((token) => {
    if (token.type === 'strong') {
      children.push(new TextRun({ text: extractTokenText(token), bold: true }));
      return;
    }

    if (token.type === 'em') {
      children.push(new TextRun({ text: extractTokenText(token), italics: true }));
      return;
    }

    if (token.type === 'del') {
      children.push(new TextRun({ text: extractTokenText(token), strike: true }));
      return;
    }

    if (token.type === 'codespan') {
      children.push(new TextRun({ text: token.text ?? '', font: 'Courier New' }));
      return;
    }

    if (token.type === 'link') {
      children.push(
        new ExternalHyperlink({
          children: [new TextRun({ text: extractTokenText(token), style: 'Hyperlink' })],
          link: token.href ?? '',
        })
      );
      return;
    }

    if (token.type === 'br') {
      children.push(new TextRun({ break: 1 }));
      return;
    }

    if (token.type === 'text') {
      children.push(new TextRun({ text: token.text ?? '' }));
    }
  });

  return children.length ? children : [new TextRun({ text: '' })];
}

function listItemsToParagraphs(listToken, docx, level = 0) {
  const { Paragraph } = docx;
  const reference = listToken.ordered ? 'numbered-list' : 'bullet-list';
  const paragraphs = [];

  listToken.items?.forEach((item) => {
    let hasBlock = false;

    item.tokens?.forEach((child) => {
      if (child.type === 'list') {
        paragraphs.push(...listItemsToParagraphs(child, docx, level + 1));
        hasBlock = true;
        return;
      }

      if (child.type === 'paragraph') {
        paragraphs.push(
          new Paragraph({
            children: createParagraphChildren(child.tokens ?? [], docx),
            numbering: { reference, level: Math.min(level, 1) },
          })
        );
        hasBlock = true;
        return;
      }

      if (child.type === 'text') {
        paragraphs.push(
          new Paragraph({
            children: createParagraphChildren(child.tokens ?? [child], docx),
            numbering: { reference, level: Math.min(level, 1) },
          })
        );
        hasBlock = true;
      }
    });

    if (!hasBlock) {
      paragraphs.push(
        new Paragraph({
          children: createParagraphChildren([], docx),
          numbering: { reference, level: Math.min(level, 1) },
        })
      );
    }
  });

  return paragraphs;
}

function blockquoteToParagraphs(token, docx) {
  const { Paragraph } = docx;
  const paragraphs = [];

  (token.tokens ?? []).forEach((child) => {
    if (child.type === 'paragraph') {
      paragraphs.push(
        new Paragraph({
          children: createParagraphChildren(child.tokens ?? [], docx),
          indent: { left: 720 },
        })
      );
      return;
    }

    if (child.type === 'heading') {
      paragraphs.push(
        new Paragraph({
          children: createParagraphChildren(child.tokens ?? [], docx),
          indent: { left: 720 },
        })
      );
      return;
    }

    const text = extractTokenText(child).trim();
    if (text) {
      paragraphs.push(
        new Paragraph({
          children: createParagraphChildren([{ type: 'em', tokens: [{ type: 'text', text }] }], docx),
          indent: { left: 720 },
        })
      );
    }
  });

  return paragraphs;
}

function tableToDocxTable(token, docx) {
  const { Table, TableRow, TableCell, Paragraph, WidthType } = docx;
  const rows = [];

  if (token.header?.length) {
    rows.push(
      new TableRow({
        children: token.header.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: createParagraphChildren(cell.tokens ?? [], docx),
                }),
              ],
            })
        ),
      })
    );
  }

  token.rows?.forEach((row) => {
    rows.push(
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: createParagraphChildren(cell.tokens ?? [], docx),
                }),
              ],
            })
        ),
      })
    );
  });

  if (!rows.length) return null;

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
  });
}

function tokensToDocxContent(tokens, docx) {
  const { Paragraph, TextRun, HeadingLevel } = docx;
  const content = [];

  tokens.forEach((token) => {
    if (token.type === 'space') return;

    if (token.type === 'heading') {
      const levelMap = {
        1: HeadingLevel.HEADING_1,
        2: HeadingLevel.HEADING_2,
        3: HeadingLevel.HEADING_3,
        4: HeadingLevel.HEADING_4,
        5: HeadingLevel.HEADING_5,
        6: HeadingLevel.HEADING_6,
      };
      content.push(
        new Paragraph({
          heading: levelMap[token.depth] ?? HeadingLevel.HEADING_2,
          children: [new TextRun({ text: extractTokenText(token), bold: true })],
        })
      );
      return;
    }

    if (token.type === 'paragraph') {
      content.push(
        new Paragraph({
          children: createParagraphChildren(token.tokens ?? [], docx),
        })
      );
      return;
    }

    if (token.type === 'list') {
      content.push(...listItemsToParagraphs(token, docx));
      return;
    }

    if (token.type === 'code') {
      const lines = (token.text ?? '').split('\n');
      lines.forEach((line) => {
        content.push(
          new Paragraph({
            children: [new TextRun({ text: line, font: 'Courier New' })],
          })
        );
      });
      return;
    }

    if (token.type === 'blockquote') {
      content.push(...blockquoteToParagraphs(token, docx));
      return;
    }

    if (token.type === 'hr') {
      content.push(
        new Paragraph({
          border: {
            bottom: {
              color: 'auto',
              space: 1,
              style: 'single',
              size: 6,
            },
          },
        })
      );
      return;
    }

    if (token.type === 'table') {
      const table = tableToDocxTable(token, docx);
      if (table) content.push(table);
      return;
    }

    if (token.type === 'image') {
      const label = token.title ? `${token.text ?? 'image'} (${token.title})` : token.text ?? 'image';
      content.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${label}: ` }),
            new TextRun({ text: token.href ?? '', style: 'Hyperlink' }),
          ],
        })
      );
    }
  });

  return content.length ? content : [new Paragraph({ children: [new TextRun({ text: '' })] })];
}

function getDocxNumbering(docx) {
  const { LevelFormat, AlignmentType } = docx;

  return {
    config: [
      {
        reference: 'bullet-list',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '\u2022',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 720, hanging: 360 },
              },
            },
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: '\u25E6',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 1440, hanging: 360 },
              },
            },
          },
        ],
      },
      {
        reference: 'numbered-list',
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: '%1.',
            alignment: AlignmentType.START,
            style: {
              paragraph: {
                indent: { left: 720, hanging: 360 },
              },
            },
          },
          {
            level: 1,
            format: LevelFormat.LOWER_LETTER,
            text: '%2.',
            alignment: AlignmentType.START,
            style: {
              paragraph: {
                indent: { left: 1440, hanging: 360 },
              },
            },
          },
        ],
      },
    ],
  };
}

export async function exportMarkdownToDocx(markdown, filename = 'document.docx') {
  const [markedModule, docx] = await Promise.all([import('marked'), import('docx')]);
  const { marked, lexer } = markedModule;
  configureMarked(marked);
  const tokens = lexer ? lexer(markdown) : marked.lexer(markdown);
  const children = tokensToDocxContent(tokens, docx);
  const document = new docx.Document({
    numbering: getDocxNumbering(docx),
    sections: [{ children }],
  });
  const blob = await docx.Packer.toBlob(document);
  downloadBlob(blob, filename);
}

export async function exportMarkdownToPdf(markdown, filename = 'document.pdf') {
  const [jspdfModule, html2canvasModule, markedModule] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
    import('marked'),
  ]);
  const jsPDF = jspdfModule.default ?? jspdfModule.jsPDF;
  const html2canvas = html2canvasModule.default ?? html2canvasModule;
  const { marked } = markedModule;

  configureMarked(marked);
  const html = marked.parse(markdown);

  const captureElement = document.createElement('div');
  captureElement.className = 'markdown-export-pdf-capture';
  captureElement.innerHTML = html;
  document.body.appendChild(captureElement);

  try {
    const canvas = await html2canvas(captureElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      height: captureElement.scrollHeight,
      windowHeight: captureElement.scrollHeight,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    const pageContentHeight = pageHeight - margin * 2;
    let offsetY = 0;

    while (offsetY < imgHeight) {
      if (offsetY > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, margin - offsetY, contentWidth, imgHeight);
      offsetY += pageContentHeight;
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(captureElement);
  }
}

export function renderMarkdownPreview(markdown) {
  return import('marked').then((markedModule) => {
    const { marked } = markedModule;
    configureMarked(marked);
    return marked.parse(markdown);
  });
}
