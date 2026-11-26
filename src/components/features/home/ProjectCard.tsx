import Link from 'next/link';

import { GitHubIcon } from '@/components/shared/BrandIcons';
import ButtonLink from '@/components/ui/Button/ButtonLink';
import { Card, CardContent, CardImage } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { BodySmall, H3 } from '@/components/ui/Typography';
import { sections } from '@/config/content';
import type { Project } from '@/config/content/projects';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

import { BookOpen, ExternalLink } from 'lucide-react';

type ProjectCardProps = {
  project: Project;
  index: number;
};

const TechStackTags = ({
  technologies,
  limit,
}: {
  technologies: Array<{ name: string }>;
  limit?: number;
}) => {
  const visible = limit === undefined ? technologies : technologies.slice(0, limit);
  const hidden = technologies.length - visible.length;

  return (
    <div className='flex flex-wrap gap-1.5'>
      {visible.map(({ name }) => (
        <Tag key={name}>{name}</Tag>
      ))}
      {hidden > 0 && (
        <Tag>
          +{hidden}
          <span className='sr-only'> more technologies</span>
        </Tag>
      )}
    </div>
  );
};

const ProjectActionButtons = ({
  slug,
  websiteLink,
  githubUrl,
}: {
  slug: string;
  websiteLink: string;
  githubUrl: string | undefined;
}) => {
  return (
    <div className='flex flex-wrap gap-3'>
      <ButtonLink
        href={`/projects/${slug}`}
        svg={<BookOpen size={16} aria-hidden='true' />}
        label={sections.portfolio.buttons.caseStudy}
        size='sm'
        variant='primary'
        eventName={ANALYTICS_EVENTS.PORTFOLIO_PROJECT_LINK_CLICK}
        eventProperties={{ link_type: 'case_study', project_slug: slug }}
        className='shadow-lift-sm hover:shadow-lift-md'
      />
      <ButtonLink
        href={websiteLink}
        svg={<ExternalLink size={16} aria-hidden='true' />}
        label={sections.portfolio.buttons.viewLive}
        size='sm'
        variant='secondary'
        eventName={ANALYTICS_EVENTS.PORTFOLIO_PROJECT_LINK_CLICK}
        eventProperties={{ link_type: 'live', project_slug: slug }}
        target='_blank'
        rel='noopener noreferrer'
      />
      {githubUrl && (
        <ButtonLink
          href={githubUrl}
          svg={<GitHubIcon size={16} />}
          label={sections.portfolio.buttons.sourceCode}
          size='sm'
          variant='secondary'
          eventName={ANALYTICS_EVENTS.PORTFOLIO_PROJECT_LINK_CLICK}
          eventProperties={{ link_type: 'github', project_slug: slug }}
          target='_blank'
          rel='noopener noreferrer'
        />
      )}
    </div>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const { slug, title, description, technologies, images, websiteLink, githubUrl } = project;
  const { role, timeline } = project;
  const meta = [role, timeline].filter(Boolean).join(' · ');

  return (
    <Card hover='standard' size='md' glow='primary-secondary' className='group relative h-full'>
      <span
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/60 to-transparent'
      />
      <CardContent spacing='md' className='relative z-10 h-full'>
        {meta && (
          <p className='font-mono text-xs uppercase tracking-[0.18em] text-secondary-300'>{meta}</p>
        )}

        <H3
          id={`project-title-${index}`}
          size='sm'
          className='transition-colors duration-300 group-hover:text-primary-400'
        >
          <Link
            href={`/projects/${slug}`}
            data-analytics-event={ANALYTICS_EVENTS.PORTFOLIO_PROJECT_LINK_CLICK}
            data-analytics-link-type='card'
            data-analytics-project-slug={slug}
            className="focus-visible:outline-none after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-primary-400"
          >
            {title}
          </Link>
        </H3>

        <CardImage
          src={images.thumbnail.src}
          alt={images.thumbnail.alt}
          aspectRatio='wide'
          width={1200}
          height={750}
          sizes='(max-width: 1024px) 100vw, 900px'
          className='pointer-events-none md:aspect-[2.4/1]'
        />

        <BodySmall className='max-w-[60ch] text-zinc-200'>{description}</BodySmall>

        <TechStackTags technologies={technologies} limit={5} />

        <ProjectActionButtons slug={slug} websiteLink={websiteLink} githubUrl={githubUrl} />
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
