import certifications from '@/config/content/certifications';

import CertificationsSection from './CertificationsSection';

import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));

describe('CertificationsSection', () => {
  it('lists every credential as a row', () => {
    render(<CertificationsSection />);

    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(
      certifications.length
    );
  });

  it('links a credential in a new tab and leaves in-progress learning as plain text', () => {
    render(<CertificationsSection />);

    for (const { title, credentialUrl } of certifications) {
      if (credentialUrl) {
        const link = screen.getByRole('link', { name: name => name.includes(title) });
        expect(link).toHaveAttribute('href', credentialUrl);
        expect(link).toHaveAttribute('target', '_blank');
      } else {
        expect(screen.getByText(title).closest('a')).toBeNull();
      }
    }
  });
});
