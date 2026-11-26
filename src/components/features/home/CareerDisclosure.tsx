'use client';

import { useId, useState } from 'react';

import { FOCUS_RING } from '@/components/ui/focusRing';

import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

type CareerDisclosureProps = {
  /** Rendered outside the toggle so it stays a real heading. */
  heading: React.ReactNode;
  company: string;
  children: React.ReactNode;
};

const CareerDisclosure = ({ heading, company, children }: CareerDisclosureProps) => {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const label = open ? 'Hide details' : 'Show details';

  return (
    <div>
      <div className='flex items-start justify-between gap-4'>
        {heading}
        <button
          type='button'
          onClick={() => setOpen(previous => !previous)}
          aria-expanded={open}
          aria-label={`${label} for ${company}`}
          aria-controls={panelId}
          className={clsx(
            'mt-1 inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md text-xs font-medium text-primary-300 transition-colors hover:text-primary-200',
            FOCUS_RING
          )}
        >
          <span>{label}</span>
          <ChevronDown
            size={14}
            aria-hidden='true'
            className={clsx('transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
      </div>
      <div
        id={panelId}
        inert={!open}
        className={clsx(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className='overflow-hidden'>
          <div className='space-y-4 pt-4'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CareerDisclosure;
