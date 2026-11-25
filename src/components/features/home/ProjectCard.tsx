import { GitHubIcon } from '@/components/shared/BrandIcons';
import ButtonLink from '@/components/ui/Button/ButtonLink';
import { Card, CardContent, CardImage } from '@/components/ui/Card';
import { NumberBadge } from '@/components/ui/NumberBadge';
import { Tag } from '@/components/ui/Tag';
import { BodySmall, H3 } from '@/components/ui/Typography';
import { sections } from '@/config/content';
import type { Project } from '@/config/content/projects';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

import { BookOpen, Check, ExternalLink } from 'lucide-react';

type ProjectCardProps = {
  project: Project;
  index: number;
};

const ProjectHighlights = ({ highlights }: { highlights: string[] }) => {
  return (
    <ul className='grid gap-2 sm:grid-cols-2'>
      {highlights.map(highlight => (
        <li key={highlight} className='flex items-start gap-2'>
          <Check
            size={15}
            strokeWidth={2}
            className='mt-0.5 shrink-0 text-primary-400'
            aria-hidden='true'
          />
          <BodySmall className='text-zinc-300'>{highlight}</BodySmall>
        </li>
      ))}
    </ul>
  );
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
        className='shadow-glow-sm hover:shadow-glow-md'
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
  const { role, timeline, highlights } = project;
  const meta = [role, timeline].filter(Boolean).join(' · ');
  const media = images.mobile ?? images.thumbnail;

  return (
    <Card hover='standard' size='md' glow='primary-secondary' className='group relative h-full'>
      <span
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/60 to-transparent'
      />
      <CardContent spacing='md' className='relative z-10 h-full pt-6'>
        <div className='grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-8'>
          <div className='relative'>
            <div className='absolute -left-2 -top-2 z-10'>
              <NumberBadge number={index + 1} />
            </div>
            <CardImage
              src={media.src}
              alt={media.alt}
              aspectRatio='portrait'
              width={780}
              height={1688}
              objectPosition='top'
              sizes='(max-width: 1024px) 100vw, 420px'
            />
          </div>

          <div className='flex flex-col gap-4'>
            {meta && (
              <p className='font-mono text-xs uppercase tracking-[0.18em] text-secondary-300'>
                {meta}
              </p>
            )}
            <H3
              id={`project-title-${index}`}
              size='sm'
              className='transition-colors duration-300 group-hover:text-primary-400'
            >
              {title}
            </H3>
            <BodySmall className='text-zinc-200'>{description}</BodySmall>
            {highlights && highlights.length > 0 && <ProjectHighlights highlights={highlights} />}
            <TechStackTags technologies={technologies} limit={8} />
            <ProjectActionButtons slug={slug} websiteLink={websiteLink} githubUrl={githubUrl} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
