import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '../config/site.js';

export const ABOUT_PATH = '/about';

export const aboutIntro = [
  `I'm ${SITE_NAME}, a ${SITE_TAGLINE} with over nine years of experience building scalable web applications ranging from small websites to ERP solutions, Cloud Managers, News Portals, Gaming Platforms and microtransactions products.`,
  'I specialize in Laravel, PHP, Python, React, and DevOps — from REST APIs and microservices to Docker, AWS, and CI/CD pipelines. I have shipped products serving 150,000+ active users and currently work with teams across Germany and Pakistan.',
  'When I am not coding backends or tuning infrastructure, I build free client-side developer tools for this site — so other engineers can work faster without compromising their data and saving time.',
];

export const socialLinks = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/waqas-yousaf',
    icon: 'code',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/waqasbiz',
    icon: 'work',
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    href: 'https://x.com/imakewebapps',
    icon: 'tag',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/4917683081592',
    icon: 'chat',
  },
];

export const aboutSeo = {
  title: `About ${SITE_NAME} | ${SITE_TAGLINE}`,
  description: `Learn more about ${SITE_NAME} — backend developer and DevOps engineer specializing in Laravel, cloud infrastructure, and free online developer tools.`,
  canonical: `${SITE_URL}${ABOUT_PATH}`,
};
