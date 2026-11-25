import { GitHubIcon } from '@/components/shared/BrandIcons';
import ButtonLink from '@/components/ui/Button/ButtonLink';
import { Card, CardContent, CardImage } from '@/components/ui/Card';
import { NumberBadge } from '@/components/ui/NumberBadge';
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
  const { role, timeline } = project;
  const meta = [role, timeline].filter(Boolean).join(' · ');

  return (
    <Card hover='standard' size='md' glow='primary-secondary' className='group relative h-full'>
      <span
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/60 to-transparent'
      />
      <CardContent spacing='md' className='relative z-10 h-full'>
        <div className='flex items-center gap-3'>
          <NumberBadge number={index + 1} />
          {meta && (
            <p className='font-mono text-xs uppercase tracking-[0.18em] text-secondary-300'>
              {meta}
            </p>
          )}
        </div>

        <H3
          id={`project-title-${index}`}
          size='sm'
          className='transition-colors duration-300 group-hover:text-primary-400'
        >
          {title}
        </H3>

        <CardImage
          src={images.thumbnail.src}
          alt={images.thumbnail.alt}
          aspectRatio='wide'
          width={1200}
          height={750}
          sizes='(max-width: 1024px) 100vw, 900px'
          className='md:aspect-[2.4/1]'
        />

        <BodySmall className='text-zinc-200'>{description}</BodySmall>

        <TechStackTags technologies={technologies} limit={8} />

        <ProjectActionButtons slug={slug} websiteLink={websiteLink} githubUrl={githubUrl} />
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
