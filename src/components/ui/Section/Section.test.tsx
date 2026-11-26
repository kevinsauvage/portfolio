import Section, { SECTION_STACK } from './Section';
import SectionHeader from './SectionHeader';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Section', () => {
  it('owns the content width and applies the requested spacing', () => {
    render(
      <Section spacing='lg' data-testid='section'>
        Body
      </Section>
    );

    const section = screen.getByTestId('section');
    expect(section.className).toContain('max-w-5xl');
    expect(section.className).toContain('py-24');
  });

  it('skips the reveal wrapper when reveal is false', () => {
    render(
      <Section reveal={false} data-testid='plain'>
        Body
      </Section>
    );

    expect(screen.getByTestId('plain').querySelector('.reveal')).toBeNull();
  });

  it('wraps content in the reveal primitive by default', () => {
    render(<Section data-testid='reveal'>Body</Section>);

    expect(screen.getByTestId('reveal').querySelector('.reveal')).not.toBeNull();
  });
});

describe('SECTION_STACK', () => {
  it('is the one header-to-body gap shared by every home section', () => {
    expect(SECTION_STACK).toBe('space-y-12 md:space-y-16');
  });
});

describe('SectionHeader', () => {
  it('renders the overline, title and description', () => {
    render(<SectionHeader overline='About' title='Title' description='Description' />);

    expect(screen.getByText('About')).toBeDefined();
    expect(screen.getByRole('heading', { name: 'Title' })).toBeDefined();
    expect(screen.getByText('Description')).toBeDefined();
  });
});
