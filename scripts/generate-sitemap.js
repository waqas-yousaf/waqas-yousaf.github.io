import { writeFileSync } from 'fs';
import { ABOUT_PATH } from '../src/data/about.js';
import { PORTFOLIO_PATH } from '../src/data/portfolio.js';
import { PRIVACY_PATH, TERMS_PATH } from '../src/data/legal.js';
import { toolDefinitions, SITE_URL, TOOLS_PATH } from '../src/data/tools.js';
import { LOCALES, localizePath } from '../src/i18n/paths.js';

const lastmod = new Date().toISOString().split('T')[0];

const staticEntries = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: ABOUT_PATH, changefreq: 'monthly', priority: '0.8' },
  { path: PORTFOLIO_PATH, changefreq: 'monthly', priority: '0.8' },
  { path: PRIVACY_PATH, changefreq: 'yearly', priority: '0.4' },
  { path: TERMS_PATH, changefreq: 'yearly', priority: '0.4' },
  { path: TOOLS_PATH, changefreq: 'weekly', priority: '0.95' },
];

const toolEntries = toolDefinitions.map((tool) => ({
  path: tool.path,
  changefreq: 'monthly',
  priority: '0.9',
}));

const urls = LOCALES.flatMap((locale) =>
  [...staticEntries, ...toolEntries].map((entry) => ({
    loc: `${SITE_URL}${localizePath(entry.path, locale)}`,
    changefreq: entry.changefreq,
    priority: entry.priority,
  }))
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync('public/sitemap.xml', sitemap, 'utf8');
console.log(`Generated sitemap.xml with ${urls.length} URLs`);
