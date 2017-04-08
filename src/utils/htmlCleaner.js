const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const REMOVABLE_EMPTY_TAGS = new Set([
  'div',
  'span',
  'p',
  'section',
  'article',
  'aside',
  'header',
  'footer',
  'nav',
  'main',
  'figure',
  'figcaption',
  'label',
  'strong',
  'em',
  'b',
  'i',
]);

export const HTML_CLEANER_PRESETS = {
  minimal: {
    removeIds: true,
    removeClasses: true,
    removeStyles: true,
    removeDataAttributes: true,
    removeAriaAttributes: false,
    removeEventHandlers: true,
    removeOtherAttributes: true,
    preserveHref: true,
    preserveSrc: true,
    preserveAlt: true,
    preserveTitle: true,
    removeComments: true,
    removeScripts: false,
    removeStyleTags: false,
    removeMetaLink: false,
    removeEmptyElements: false,
    removeEmptyDivs: true,
    unwrapExtraDivs: true,
    unwrapSpans: false,
    minify: false,
    beautify: true,
  },
  aggressive: {
    removeIds: true,
    removeClasses: true,
    removeStyles: true,
    removeDataAttributes: true,
    removeAriaAttributes: true,
    removeEventHandlers: true,
    removeOtherAttributes: true,
    preserveHref: true,
    preserveSrc: true,
    preserveAlt: true,
    preserveTitle: false,
    removeComments: true,
    removeScripts: true,
    removeStyleTags: true,
    removeMetaLink: true,
    removeEmptyElements: true,
    removeEmptyDivs: true,
    unwrapExtraDivs: true,
    unwrapSpans: true,
    minify: false,
    beautify: true,
  },
  semantic: {
    removeIds: true,
    removeClasses: true,
    removeStyles: true,
    removeDataAttributes: true,
    removeAriaAttributes: false,
    removeEventHandlers: true,
    removeOtherAttributes: false,
    preserveHref: true,
    preserveSrc: true,
    preserveAlt: true,
    preserveTitle: true,
    removeComments: true,
    removeScripts: true,
    removeStyleTags: true,
    removeMetaLink: false,
    removeEmptyElements: true,
    removeEmptyDivs: true,
    unwrapExtraDivs: true,
    unwrapSpans: false,
    minify: false,
    beautify: true,
  },
  cms: {
    removeIds: true,
    removeClasses: true,
    removeStyles: true,
    removeDataAttributes: true,
    removeAriaAttributes: true,
    removeEventHandlers: true,
    removeOtherAttributes: true,
    preserveHref: true,
    preserveSrc: true,
    preserveAlt: true,
    preserveTitle: true,
    removeComments: true,
    removeScripts: true,
    removeStyleTags: true,
    removeMetaLink: false,
    removeEmptyElements: true,
    removeEmptyDivs: true,
    unwrapExtraDivs: true,
    unwrapSpans: true,
    minify: false,
    beautify: true,
  },
};

export const DEFAULT_HTML_CLEANER_OPTIONS = HTML_CLEANER_PRESETS.minimal;

function isFullHtmlDocument(input) {
  return /<!DOCTYPE|<\s*html[\s>]/i.test(input.trim());
}

function shouldPreserveAttribute(name, options) {
  if (options.preserveHref && name === 'href') return true;
  if (options.preserveSrc && (name === 'src' || name === 'srcset')) return true;
  if (options.preserveAlt && name === 'alt') return true;
  if (options.preserveTitle && name === 'title') return true;
  if (name === 'colspan' || name === 'rowspan') return true;
  if (name === 'type' && !options.removeOtherAttributes) return true;
  return false;
}

function cleanElementAttributes(element, options, stats) {
  [...element.attributes].forEach((attr) => {
    const name = attr.name.toLowerCase();
    let remove = false;

    if (options.removeIds && name === 'id') remove = true;
    else if (options.removeClasses && name === 'class') remove = true;
    else if (options.removeStyles && name === 'style') remove = true;
    else if (options.removeDataAttributes && name.startsWith('data-')) remove = true;
    else if (options.removeAriaAttributes && name.startsWith('aria-')) remove = true;
    else if (options.removeEventHandlers && name.startsWith('on')) remove = true;
    else if (options.removeOtherAttributes && !shouldPreserveAttribute(name, options)) remove = true;

    if (remove) {
      element.removeAttribute(attr.name);
      stats.removedAttributes += 1;
    }
  });
}

function removeComments(root, options, stats) {
  if (!options.removeComments) return;

  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
  const comments = [];

  while (walker.nextNode()) {
    comments.push(walker.currentNode);
  }

  comments.forEach((comment) => {
    comment.remove();
    stats.removedComments += 1;
  });
}

function removeBlockedElements(root, options, stats) {
  if (options.removeScripts) {
    root.querySelectorAll('script').forEach((node) => {
      node.remove();
      stats.removedElements += 1;
    });
  }

  if (options.removeStyleTags) {
    root.querySelectorAll('style').forEach((node) => {
      node.remove();
      stats.removedElements += 1;
    });
  }

  if (options.removeMetaLink) {
    root.querySelectorAll('meta, link').forEach((node) => {
      node.remove();
      stats.removedElements += 1;
    });
  }
}

function isMeaningfullyEmpty(element) {
  const tag = element.tagName.toLowerCase();
  if (VOID_ELEMENTS.has(tag)) return false;
  if (tag === 'img' && element.getAttribute('src')) return false;
  if (tag === 'input' && (element.getAttribute('value') || element.getAttribute('type'))) return false;
  return element.textContent.replace(/\u00a0|\s/g, '') === '' && element.children.length === 0;
}

function removeEmptyElements(root, options, stats) {
  if (!options.removeEmptyElements && !options.removeEmptyDivs) return;

  let changed = true;

  while (changed) {
    changed = false;
    const elements = root.querySelectorAll('*');

    elements.forEach((element) => {
      const tag = element.tagName.toLowerCase();

      if (options.removeEmptyDivs && tag === 'div' && isMeaningfullyEmpty(element)) {
        element.remove();
        stats.removedElements += 1;
        changed = true;
        return;
      }

      if (options.removeEmptyElements && REMOVABLE_EMPTY_TAGS.has(tag) && isMeaningfullyEmpty(element)) {
        element.remove();
        stats.removedElements += 1;
        changed = true;
      }
    });
  }
}

function canUnwrapDiv(div) {
  if (div.tagName !== 'DIV') return false;
  if (div.children.length !== 1) return false;

  for (const node of div.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      return false;
    }
  }

  return true;
}

function unwrapStructuralWrappers(root, options, stats) {
  if (!options.unwrapExtraDivs && !options.unwrapSpans) return;

  let changed = true;

  while (changed) {
    changed = false;
    const candidates = [...root.querySelectorAll(options.unwrapSpans ? 'div, span' : 'div')].reverse();

    candidates.forEach((element) => {
      const tag = element.tagName;

      if (tag === 'DIV' && options.unwrapExtraDivs && canUnwrapDiv(element)) {
        element.replaceWith(element.firstElementChild);
        stats.unwrappedDivs += 1;
        changed = true;
        return;
      }

      if (
        tag === 'SPAN' &&
        options.unwrapSpans &&
        element.attributes.length === 0 &&
        element.children.length === 1 &&
        element.textContent.trim() === element.firstElementChild.textContent.trim()
      ) {
        element.replaceWith(element.firstElementChild);
        stats.unwrappedSpans += 1;
        changed = true;
      }
    });
  }
}

function beautifyHtml(html) {
  const lines = [];
  const tokens = html.replace(/>\s+</g, '><').split(/(<[^>]+>)/g).filter(Boolean);
  let depth = 0;
  const voidPattern = /^<\s*(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i;
  const closingPattern = /^<\//;
  const selfClosingPattern = /\/>$/;

  tokens.forEach((token) => {
    const trimmed = token.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('<')) {
      if (closingPattern.test(trimmed)) {
        depth = Math.max(0, depth - 1);
        lines.push(`${'  '.repeat(depth)}${trimmed}`);
        return;
      }

      lines.push(`${'  '.repeat(depth)}${trimmed}`);

      if (!voidPattern.test(trimmed) && !selfClosingPattern.test(trimmed) && !trimmed.startsWith('<!')) {
        depth += 1;
      }
      return;
    }

    const text = trimmed.replace(/\s+/g, ' ');
    if (text) {
      lines.push(`${'  '.repeat(depth)}${text}`);
    }
  });

  return `${lines.join('\n').trim()}\n`;
}

function minifyHtml(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

function serializeDocument(doc, isFullDocument) {
  if (isFullDocument) {
    const doctype = doc.doctype
      ? `<!DOCTYPE ${doc.doctype.name}${doc.doctype.publicId ? ` PUBLIC "${doc.doctype.publicId}"` : ''}${
          doc.doctype.systemId ? ` "${doc.doctype.systemId}"` : ''
        }>`
      : '<!DOCTYPE html>';
    return `${doctype}\n${doc.documentElement.outerHTML}`;
  }

  return doc.body.innerHTML;
}

export function cleanHtml(input, options = DEFAULT_HTML_CLEANER_OPTIONS) {
  const trimmed = String(input ?? '').trim();

  if (!trimmed) {
    return { html: '', stats: null, error: 'empty' };
  }

  const isFullDocument = isFullHtmlDocument(trimmed);
  const wrappedInput = isFullDocument ? trimmed : `<body>${trimmed}</body>`;
  const doc = new DOMParser().parseFromString(wrappedInput, 'text/html');

  if (doc.querySelector('parsererror')) {
    return { html: '', stats: null, error: 'invalid' };
  }

  const root = isFullDocument ? doc.documentElement : doc.body;
  const stats = {
    removedAttributes: 0,
    removedComments: 0,
    removedElements: 0,
    unwrappedDivs: 0,
    unwrappedSpans: 0,
    originalSize: trimmed.length,
  };

  removeBlockedElements(root, options, stats);
  removeComments(root, options, stats);

  root.querySelectorAll('*').forEach((element) => {
    cleanElementAttributes(element, options, stats);
  });

  removeEmptyElements(root, options, stats);
  unwrapStructuralWrappers(root, options, stats);

  let html = serializeDocument(doc, isFullDocument);

  if (options.minify) {
    html = minifyHtml(html);
  } else if (options.beautify) {
    html = beautifyHtml(html);
  }

  stats.outputSize = html.length;
  stats.savedBytes = Math.max(0, stats.originalSize - stats.outputSize);

  return { html, stats, error: null };
}
