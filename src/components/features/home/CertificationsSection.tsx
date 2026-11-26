import Reveal from '@/components/shared/Reveal';
import { NEW_TAB_LABEL } from '@/components/ui/NewTabHint';
import Section, { SECTION_STACK, SectionHeader } from '@/components/ui/Section';
import { sections } from '@/config/content';
import certifications, { earlierCredentials } from '@/config/content/certifications';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import { toDateTime } from '@/lib/utils/date';

import CertificationCard from './CertificationCard';

import clsx from 'clsx';
import { ExternalLink } from 'lucide-react';

const CertificationsSection: React.FC = () => {
  return (
    <Section id='certifications'>
      <div className={SECTION_STACK}>
        <SectionHeader
          title={sections.certifications.title}
          description={sections.certifications.description}
        />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {certifications.map((cert, index) => (
            <Reveal
              key={cert.id}
              delay={index * 60}
              className={clsx('h-full', cert.featured && 'lg:col-span-2')}
            >
              <CertificationCard {...cert} index={index} />
            </Reveal>
          ))}
        </div>

        <Reveal className='space-y-4'>
          <p className='font-mono text-xs font-medium uppercase tracking-[0.18em] text-zinc-400'>
            {sections.certifications.earlierTitle}
          </p>
          <ul className='divide-y divide-zinc-800/70 border-y border-zinc-800/70'>
            {earlierCredentials.map(({ id, title, issuer, date, credentialUrl }) => (
              <li
                key={id}
                className='flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3'
              >
                <a
                  href={credentialUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  data-analytics-event={ANALYTICS_EVENTS.CERT_CREDENTIAL_CLICK}
                  data-analytics-cert-id={id}
                  className='inline-flex min-h-11 items-center gap-2 text-sm text-zinc-100 transition-colors hover:text-primary-300'
                >
                  {title}
                  <ExternalLink size={14} aria-hidden='true' />
                  <span className='sr-only'>({NEW_TAB_LABEL})</span>
                </a>
                <span className='text-xs text-zinc-400'>
                  {issuer} · <time dateTime={toDateTime(date)}>{date}</time>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
};

export default CertificationsSection;
