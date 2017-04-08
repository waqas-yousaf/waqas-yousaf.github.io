import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en/index.js';
import de from '../locales/de/index.js';
import { DEFAULT_LOCALE } from './paths.js';

i18n.use(initReactI18next).init({
  resources: {
    en,
    de,
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: ['en', 'de'],
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
