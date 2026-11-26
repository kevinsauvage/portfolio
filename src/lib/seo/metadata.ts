import type { Metadata } from 'next';

import { PERSON_NAME } from '@/config/site';
import { getPublicEnv } from '@/lib/env';
import { SEARCH_TITLE, SITE_DESCRIPTION, SITE_KEYWORDS } from '@/lib/seo/schemas';

/** 48px multiples are what Google Search accepts as the site icon. */
const ICONS: Metadata['icons'] = {
  apple: { sizes: '180x180', url: '/apple-touch-icon.png' },
  icon: [
    { sizes: '48x48', type: 'image/png', url: '/favicon-48x48.png' },
    { sizes: '192x192', type: 'image/png', url: '/android-chrome-192x192.png' },
    { sizes: 'any', type: 'image/x-icon', url: '/favicon.ico' },
  ],
};

export function buildRootMetadata(baseUrl: string): Metadata {
  return {
    alternates: {
      canonical: baseUrl,
    },
    authors: [{ name: PERSON_NAME }],
    category: 'Technology',
    creator: PERSON_NAME,
    description: SITE_DESCRIPTION,
    icons: ICONS,
    keywords: SITE_KEYWORDS,
    metadataBase: new URL(baseUrl),
    openGraph: {
      description: SITE_DESCRIPTION,
      locale: 'en_US',
      siteName: SEARCH_TITLE,
      title: SEARCH_TITLE,
      type: 'website',
      url: baseUrl,
    },
    publisher: PERSON_NAME,
    robots: {
      follow: true,
      googleBot: {
        follow: true,
        index: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
      index: true,
    },
    title: {
      default: SEARCH_TITLE,
      template: `%s | ${PERSON_NAME}`,
    },
    twitter: {
      card: 'summary_large_image',
      description: SITE_DESCRIPTION,
      title: SEARCH_TITLE,
    },
    verification: {
      google: getPublicEnv().GOOGLE_SITE_VERIFICATION,
    },
  };
}
