import { jobs, sections } from '@/config/content';

import AboutSection from './AboutSection';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));

describe('AboutSection', () => {
  it('lists the tech stack next to the languages', () => {
    render(<AboutSection />);

    expect(screen.getByText(sections.about.stackTitle)).toBeInTheDocument();
    for (const skill of sections.about.stack) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
  });

  it('links the current role to its career entry', () => {
    render(<AboutSection />);

    expect(screen.getByRole('link', { name: sections.about.currently })).toHaveAttribute(
      'href',
      `#${jobs[0]?.id}`
    );
  });
});
