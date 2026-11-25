/**
 * Consent Mode v2 categories plus the event bus shared by the banner, the GTM
 * loader and `trackEvent`. Hand-written (no CMP) and mirrored in the sibling
 * ecommerce repo. Opt-in: nothing is granted until the visitor says so.
 */

export type ConsentSettings = {
  ad_storage: boolean;
  analytics_storage: boolean;
  functionality_storage: boolean;
  personalization_storage: boolean;
};

export type ConsentStatus = 'granted' | 'denied';

export type ConsentSignals = Record<keyof ConsentSettings, ConsentStatus> & {
  ad_user_data: ConsentStatus;
  ad_personalization: ConsentStatus;
};

export const CONSENT_COOKIE = 'localConsent';

/** Bump with the categories: an older stored choice is discarded, not honoured. */
export const CONSENT_VERSION = 1;

export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 182;

export const CONSENT_UPDATED_EVENT = 'consentUpdated';

export const OPEN_CONSENT_SETTINGS_EVENT = 'openConsentSettings';

export const DENIED_CONSENT: ConsentSettings = {
  ad_storage: false,
  analytics_storage: false,
  functionality_storage: true,
  personalization_storage: false,
};

export const GRANTED_CONSENT: ConsentSettings = {
  ad_storage: true,
  analytics_storage: true,
  functionality_storage: true,
  personalization_storage: true,
};

const toStatus = (value: boolean): ConsentStatus => (value ? 'granted' : 'denied');

export const consentSignals = (settings: ConsentSettings): ConsentSignals => ({
  ad_storage: toStatus(settings.ad_storage),
  ad_user_data: toStatus(settings.ad_storage),
  ad_personalization: toStatus(settings.ad_storage),
  analytics_storage: toStatus(settings.analytics_storage),
  functionality_storage: toStatus(settings.functionality_storage),
  personalization_storage: toStatus(settings.personalization_storage),
});

type StoredConsent = ConsentSettings & { version: number };

/** `null` when absent, unreadable or stale; a missing category counts as refused. */
export const readStoredConsent = (): ConsentSettings | null => {
  if (typeof document === 'undefined') return null;

  let parsed: unknown;
  try {
    const raw = readCookie(CONSENT_COOKIE);
    parsed = JSON.parse(raw ? decodeURIComponent(raw) : 'null');
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== 'object') return null;

  const stored = parsed as Partial<StoredConsent>;
  if (stored.version !== CONSENT_VERSION) return null;

  return {
    ad_storage: stored.ad_storage === true,
    analytics_storage: stored.analytics_storage === true,
    functionality_storage: stored.functionality_storage === true,
    personalization_storage: stored.personalization_storage === true,
  };
};

export const writeStoredConsent = (settings: ConsentSettings): void => {
  if (typeof document === 'undefined') return;

  const value = encodeURIComponent(JSON.stringify({ ...settings, version: CONSENT_VERSION }));
  const secure = globalThis.location?.protocol === 'https:' ? '; Secure' : '';

  try {
    document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
  } catch {}
};

export const hasAnalyticsConsent = (): boolean => readStoredConsent()?.analytics_storage === true;

export const hasTagManagerConsent = (): boolean => {
  const consent = readStoredConsent();

  return Boolean(consent?.analytics_storage || consent?.ad_storage);
};

export const consentFromFormData = (formData: FormData): ConsentSettings => ({
  ad_storage: formData.has('ad_storage'),
  analytics_storage: formData.has('analytics_storage'),
  functionality_storage: true,
  personalization_storage: formData.has('personalization_storage'),
});

const dispatch = (name: string): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(name));
};

export const dispatchConsentUpdated = (): void => dispatch(CONSENT_UPDATED_EVENT);

export const openConsentSettings = (): void => dispatch(OPEN_CONSENT_SETTINGS_EVENT);

/** Reads one cookie's raw value; `''` when absent. */
function readCookie(name: string): string {
  if (typeof document === 'undefined') return '';

  for (const entry of document.cookie.split(';')) {
    const cookie = entry.trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.slice(name.length + 1);
    }
  }

  return '';
}
