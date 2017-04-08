import { COOKIE_CONSENT_KEY, GA_MEASUREMENT_ID } from '../data/legal';

const CONSENT_VERSION = 1;

function loadGoogleAnalytics() {
  if (typeof window === 'undefined' || window.__wyAnalyticsLoaded || !GA_MEASUREMENT_ID) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.onload = () => {
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  };
  document.head.appendChild(script);
  window.__wyAnalyticsLoaded = true;
}

export function readCookieConsent() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCookieConsent(choice) {
  const consent = {
    version: CONSENT_VERSION,
    essential: true,
    analytics: choice === 'all',
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));

  if (consent.analytics) {
    loadGoogleAnalytics();
  }

  return consent;
}

export function applyStoredConsent() {
  const consent = readCookieConsent();
  if (consent?.analytics) {
    loadGoogleAnalytics();
  }
  return consent;
}

export function resetCookieConsent() {
  window.localStorage.removeItem(COOKIE_CONSENT_KEY);
  window.location.reload();
}

export function hasConsentDecision() {
  return Boolean(readCookieConsent());
}
