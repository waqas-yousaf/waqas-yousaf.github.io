import { SITE_NAME, SITE_URL } from '../config/site.js';

export const OPENSOURCE_PATH = '/opensource';

export const packagesSeo = {
  title: `Open Source Packages | ${SITE_NAME}`,
  description: `Explore open-source PHP, Laravel, and JavaScript packages built by ${SITE_NAME} for developers worldwide.`,
  canonical: `${SITE_URL}${OPENSOURCE_PATH}`,
};

export const packages = [
  {
    id: 'dulluhan',
    name: 'waqas-yousaf/dulluhan',
    title: 'Dulluhan',
    githubUrl: 'https://github.com/waqas-yousaf/dulluhan',
    composerPackage: 'waqas-yousaf/dulluhan',
    techStack: ['PHP', 'Laravel', 'Blade', 'Quill Editor', 'Headless API'],
  },
];
