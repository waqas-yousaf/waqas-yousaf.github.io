# Waqas Yousaf | Portfolio & Developer Tools Hub

Personal portfolio and **Developer Tools Hub** built with React, Bootstrap, and Vite.

## Features

- **Developer Tools** — 8 client-side utilities with dedicated routes
- **Portfolio** — About, skills, work history, and featured projects
- **Responsive UI** — Bootstrap 5 with a cream/orange brand theme

## Developer Tools

| Tool | Route |
|------|-------|
| Password Generator | `/tools/password` |
| UUID v4 Generator | `/tools/uuid` |
| Slug Generator | `/tools/slug` |
| Laravel App Key | `/tools/laravel-key` |
| Base64 Converter | `/tools/base64` |
| JSON Formatter | `/tools/json` |
| Timestamp Converter | `/tools/timestamp` |
| Lorem Ipsum | `/tools/lorem` |

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
git clone https://github.com/waqas-yousaf/waqasyousaf.github.io.git
cd waqasyousaf.github.io
npm install
npm run dev
```

Open `http://localhost:5173`

### Build

```bash
npm run build
npm run preview
```

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that builds the app and deploys `dist/` to the `gh-pages` branch.

Enable GitHub Pages in repository settings with source set to the `gh-pages` branch.

## Project Structure

```
waqasyousaf.github.io/
├── .github/workflows/deploy.yml
├── public/sitemap.xml
├── scripts/copy-404.js
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   └── utils/
├── index.html
├── package.json
└── vite.config.js
```

## Contact

- **WhatsApp**: [+49 176 83081592](https://wa.me/4917683081592)
- **LinkedIn**: [Waqas Yousaf](https://linkedin.com/in/waqasbiz)
- **GitHub**: [@waqas-yousaf](https://github.com/waqas-yousaf)
- **Twitter/X**: [@imakewebapps](https://x.com/imakewebapps)
