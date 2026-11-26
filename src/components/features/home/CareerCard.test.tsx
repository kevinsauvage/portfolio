import CareerCard from './CareerCard';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const OLD_COMPANY = 'Old Co';
const ACME = 'Acme';
const DID_X = 'Did X';
const INERT = '[inert]';
const EXPANDED = 'aria-expanded';

describe('CareerCard', () => {
  it('renders the role, every highlight and the skills', () => {
    render(
      <CareerCard
        company={ACME}
        position='Engineer'
        period='2024 – 2025'
        highlights={['Shipped A', 'Shipped B']}
        skills={['React', 'TypeScript']}
        index={0}
      />
    );

    expect(screen.getByRole('heading', { name: ACME })).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Shipped A')).toBeInTheDocument();
    expect(screen.getByText('Shipped B')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('folds older roles into a disclosure that still holds every highlight', () => {
    render(
      <CareerCard
        company={OLD_COMPANY}
        position='Engineer'
        period='2020'
        highlights={[DID_X, 'Did Y']}
        skills={['JS']}
        index={3}
        collapsed
      />
    );

    expect(screen.getByRole('heading', { name: OLD_COMPANY })).toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: /show details for old co/i });
    expect(toggle).toHaveAttribute(EXPANDED, 'false');
    expect(screen.getByRole('heading', { name: OLD_COMPANY }).closest(INERT)).toBeNull();
    expect(screen.getByText(DID_X).closest(INERT)).not.toBeNull();

    fireEvent.click(toggle);

    expect(screen.getByRole('button', { name: /hide details for old co/i })).toHaveAttribute(
      EXPANDED,
      'true'
    );
    expect(screen.getByText(DID_X).closest(INERT)).toBeNull();
  });
});

describe('CareerCard highlights', () => {
  it('shows three highlights and tucks the rest behind a toggle', () => {
    render(
      <CareerCard
        company={ACME}
        position='Engineer'
        period='2024'
        highlights={['One', 'Two', 'Three', 'Four', 'Five']}
        skills={[]}
        index={0}
      />
    );

    const toggle = screen.getByRole('button', { name: 'Show 2 more' });
    expect(toggle).toHaveAttribute(EXPANDED, 'false');
    expect(screen.getByText('Four').closest(INERT)).not.toBeNull();

    fireEvent.click(toggle);

    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute(EXPANDED, 'true');
    expect(screen.getByText('Four').closest(INERT)).toBeNull();
  });
});
