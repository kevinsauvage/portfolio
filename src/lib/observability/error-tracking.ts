import { trackEvent } from '../analytics';
import { ANALYTICS_EVENTS } from '../analytics/events';

import * as Sentry from '@sentry/nextjs';

/** Coarse identifiers only (codes, statuses, counts) — never PII or provider payloads. */
export type ErrorContext = Record<string, string | number | boolean | undefined>;

// Only `code` reaches analytics; the error message and `context` stay in Sentry
// on purpose.

export function logError(error: Error, code: string, context?: ErrorContext): void {
  console.error('Error logged:', { code, message: error.message, stack: error.stack });

  Sentry.captureException(error, {
    tags: { code },
    extra: context ? { code, ...context } : { code },
  });

  trackEvent(ANALYTICS_EVENTS.ERROR_CLIENT, { code });
}
