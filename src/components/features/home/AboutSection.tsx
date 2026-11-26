import Reveal from '@/components/shared/Reveal';
import { NEW_TAB_LABEL } from '@/components/ui/NewTabHint';
import Section, { SECTION_STACK } from '@/components/ui/Section';
import { Tag } from '@/components/ui/Tag';
import { Body, H2 } from '@/components/ui/Typography';
import { jobs, sections } from '@/config/content';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

import { ExternalLink } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <Section id='about'>
      <div className={SECTION_STACK}>
        <div className='space-y-8'>
          <Reveal>
            <H2>{sections.about.title}</H2>
          </Reveal>
          <Reveal
            as='p'
            delay={150}
            className='inline-flex flex-wrap items-center gap-2.5 rounded-full border border-primary-800/60 bg-primary-950/40 px-4 py-2 font-mono text-xs font-medium tracking-wide text-primary-300'
          >
            <span className='relative flex h-2 w-2' aria-hidden='true'>
              <span className='animate-ping [animation-iteration-count:5] absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75' />
              <span className='relative inline-flex rounded-full h-2 w-2 bg-primary-400' />
            </span>
            <span className='sr-only'>Current role: </span>
            <a
              href={`#${jobs[0]?.id}`}
              className='underline-offset-4 hover:underline focus-visible:underline'
            >
              {sections.about.currently}
            </a>
          </Reveal>
          <div className='grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16'>
            <Reveal delay={300} className='space-y-4'>
              {sections.about.paragraphs.map(paragraph => (
                <Body key={paragraph} className='max-w-3xl'>
                  {paragraph}
                </Body>
              ))}
            </Reveal>
            <div className='space-y-8 lg:border-l lg:border-zinc-800 lg:pl-10'>
              <Reveal className='space-y-3' delay={450}>
                <p className='font-mono text-xs font-medium uppercase tracking-[0.18em] text-zinc-400'>
                  {sections.about.languagesTitle}
                </p>
                <ul className='flex flex-wrap gap-2 lg:flex-col lg:items-start'>
                  {sections.about.languages.map(lang => (
                    <li
                      key={lang.language}
                      className='inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm'
                    >
                      <span className='text-zinc-100'>{lang.language}</span>
                      {lang.credentialUrl ? (
                        <a
                          href={lang.credentialUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          data-analytics-event={ANALYTICS_EVENTS.OUTBOUND_LINK_CLICK}
                          data-analytics-url={lang.credentialUrl}
                          data-analytics-location='about'
                          className='-my-2.5 inline-flex min-h-11 items-center gap-1 py-2.5 font-mono text-xs text-primary-300 transition-colors hover:text-primary-200'
                        >
                          {lang.level}
                          <span className='sr-only'>
                            {' '}
                            — {lang.language} credential ({NEW_TAB_LABEL})
                          </span>
                          <ExternalLink size={12} aria-hidden='true' />
                        </a>
                      ) : (
                        <span className='font-mono text-xs text-zinc-400'>{lang.level}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className='space-y-3' delay={600}>
                <p className='font-mono text-xs font-medium uppercase tracking-[0.18em] text-zinc-400'>
                  {sections.about.stackTitle}
                </p>
                <ul className='flex flex-wrap gap-2'>
                  {sections.about.stack.map(skill => (
                    <li key={skill}>
                      <Tag>{skill}</Tag>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AboutSection;
