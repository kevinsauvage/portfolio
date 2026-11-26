import { type Project, projects } from '@/config/content/projects';

import ProjectCard from './ProjectCard';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));

const project = projects[0] as Project;

describe('ProjectCard', () => {
  it('links to the case study and the live site', () => {
    render(<ProjectCard project={project} index={0} />);

    expect(screen.getByRole('link', { name: /read case study/i })).toHaveAttribute(
      'href',
      `/projects/${project.slug}`
    );
    expect(screen.getByRole('link', { name: /view live/i })).toHaveAttribute(
      'href',
      project.websiteLink
    );
  });

  it('shows a source link only when the repository is public', () => {
    const { githubUrl: _omitted, ...privateProject } = project;
    const { rerender } = render(<ProjectCard project={privateProject} index={0} />);

    expect(screen.queryByRole('link', { name: /source code/i })).not.toBeInTheDocument();

    rerender(
      <ProjectCard
        project={{ ...project, githubUrl: 'https://github.com/example/repo' }}
        index={0}
      />
    );

    expect(screen.getByRole('link', { name: /source code/i })).toHaveAttribute(
      'href',
      'https://github.com/example/repo'
    );
  });

  it('renders the title and the technology tags', () => {
    render(<ProjectCard project={project} index={0} />);

    const firstTechnology = project.technologies[0] as { name: string };

    expect(screen.getByText(project.title)).toBeInTheDocument();
    expect(screen.getByText(firstTechnology.name)).toBeInTheDocument();
  });

  it('makes the title a link to the case study that stretches over the card', () => {
    render(<ProjectCard project={project} index={0} />);

    const titleLink = screen.getByRole('heading', { name: project.title }).querySelector('a');
    expect(titleLink).toHaveAttribute('href', `/projects/${project.slug}`);
    expect(titleLink?.className).toContain('after:absolute');
  });

  it('caps the visible technology tags and counts the rest', () => {
    const technologies = Array.from({ length: 8 }, (_, index) => ({ name: `Tech ${index}` }));
    render(<ProjectCard project={{ ...project, technologies }} index={0} />);

    expect(screen.getByText('Tech 4')).toBeInTheDocument();
    expect(screen.queryByText('Tech 5')).not.toBeInTheDocument();
    expect(screen.getByText(/\+3/)).toBeInTheDocument();
  });
});
