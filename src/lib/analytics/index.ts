export type { AnalyticsEventName } from './events';
export { ANALYTICS_EVENTS } from './events';

import {
  type ConsentSettings,
  consentSignals,
  hasAnalyticsConsent,
  readStoredConsent,
} from '../consent';

import { GA4_MEASUREMENT_ID_PATTERN, GTM_ID_PATTERN } from './ids';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (
      command: 'config' | 'event' | 'consent' | 'set' | 'js',
      target: string | Date,
      params?: Record<string, unknown>
    ) => void;
  }
}

export type AnalyticsEventData = Record<string, unknown>;

export type TrackStatus = 'sent' | 'dropped';

/** GA4's documented limits; @see https://support.google.com/analytics/answer/9267744 */
const MAX_EVENT_DATA_PROPERTIES = 25;
const MAX_STRING_LENGTH = 100;

function isBrowser(): boolean {
  return globalThis.window !== undefined;
}

function isDoNotTrackEnabled(): boolean {
  if (!isBrowser()) return false;
  const navigator_ = globalThis.window.navigator as Navigator & { doNotTrack?: unknown };
  const doNotTrack =
    navigator_.doNotTrack ??
    (globalThis.window as unknown as Record<string, unknown>)['doNotTrack'];
  return doNotTrack === '1' || doNotTrack === 'yes';
}

/** `NEXT_PUBLIC_ANALYTICS_ENABLE_IN_DEV=true` opts in locally. */
function isAnalyticsEnabled(): boolean {
  if (process.env.NODE_ENV === 'production') return true;
  return process.env['NEXT_PUBLIC_ANALYTICS_ENABLE_IN_DEV'] === 'true';
}

/** Send only with a browser, tracking enabled, no DNT, and analytics consent. */
function canTrack(): boolean {
  return isBrowser() && isAnalyticsEnabled() && !isDoNotTrackEnabled() && hasAnalyticsConsent();
}

function sanitizeValue(value: unknown): string | number | boolean | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value.slice(0, MAX_STRING_LENGTH);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return undefined;
    return Math.round(value * 10_000) / 10_000;
  }
  if (typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.join(',').slice(0, MAX_STRING_LENGTH);
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value).slice(0, MAX_STRING_LENGTH);
    } catch {
      return undefined;
    }
  }
  if (typeof value === 'bigint') {
    return value.toString().slice(0, MAX_STRING_LENGTH);
  }
  if (typeof value === 'symbol') {
    return value.description?.slice(0, MAX_STRING_LENGTH);
  }
  return undefined;
}

/** Clamps to GA4's limits (100 chars, 4 decimals, 25 props); drops unserializable. */
export function sanitizeEventData(
  data?: AnalyticsEventData
): Record<string, string | number | boolean> {
  if (!data || typeof data !== 'object') return {};
  const entries: Array<[string, string | number | boolean]> = [];
  for (const [key, value] of Object.entries(data)) {
    if (entries.length >= MAX_EVENT_DATA_PROPERTIES) break;
    const sanitized = sanitizeValue(value);
    if (sanitized !== undefined) entries.push([key, sanitized]);
  }
  return Object.fromEntries(entries);
}

function pushToDataLayer(payload: Record<string, unknown>): void {
  if (!isBrowser()) return;

  globalThis.window.dataLayer ??= [];
  globalThis.window.dataLayer.push(payload);
}

/**
 * Never throws. No queue: the dataLayer is the queue, so events pushed before
 * `gtm.js` are replayed. Pre-consent events are dropped on purpose.
 */
export function trackEvent(eventName: string, data?: AnalyticsEventData): TrackStatus {
  if (!eventName || !canTrack()) return 'dropped';

  pushToDataLayer({ event: eventName, ...sanitizeEventData(data) });
  return 'sent';
}

/**
 * Re-asserts the stored choice on `gtag` before GTM loads. The inline default
 * script starts every category at `denied`, so this is what actually grants them.
 */
export function applyConsentToGtag(settings?: ConsentSettings | null): void {
  if (!isBrowser() || typeof globalThis.window.gtag !== 'function') return;

  const consent = settings ?? readStoredConsent();
  if (!consent) return;

  globalThis.window.gtag('consent', 'update', consentSignals(consent));
}

/**
 * A validated container id, or `undefined`. Keeps a malformed value out of the
 * `gtm.js` URL even when env validation was skipped (e.g. a plain unit test).
 */
export function normalizeGtmId(id: string | undefined): string | undefined {
  return id && GTM_ID_PATTERN.test(id) ? id : undefined;
}

/**
 * A validated GA4 measurement id, or `undefined`. Same guard as
 * {@link normalizeGtmId}: nothing interpolates into the `gtag/js` URL unchecked.
 */
export function normalizeMeasurementId(id: string | undefined): string | undefined {
  return id && GA4_MEASUREMENT_ID_PATTERN.test(id) ? id : undefined;
}

/**
 * Queues the Google tag bootstrap (`gtag('js')` + `gtag('config')`). The pushes
 * land in the dataLayer and gtag.js replays them when it loads, so this runs
 * before the script tag is fetched.
 */
export function pushGoogleTagBootstrap(measurementId: string): void {
  if (!isBrowser() || typeof globalThis.window.gtag !== 'function') return;

  globalThis.window.gtag('js', new Date());
  globalThis.window.gtag('config', measurementId);
}

/**
 * Reports a client-side route change to GA4 as a `page_view`.
 *
 * The initial pageview is sent by the GA4 `config` call; only App Router
 * navigations (which never reload the document) reach this. `gtag` is the same
 * function `ConsentModeDefaults` installs, so the event is not lost if it fires
 * before gtag.js has loaded. Consent, DNT and the dev guard are all enforced by
 * {@link canTrack}.
 */
export function trackPageView(): TrackStatus {
  if (!canTrack() || typeof globalThis.window.gtag !== 'function') return 'dropped';

  globalThis.window.gtag('event', 'page_view', {
    page_location: globalThis.window.location.href,
    page_title: globalThis.window.document.title,
  });
  return 'sent';
}
