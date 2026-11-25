// @ts-check
/** @typedef {import('./csp.config').CSPDirectives} CSPDirectives */

const SCRIPT_SRC_HOSTS = [
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://www.google.com',
  'https://www.gstatic.com',
];

const VERCEL_PREVIEW_HOST = 'https://vercel.live';

const isVercelPreview = () => process.env.VERCEL_ENV === 'preview';

/**
 * Every directive except `script-src` (built in {@link buildCsp}). Sentry goes
 * through the same-origin `/monitoring` tunnel.
 *
 * @type {CSPDirectives}
 */
export const cspDirectives = {
  'default-src': ["'self'"],
  'worker-src': ["'self'", 'blob:'],
  'child-src': ["'self'", 'blob:'],
  'connect-src': [
    "'self'",
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://www.google.com',
    'https://www.gstatic.com',
  ],
  'img-src': ["'self'", 'data:', 'blob:', 'https:'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'font-src': ["'self'", 'data:'],
  'frame-src': ['https://www.googletagmanager.com', 'https://www.google.com'],
  'frame-ancestors': ["'self'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'object-src': ["'none'"],
  other: ['upgrade-insecure-requests'],
};

/**
 * Static header (`next.config.mjs`). `'unsafe-inline'` instead of a nonce: a
 * nonce pins every route to dynamic rendering and this site is prerendered.
 * `'unsafe-eval'` is dev-only and must never reach production.
 *
 * @returns {string}
 */
export function buildCsp() {
  const devEval = process.env.NODE_ENV !== 'production' ? ["'unsafe-eval'"] : [];
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...devEval,
    ...SCRIPT_SRC_HOSTS,
    ...(isVercelPreview() ? [VERCEL_PREVIEW_HOST] : []),
  ];
  const directives = isVercelPreview()
    ? {
        ...cspDirectives,
        'frame-src': [...(cspDirectives['frame-src'] ?? []), VERCEL_PREVIEW_HOST],
        'connect-src': [...(cspDirectives['connect-src'] ?? []), VERCEL_PREVIEW_HOST],
      }
    : cspDirectives;
  return cspToString({ ...directives, 'script-src': scriptSrc });
}

/**
 * @param {CSPDirectives} directives
 * @returns {string}
 */
export function cspToString(directives) {
  const parts = [];
  for (const [name, values] of Object.entries(directives)) {
    if (name === 'other') {
      parts.push(values.join(' '));
    } else {
      parts.push(`${name} ${values.join(' ')}`);
    }
  }
  return parts.join('; ');
}
