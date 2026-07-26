import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { workHistory as workBase } from '../data/work.js';
import {
  skillStats as skillStatsBase,
  skillCategories as skillCategoriesBase,
  allTechnologies,
} from '../data/skills.js';
import { projects as projectsBase } from '../data/projects.js';
import { packages as packagesBase } from '../data/packages.js';
import { SITE_NAME, SITE_URL } from '../config/site.js';

const skillStatKeys = ['yearsInProduction', 'activeUsersServed', 'cloudProductsShipped', 'projectsDelivered'];

export function useWorkHistory() {
  const { t, i18n } = useTranslation();
  return useMemo(
    () =>
      workBase.map((job) => ({
        ...job,
        role: t(`work.items.${job.id}.role`),
        employmentType: t(`work.items.${job.id}.employmentType`),
        description: t(`work.items.${job.id}.description`),
      })),
    [t, i18n.language]
  );
}

export function useSkillStats() {
  const { t, i18n } = useTranslation();
  return useMemo(
    () =>
      skillStatsBase.map((stat, index) => ({
        ...stat,
        label: t(`skills.stats.${skillStatKeys[index]}`),
      })),
    [t, i18n.language]
  );
}

export function useSkillCategories() {
  const { t, i18n } = useTranslation();
  return useMemo(
    () =>
      skillCategoriesBase.map((category) => ({
        ...category,
        title: t(`skills.categories.${category.id}.title`),
        summary: t(`skills.categories.${category.id}.summary`),
      })),
    [t, i18n.language]
  );
}

export function useEcosystemSkills() {
  const { t, i18n } = useTranslation();
  return useMemo(
    () => ({
      title: t('skills.ecosystem.title'),
      description: t('skills.ecosystem.description'),
      countLabel: t('skills.ecosystem.count', { count: allTechnologies.length }),
      items: allTechnologies,
    }),
    [t, i18n.language]
  );
}

export function useProjects() {
  const { t, i18n } = useTranslation();
  return useMemo(
    () =>
      projectsBase.map((project) => ({
        ...project,
        title: t(`projects.items.${project.id}.title`),
        description: t(`projects.items.${project.id}.description`),
      })),
    [t, i18n.language]
  );
}

const privacySectionKeys = [
  'overview',
  'informationWeCollect',
  'cookiesAndStorage',
  'thirdPartyServices',
  'legalBases',
  'dataRetention',
  'yourRights',
  'contact',
];

const termsSectionKeys = [
  'agreement',
  'useOfWebsite',
  'developerToolsDisclaimer',
  'intellectualProperty',
  'thirdPartyLinks',
  'limitationOfLiability',
  'changes',
];

const legalInterpolation = { siteName: SITE_NAME, siteUrl: SITE_URL };

function translationArray(t, key, interpolation = legalInterpolation) {
  const value = t(key, { returnObjects: true, ...interpolation });
  return Array.isArray(value) ? value : [];
}

function translationList(t, key, interpolation = legalInterpolation) {
  const value = t(key, { returnObjects: true, ...interpolation });
  return Array.isArray(value) ? value : null;
}

export function usePrivacySections() {
  const { t, i18n } = useTranslation();
  return useMemo(
    () =>
      privacySectionKeys.map((key) => ({
        title: t(`legal.privacy.sections.${key}.title`, legalInterpolation),
        paragraphs: translationArray(t, `legal.privacy.sections.${key}.paragraphs`),
        list: translationList(t, `legal.privacy.sections.${key}.list`),
      })),
    [t, i18n.language]
  );
}

export function useTermsSections() {
  const { t, i18n } = useTranslation();
  return useMemo(
    () =>
      termsSectionKeys.map((key) => ({
        title: t(`legal.terms.sections.${key}.title`, legalInterpolation),
        paragraphs: translationArray(t, `legal.terms.sections.${key}.paragraphs`),
        list: translationList(t, `legal.terms.sections.${key}.list`),
      })),
    [t, i18n.language]
  );
}

export function usePackages() {
  const { t, i18n } = useTranslation();
  return useMemo(
    () =>
      packagesBase.map((pkg) => ({
        ...pkg,
        tagline: t(`packages.items.${pkg.id}.tagline`),
        description: t(`packages.items.${pkg.id}.description`),
        features: t(`packages.items.${pkg.id}.features`, { returnObjects: true }),
      })),
    [t, i18n.language]
  );
}

