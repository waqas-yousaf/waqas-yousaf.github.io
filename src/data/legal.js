import { SITE_NAME, SITE_URL } from '../config/site.js';

export const PRIVACY_PATH = '/privacy-policy';
export const TERMS_PATH = '/terms-and-conditions';
export const COOKIE_CONSENT_KEY = 'wy-cookie-consent';
export const GA_MEASUREMENT_ID = 'G-NLYJEG775Z';

export const privacyPolicySeo = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `How ${SITE_NAME} handles personal data, cookies, analytics, and third-party services on this portfolio and developer tools website.`,
  canonical: `${SITE_URL}${PRIVACY_PATH}`,
};

export const termsSeo = {
  title: `Terms & Conditions | ${SITE_NAME}`,
  description: `Terms of use for ${SITE_NAME}'s portfolio website and free online developer tools.`,
  canonical: `${SITE_URL}${TERMS_PATH}`,
};

export const privacySections = [
  {
    title: 'Overview',
    paragraphs: [
      `This Privacy Policy explains how ${SITE_NAME} ("we", "us") collects and uses information when you visit ${SITE_URL}.`,
      'Most developer tools on this site run entirely in your browser. Tool input is processed locally and is not sent to our servers.',
    ],
  },
  {
    title: 'Information we collect',
    paragraphs: ['Depending on how you use the site, we may process:'],
    list: [
      'Usage data through Google Analytics if you accept analytics cookies (pages visited, approximate location, device/browser type, referral source).',
      'Your cookie consent choice, stored in your browser local storage.',
      'Public network information when you use the Browser Info tool, which requests IP and location data from a third-party lookup service from your browser.',
      'Information you choose to send when contacting us by email or WhatsApp.',
    ],
  },
  {
    title: 'Cookies and local storage',
    paragraphs: [
      'Essential storage is used to remember your cookie preference so the consent banner does not reappear on every visit.',
      'Analytics cookies are only loaded if you click "Accept all". If you choose "Essential only", Google Analytics is not initialized.',
    ],
  },
  {
    title: 'Third-party services',
    list: [
      'Google Analytics (analytics, optional with consent).',
      'Google Fonts / Material Icons (typography assets loaded from Google CDN).',
      'ipwho.is (optional IP geolocation lookup initiated by the Browser Info tool in your browser).',
      'GitHub Pages (hosting provider).',
    ],
  },
  {
    title: 'Legal bases (EEA/UK visitors)',
    paragraphs: [
      'Where GDPR applies, we rely on consent for analytics cookies and legitimate interest for essential site operation, security, and responding to contact requests.',
    ],
  },
  {
    title: 'Data retention',
    paragraphs: [
      'Cookie consent preferences remain in local storage until you clear site data or change your choice.',
      'Analytics data retention is governed by Google Analytics settings.',
    ],
  },
  {
    title: 'Your rights',
    paragraphs: [
      'Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal data, and to withdraw consent for analytics at any time by clearing site data or using the cookie settings link in the footer.',
    ],
  },
  {
    title: 'Contact',
    paragraphs: [
      `For privacy questions, contact ${SITE_NAME} through the email or WhatsApp links on this website.`,
      'Last updated: May 2026.',
    ],
  },
];

export const termsSections = [
  {
    title: 'Agreement',
    paragraphs: [
      `By accessing ${SITE_URL}, you agree to these Terms & Conditions. If you do not agree, please do not use the site.`,
    ],
  },
  {
    title: 'Use of the website',
    list: [
      'You may browse the portfolio and use the free developer tools for lawful personal or commercial purposes.',
      'You must not attempt to disrupt the site, scrape it abusively, or use it to process unlawful content.',
      'Tool output is provided for convenience. You are responsible for verifying results before production use.',
    ],
  },
  {
    title: 'Developer tools disclaimer',
    paragraphs: [
      'Tools are provided "as is" without warranties of any kind. We do not guarantee uninterrupted availability, accuracy, or fitness for a particular purpose.',
      'Security-sensitive operations (password generation, hashing, encoding) should be reviewed in your own environment when risk is high.',
    ],
  },
  {
    title: 'Intellectual property',
    paragraphs: [
      `Site content, branding, and original code are owned by ${SITE_NAME} unless otherwise credited. You may not copy or republish substantial portions without permission.`,
    ],
  },
  {
    title: 'Third-party links',
    paragraphs: [
      'This site links to external services such as GitHub, LinkedIn, and WhatsApp. We are not responsible for their content or policies.',
    ],
  },
  {
    title: 'Limitation of liability',
    paragraphs: [
      'To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from use of this website or its tools.',
    ],
  },
  {
    title: 'Changes',
    paragraphs: [
      'We may update these terms from time to time. Continued use after changes are posted constitutes acceptance of the revised terms.',
      'Last updated: May 2026.',
    ],
  },
];
