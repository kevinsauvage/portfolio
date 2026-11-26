import { earlierCredentials } from '@/config/content/certifications';

import CertificationsSection from './CertificationsSection';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));

describe('CertificationsSection', () => {
  it('lists every earlier course as a link that opens in a new tab', () => {
    render(<CertificationsSection />);

    for (const { title, credentialUrl } of earlierCredentials) {
      const link = screen.getByRole('link', { name: name => name.includes(title) });
      expect(link).toHaveAttribute('href', credentialUrl);
      expect(link).toHaveAttribute('target', '_blank');
    }
  });
});
