'use client';

import { useState } from 'react';

import { NEW_TAB_LABEL } from '@/components/ui/NewTabHint';
import { sections } from '@/config/content/sections';
import type { Testimonial } from '@/config/content/testimonials';
import { LINKEDIN_URL } from '@/config/site';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import { toDateTime } from '@/lib/utils/date';

import clsx from 'clsx';
import { Calendar, ChevronDown, ExternalLink, Quote } from 'lucide-react';

type TestimonialCardProps = Pick<Testimonial, 'author' | 'content' | 'excerpt' | 'date'>;

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts.at(0)?.at(0) ?? '';
  const last = parts.length > 1 ? (parts.at(-1)?.at(0) ?? '') : '';
  return `${first}${last}`.toUpperCase();
};

const CHIP =
  'inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300';

const TestimonialContent = ({
  authorName,
  content,
  excerpt,
}: {
  authorName: string;
  content: string;
  excerpt: string;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='space-y-4'>
      <blockquote
        className={clsx(
          'text-lg font-medium leading-relaxed text-zinc-100 md:text-xl lg:text-2xl lg:leading-snug',
          // The clamp only previews the excerpt: once expanded it would keep
          // cutting the full text off at six lines (and at 200% text size).
          !expanded && 'line-clamp-6'
        )}
      >
        &ldquo;{expanded ? content : excerpt}&rdquo;
      </blockquote>
      <div className='flex flex-wrap items-center gap-x-5 gap-y-1'>
        <button
          type='button'
          onClick={() => setExpanded(previous => !previous)}
          aria-expanded={expanded}
          className='inline-flex min-h-11 items-center gap-1 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:text-zinc-50'
        >
          {expanded ? sections.testimonials.showLess : sections.testimonials.readMore}
          <ChevronDown
            size={16}
            aria-hidden='true'
            className={clsx('transition-transform duration-200', expanded && 'rotate-180')}
          />
        </button>
        <a
          href={LINKEDIN_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary-300 underline-offset-4 transition-colors duration-200 hover:text-primary-200 hover:underline'
          data-analytics-event={ANALYTICS_EVENTS.TESTIMONIAL_LINKEDIN_CLICK}
          aria-label={`Via LinkedIn — read ${authorName}'s full recommendation (${NEW_TAB_LABEL})`}
        >
          Via LinkedIn
          <ExternalLink size={14} aria-hidden='true' />
        </a>
      </div>
    </div>
  );
};

const TestimonialAuthor = ({ author, date }: Pick<Testimonial, 'author' | 'date'>) => (
  <div className='flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-zinc-800/70 pt-6'>
    <span
      aria-hidden='true'
      className='flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500/30 to-secondary-500/30 font-mono text-sm font-semibold text-zinc-50 ring-1 ring-zinc-700'
    >
      {getInitials(author.name)}
    </span>
    <div className='min-w-0 flex-1'>
      <cite className='block text-base font-semibold not-italic text-zinc-50 md:text-lg'>
        {author.name}
      </cite>
      <p className='text-sm text-zinc-400'>
        {author.title} · {author.company}
      </p>
    </div>
    <div className='flex flex-wrap gap-2'>
      <span className={CHIP}>{author.relationship}</span>
      <span className={CHIP}>
        <Calendar size={12} aria-hidden='true' />
        <time dateTime={toDateTime(date)}>{date}</time>
      </span>
    </div>
  </div>
);

const TestimonialCard: React.FC<TestimonialCardProps> = ({ author, content, excerpt, date }) => (
  <div className='relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/50 to-zinc-950/80 p-6 ring-1 ring-inset ring-white/[0.04] sm:p-7 md:p-8'>
    <Quote
      aria-hidden='true'
      strokeWidth={1.25}
      className='pointer-events-none absolute -right-2 -top-2 size-24 text-primary-500/10 md:size-36'
    />
    <div className='relative'>
      <TestimonialContent authorName={author.name} content={content} excerpt={excerpt} />
    </div>
    <TestimonialAuthor author={author} date={date} />
  </div>
);

export default TestimonialCard;
