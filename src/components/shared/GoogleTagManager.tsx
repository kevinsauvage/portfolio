'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

import {
  applyConsentToGtag,
  normalizeGtmId,
  normalizeMeasurementId,
  pushGoogleTagBootstrap,
} from '@/lib/analytics';
import { CONSENT_UPDATED_EVENT, hasTagManagerConsent } from '@/lib/consent';

type Properties = {
  ga4MeasurementId?: string | undefined;
  gtmId?: string | undefined;
};

/**
 * Loads both scripts only after a consent grant, re-asserting the stored choice
 * on `gtag` first so they start granted instead of on the denied defaults.
 *
 * The Google tag is loaded here, not by the container's `Google Tag` tag: that
 * path pulls gtag.js with `cx=c` and never issues the GA4 configuration, so GA4
 * gets no hits. The container still owns the GA4 event tags that forward our
 * `dataLayer` events. `lazyOnload`: ~900 KB, only ever fetched post-consent.
 */
const GoogleTagManager = ({ ga4MeasurementId, gtmId }: Properties) => {
  const measurementId = normalizeMeasurementId(ga4MeasurementId);
  const containerId = normalizeGtmId(gtmId);
  const [hasConsent, setHasConsent] = useState(false);
  const bootstrapped = useRef(false);

  useEffect(() => {
    const sync = () => {
      applyConsentToGtag();
      setHasConsent(hasTagManagerConsent());
    };

    sync();
    window.addEventListener(CONSENT_UPDATED_EVENT, sync);

    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, sync);
  }, []);

  useEffect(() => {
    // Once per page load: re-granting consent must not queue a second config/page_view.
    if (!hasConsent || !measurementId || bootstrapped.current) return;
    bootstrapped.current = true;
    pushGoogleTagBootstrap(measurementId);
  }, [hasConsent, measurementId]);

  if (!hasConsent) return null;

  return (
    <>
      {measurementId ? (
        <Script
          id='google-tag'
          strategy='lazyOnload'
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        />
      ) : null}
      {containerId ? (
        <Script
          id='google-tag-manager'
          strategy='lazyOnload'
          src={`https://www.googletagmanager.com/gtm.js?id=${containerId}`}
        />
      ) : null}
    </>
  );
};

export default GoogleTagManager;
