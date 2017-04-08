import { copyFileSync } from 'fs';

copyFileSync('dist/index.html', 'dist/404.html');
console.log('Copied index.html to 404.html for GitHub Pages SPA routing');
