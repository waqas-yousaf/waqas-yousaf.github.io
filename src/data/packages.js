import { SITE_NAME, SITE_URL } from '../config/site.js';

export const OPENSOURCE_PATH = '/opensource';

export const packagesSeo = {
  title: `Open Source Packages | ${SITE_NAME}`,
  description: `Explore open-source PHP, Laravel, and JavaScript packages built by ${SITE_NAME} for developers worldwide.`,
  canonical: `${SITE_URL}${OPENSOURCE_PATH}`,
};

export const packages = [
  {
    id: 'dullahan',
    name: 'waqas-yousaf/dullahan',
    title: 'Dullahan',
    githubUrl: 'https://github.com/waqas-yousaf/dullahan',
    composerPackage: 'waqas-yousaf/dullahan',
    techStack: ['PHP', 'Laravel', 'Blade', 'Quill Editor', 'Headless API'],
  },
  {
    id: 'laravel-config-doctor',
    name: 'waqas-yousaf/laravel-config-doctor',
    title: 'Laravel Config Doctor',
    githubUrl: 'https://github.com/waqas-yousaf/laravel-config-doctor',
    composerPackage: 'waqas-yousaf/laravel-config-doctor',
    techStack: ['PHP', 'Laravel', 'CLI', 'Static Analysis'],
  },
];
