'use client';

import { useId, useState } from 'react';

import { FOCUS_RING } from '@/components/ui/focusRing';
import { BodySmall } from '@/components/ui/Typography';

import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

const VISIBLE_HIGHLIGHTS = 3;

export const HighlightItems = ({ items }: { items: string[] }) => (
  <ul className='space-y-2 list-none pl-0'>
    {items.map(item => (
      <li key={item} className='flex gap-3'>
        <span className='mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-zinc-500' aria-hidden />
        <BodySmall className='min-w-0 flex-1 text-zinc-200'>{item}</BodySmall>
      </li>
    ))}
  </ul>
);

const CareerHighlights = ({ items }: { items: string[] }) => {
  const [expanded, setExpanded] = useState(false);
  const extraId = useId();
  const extra = items.slice(VISIBLE_HIGHLIGHTS);

  return (
    <div>
      <HighlightItems items={items.slice(0, VISIBLE_HIGHLIGHTS)} />
      {extra.length > 0 && (
        <>
          {/* The extra bullets stay in the DOM and animate open through the grid row
              height; `inert` keeps them out of the tab order and the accessibility
              tree while folded. */}
          <div
            id={extraId}
            inert={!expanded}
            className={clsx(
              'grid transition-[grid-template-rows] duration-300 ease-out',
              expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            )}
          >
            <div className='overflow-hidden'>
              <div className='pt-2'>
                <HighlightItems items={extra} />
              </div>
            </div>
          </div>
          <button
            type='button'
            onClick={() => setExpanded(previous => !previous)}
            aria-expanded={expanded}
            aria-controls={extraId}
            className={clsx(
              'mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-md text-xs font-medium text-primary-300 transition-colors hover:text-primary-200',
              FOCUS_RING
            )}
          >
            <ChevronDown
              size={14}
              aria-hidden='true'
              className={clsx('transition-transform duration-200', expanded && 'rotate-180')}
            />
            {expanded ? 'Show less' : `Show ${extra.length} more`}
          </button>
        </>
      )}
    </div>
  );
};

export default CareerHighlights;
