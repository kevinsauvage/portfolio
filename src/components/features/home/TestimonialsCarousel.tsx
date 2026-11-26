'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import TestimonialCard from '@/components/features/home/TestimonialCard';
import { FOCUS_RING_SECONDARY } from '@/components/ui/focusRing';
import type { Testimonial } from '@/config/content/testimonials';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import { padIndex } from '@/lib/utils/format';

import clsx from 'clsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type TestimonialsCarouselProps = {
  testimonials: Testimonial[];
};

/** No scroll event for this long means the (smooth) scroll has settled. */
const SCROLL_SETTLE_MS = 120;
const SCROLL_FALLBACK_MS = 800;

type ArrowButtonProps = {
  side: 'left' | 'right';
  label: string;
  disabled: boolean;
  controls: string;
  onClick: () => void;
};

const ArrowButton = ({ side, label, disabled, controls, onClick }: ArrowButtonProps) => {
  const Icon = side === 'left' ? ArrowLeft : ArrowRight;

  return (
    <button
      type='button'
      onClick={onClick}
      // `aria-disabled` (not `disabled`): disabling the focused control at either
      // end would drop the keyboard focus the arrow keys rely on.
      aria-disabled={disabled}
      aria-label={label}
      aria-controls={controls}
      className={clsx(
        'flex size-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-100',
        'transition-[background-color,border-color,color,transform] duration-200 ease-out',
        'hover:border-primary-500/60 hover:bg-zinc-800 active:scale-95',
        'aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:border-zinc-700 aria-disabled:hover:bg-zinc-900/80 aria-disabled:active:scale-100',
        FOCUS_RING_SECONDARY
      )}
    >
      <Icon size={18} aria-hidden='true' />
    </button>
  );
};

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({ testimonials }) => {
  const count = testimonials.length;
  const trackId = useId();
  const regionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Slide a pending programmatic scroll is heading to; null once settled. */
  const pendingTarget = useRef<number | null>(null);
  const currentIndex = useRef(0);

  const [index, setIndex] = useState(0);
  // Announce position changes only after the visitor has moved the carousel.
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(
    () => () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
    },
    []
  );

  const armSettle = useCallback((delay: number) => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      pendingTarget.current = null;
    }, delay);
  }, []);

  /** The scroll position is the single source of truth: swipe, keys and buttons all end here. */
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;

    const next = Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));
    if (next !== currentIndex.current) {
      currentIndex.current = next;
      setIndex(next);
      setHasMoved(true);
    }

    armSettle(SCROLL_SETTLE_MS);
  }, [armSettle, count]);

  const scrollToSlide = useCallback(
    (target: number) => {
      const track = trackRef.current;
      if (!track) return;

      pendingTarget.current = target;
      // Fallback for a scroll that never fires an event (hidden track, same position).
      armSettle(SCROLL_FALLBACK_MS);
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      track.scrollTo({
        left: target * track.clientWidth,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    },
    [armSettle]
  );

  const step = useCallback(
    (offset: 1 | -1) => {
      // Build on the slide already being scrolled to, so quick repeated presses add up.
      const base = pendingTarget.current ?? index;
      const target = base + offset;
      if (target < 0 || target >= count) return;
      trackEvent(ANALYTICS_EVENTS.TESTIMONIALS_CAROUSEL_ARROW, {
        direction: offset === 1 ? 'next' : 'prev',
      });
      scrollToSlide(target);
    },
    [count, index, scrollToSlide]
  );

  const goToSlide = useCallback(
    (target: number) => {
      if (target === index) return;
      trackEvent(ANALYTICS_EVENTS.TESTIMONIALS_CAROUSEL_DOT, { index: String(target) });
      scrollToSlide(target);
    },
    [index, scrollToSlide]
  );

  const goToPrevious = useCallback(() => step(-1), [step]);
  const goToNext = useCallback(() => step(1), [step]);

  // Arrow keys work from the controls only: from inside a slide they would turn
  // that slide inert while it holds focus. The region itself is not a tab stop.
  useEffect(() => {
    const node = regionRef.current;
    if (!node) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof Node && trackRef.current?.contains(event.target)) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
      }
    };

    node.addEventListener('keydown', handleKeyDown);
    return () => node.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  return (
    <section
      ref={regionRef}
      className='space-y-6'
      aria-roledescription='carousel'
      aria-label='Testimonials'
    >
      {/* Every slide is in the DOM and the track is native scroll-snap, so a swipe,
          a key press and a button all use the same scroller. The track stretches
          its slides to the tallest one: the controls below never change height. */}
      <div
        ref={trackRef}
        id={trackId}
        onScroll={handleScroll}
        className='flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {testimonials.map((testimonial, slideIndex) => (
          <div
            key={testimonial.id}
            role='group'
            aria-roledescription='slide'
            aria-label={`Testimonial ${slideIndex + 1} of ${count}`}
            // Off-screen slides drop out of the tab order and the accessibility tree.
            inert={slideIndex !== index}
            className='w-full shrink-0 snap-center snap-always px-px'
          >
            <TestimonialCard
              author={testimonial.author}
              content={testimonial.content}
              excerpt={testimonial.excerpt}
              date={testimonial.date}
            />
          </div>
        ))}
      </div>

      <p role='status' className='sr-only'>
        {hasMoved ? `Testimonial ${index + 1} of ${count}` : ''}
      </p>

      {count > 1 && (
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center'>
            {testimonials.map((testimonial, slideIndex) => {
              const isActive = slideIndex === index;
              return (
                <button
                  key={testimonial.id}
                  type='button'
                  onClick={() => goToSlide(slideIndex)}
                  aria-label={`Go to testimonial ${slideIndex + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                  aria-controls={trackId}
                  className={clsx(
                    'group flex h-11 min-w-11 items-center justify-center rounded-full',
                    FOCUS_RING_SECONDARY
                  )}
                >
                  <span
                    aria-hidden='true'
                    className={clsx(
                      'h-1.5 rounded-full transition-[width,background-color] duration-300',
                      // Windows High Contrast drops background colors, which would
                      // leave a bar with nothing to see: outline it, and fill the
                      // active one with the system highlight.
                      'forced-colors:border forced-colors:border-[ButtonText]',
                      isActive
                        ? 'w-10 bg-primary-500 forced-colors:forced-color-adjust-none forced-colors:border-[Highlight] forced-colors:bg-[Highlight]'
                        : 'w-5 bg-zinc-700 group-hover:bg-zinc-500'
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div className='flex items-center gap-4'>
            <p aria-hidden='true' className='hidden font-mono text-sm text-zinc-400 sm:block'>
              <span className='text-zinc-50'>{padIndex(index + 1)}</span> / {padIndex(count)}
            </p>
            <div className='flex gap-2'>
              <ArrowButton
                side='left'
                label='Previous testimonial'
                disabled={index === 0}
                controls={trackId}
                onClick={goToPrevious}
              />
              <ArrowButton
                side='right'
                label='Next testimonial'
                disabled={index === count - 1}
                controls={trackId}
                onClick={goToNext}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsCarousel;
