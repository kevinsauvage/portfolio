import { CONTACT_EMAIL, PERSON_NAME } from '@/config/site';

type Language = {
  language: string;
  level: string;
  credentialUrl?: string;
};

export const sections = {
  hero: {
    title: {
      firstLine: 'Frontend Engineer ·',
      secondLine: 'Web Accessibility & Performance',
    },
    description:
      'I build React and Next.js apps at Keolis, remotely from Barcelona, with a focus on accessibility and performance. Before that I spent almost four years at Decathlon, building storefronts with Svelte.',
    primaryCta: 'See my experience',
  },
  about: {
    title: `Hi, I'm ${PERSON_NAME}`,
    currently: 'Currently at Keolis Group (remote)',
    paragraphs: [
      "I'm a frontend developer in Barcelona, working mostly with React, Next.js, Svelte and TypeScript.",
      'I got into this during the 2020 lockdown. I was bored, so I spent the time learning to code, then did the Le Wagon bootcamp and got my first developer job in 2021.',
      'Before that I spent seven years in very different jobs: customer service at Avis, managing a small business, and the front desk at Soho House.',
      'At Keolis I started as the accessibility specialist and only developer on ilévia, a French public transit platform. RGAA compliance went from 30% to 84%, and I added accessibility checks to CI so problems get caught earlier.',
      "Now that's in place, my work has become more general frontend development.",
      'Before Keolis I spent almost four years at Decathlon, where I built a Svelte component library used by storefronts in more than 15 countries and worked on page speed for the Spanish site.',
      'What I enjoy most is a difficult problem with a simple solution, and keeping a codebase clean.',
    ],
    stackTitle: 'Tech stack',
    stack: [
      'React',
      'Next.js',
      'Svelte',
      'TypeScript',
      'Tailwind CSS',
      'GraphQL',
      'Shopify',
      'Testing Library',
      'Jest',
      'Cypress',
      'axe',
      'GitHub Actions',
      'Sentry',
      'WCAG 2.2',
      'Storybook',
      'Figma',
    ],
    languagesTitle: 'Languages',
    languages: [
      { language: 'French', level: 'Native' },
      {
        language: 'English',
        level: 'C1 Certified',
        credentialUrl: 'https://cert.efset.org/W8vpXL',
      },
      { language: 'Spanish', level: 'Fluent' },
    ] as ReadonlyArray<Language>,
  },
  career: {
    title: 'Experience',
    description:
      'Where I have worked and what I did there, from component libraries to performance and accessibility.',
  },
  portfolio: {
    title: 'Projects',
    description: "Some things I've built outside my day job.",
    buttons: {
      viewLive: 'View Live',
      sourceCode: 'Source Code',
      caseStudy: 'Read case study',
    },
    caseStudy: {
      overline: 'Case study',
      overview: 'Overview',
      overviewTitle: 'The problem & the approach',
      responsibilities: 'What I owned',
      featuresOverline: 'Product',
      featuresTitle: 'What it does',
      engineeringOverline: 'Engineering',
      engineeringTitle: 'How it is built',
      qualityOverline: 'Quality',
      qualityTitle: 'Tested, typed and accessible',
      qualityCaption: 'Quality & delivery',
      galleryOverline: 'Screens',
      galleryTitle: 'Product walkthrough',
      ctaTitle: 'Want to see it live?',
      ctaDescription:
        'The demo store is online: browse the catalog, switch language and add to cart. It runs on a Shopify test store, so nothing is sold. The source code is private, so I am happy to walk through it on a call.',
      backCta: 'Back to portfolio',
    },
  },
  testimonials: {
    title: 'What colleagues say',
    description: 'A few words from colleagues and managers I have had the chance to work with.',
    readMore: 'Read full',
    showLess: 'Show less',
  },
  contact: {
    title: "Let's connect",
    description: 'Based in Barcelona, working remotely at Keolis Group. Feel free to get in touch.',
    email: CONTACT_EMAIL,
    location: 'Barcelona, Spain (CET, UTC+1) · English, French, Spanish',
    form: {
      ariaLabel: 'Contact form',
      title: 'Send a message',
      requiredHint: 'Fields marked with an asterisk (*) are required.',
      labels: { fullName: 'Full name', email: 'Email', message: 'Message' },
      placeholders: {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Tell me about the project, the role, or the question on your mind.',
      },
      replyPromise: 'I reply within 24 hours on weekdays.',
      submit: 'Send message',
      submitting: 'Sending...',
      announceSubmitting: 'Sending message...',
      sentTitle: 'Message sent',
      sentFallback: "Thanks, I'll get back to you within 24 hours on weekdays.",
      sendAnother: 'Send another message',
      errors: {
        recaptchaUnavailable:
          'The security check is still loading. Please try again in a moment, or refresh the page.',
        recaptchaToken: 'Failed to get reCAPTCHA token',
        unexpected:
          'An unexpected error occurred while sending your message. Please try again later.',
        invalidValue: 'Invalid value',
      },
    },
    socialLead: 'Or connect with me on social media',
    emailCopy: {
      label: 'Copy',
      labelFor: 'Copy email address',
      copied: 'Copied',
      copiedFor: 'Email address copied',
      error: 'Could not copy the email address. Please copy it manually.',
    },
  },
  faq: {
    title: 'Common questions',
    description: 'What people usually ask before getting in touch.',
  },
  certifications: {
    title: 'Learning',
    description:
      'What I am learning at the moment, my English certificate and a few earlier courses.',
    button: 'View Credential',
    earlierTitle: 'Earlier courses',
  },
} as const;
