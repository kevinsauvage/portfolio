import testimonials from '@/config/content/testimonials';

import TestimonialsCarousel from './TestimonialsCarousel';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));

const SLIDE_WIDTH = 500;

/** jsdom has no layout or `scrollTo`: model a track whose slides are 500px wide. */
const installScroller = () => {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(SLIDE_WIDTH);
  HTMLElement.prototype.scrollTo = function scrollTo(this: HTMLElement, options?: unknown) {
    this.scrollLeft = (options as ScrollToOptions).left ?? 0;
    this.dispatchEvent(new Event('scroll'));
  } as typeof HTMLElement.prototype.scrollTo;
};

const settle = () => {
  act(() => {
    vi.advanceTimersByTime(200);
  });
};

const slides = () => screen.getAllByRole('group', { name: /^testimonial \d+ of \d+$/i });
const activeSlides = () => slides().filter(slide => !slide.hasAttribute('inert'));

describe('TestimonialsCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installScroller();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('keeps the pagination bars visible in forced-colors mode', () => {
    render(<TestimonialsCarousel testimonials={testimonials} />);

    // A bar is only a background color, which forced colors removes: each one
    // needs a border (jsdom cannot evaluate the media query, so assert the class).
    const dots = screen.getAllByRole('button', { name: /go to testimonial/i });
    expect(dots.length).toBeGreaterThan(1);
    for (const dot of dots) {
      expect(dot.firstElementChild).toHaveClass('forced-colors:border');
    }
  });

  it('exposes only the current slide to keyboard and assistive tech', () => {
    render(<TestimonialsCarousel testimonials={testimonials} />);

    expect(slides()).toHaveLength(testimonials.length);
    expect(activeSlides()).toHaveLength(1);
    expect(activeSlides()[0]).toHaveAccessibleName(`Testimonial 1 of ${testimonials.length}`);
  });

  it('advances to the next testimonial with the arrow button and announces it', () => {
    render(<TestimonialsCarousel testimonials={testimonials} />);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByRole('button', { name: /next testimonial/i }));
    settle();

    expect(activeSlides()[0]).toHaveAccessibleName(`Testimonial 2 of ${testimonials.length}`);
    expect(screen.getByRole('status')).toHaveTextContent(`Testimonial 2 of ${testimonials.length}`);
  });

  it('responds to ArrowRight and ArrowLeft keyboard navigation', () => {
    render(<TestimonialsCarousel testimonials={testimonials} />);
    const carousel = screen.getByRole('region', { name: /testimonials/i });

    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    settle();
    expect(activeSlides()[0]).toHaveAccessibleName(`Testimonial 2 of ${testimonials.length}`);

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    settle();
    expect(activeSlides()[0]).toHaveAccessibleName(`Testimonial 1 of ${testimonials.length}`);
  });
});

describe('TestimonialsCarousel navigation limits', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installScroller();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('ignores arrow keys pressed inside a slide so focus is never stranded', () => {
    render(<TestimonialsCarousel testimonials={testimonials} />);

    fireEvent.keyDown(screen.getAllByRole('button', { name: /read full/i })[0] as HTMLElement, {
      key: 'ArrowRight',
    });
    settle();

    expect(activeSlides()[0]).toHaveAccessibleName(`Testimonial 1 of ${testimonials.length}`);
  });

  it('marks the ends as unavailable instead of wrapping around', () => {
    render(<TestimonialsCarousel testimonials={testimonials} />);

    expect(screen.getByRole('button', { name: /previous testimonial/i })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    fireEvent.click(screen.getByRole('button', { name: /previous testimonial/i }));
    settle();
    expect(activeSlides()[0]).toHaveAccessibleName(`Testimonial 1 of ${testimonials.length}`);
  });

  it('jumps straight to a slide from its pagination bar', () => {
    render(<TestimonialsCarousel testimonials={testimonials} />);

    fireEvent.click(screen.getByRole('button', { name: 'Go to testimonial 3' }));
    settle();

    expect(activeSlides()[0]).toHaveAccessibleName(
      `Testimonial ${testimonials.length} of ${testimonials.length}`
    );
    expect(screen.getByRole('button', { name: 'Go to testimonial 3' })).toHaveAttribute(
      'aria-current',
      'true'
    );
  });
});
