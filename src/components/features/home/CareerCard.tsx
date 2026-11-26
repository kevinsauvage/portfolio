import { Tag } from '@/components/ui/Tag';
import { Caption, H3 } from '@/components/ui/Typography';

import CareerDisclosure from './CareerDisclosure';
import CareerHighlights, { HighlightItems } from './CareerHighlights';

import clsx from 'clsx';

type CareerCardProps = {
  company: string;
  highlights: string[];
  period: string;
  position: string;
  skills: string[];
  index: number;
  /** Older roles fold into a disclosure so the timeline stays short. */
  collapsed?: boolean;
};

const SkillsTags = ({ skills }: { skills: string[] }) => (
  <div className='flex flex-wrap gap-1.5'>
    {skills.map(skill => (
      <Tag key={skill}>{skill}</Tag>
    ))}
  </div>
);

const Heading = ({
  company,
  position,
  period,
  index,
}: Pick<CareerCardProps, 'company' | 'position' | 'period' | 'index'>) => (
  <div className='space-y-1'>
    <Caption className='font-mono tracking-wide text-zinc-400'>{period}</Caption>
    <H3
      id={`career-${index}`}
      size='sm'
      className='transition-colors group-hover/job:text-primary-400'
    >
      {company}
    </H3>
    <Caption className='font-semibold text-zinc-100'>{position}</Caption>
  </div>
);

const CareerCard: React.FC<CareerCardProps> = ({
  company,
  highlights,
  period,
  position,
  skills,
  index,
  collapsed = false,
}) => {
  const isCurrent = index === 0;

  return (
    <article aria-labelledby={`career-${index}`} className='group/job relative pl-8 md:pl-12'>
      <span
        aria-hidden='true'
        className={clsx(
          'absolute left-0 top-1.5 size-3.5 rounded-full border-2 transition-colors',
          isCurrent
            ? 'border-primary-400 bg-primary-400 ring-4 ring-primary-400/15'
            : 'border-zinc-600 bg-zinc-950 group-hover/job:border-primary-400'
        )}
      />

      {collapsed ? (
        <CareerDisclosure
          company={company}
          heading={<Heading company={company} position={position} period={period} index={index} />}
        >
          <HighlightItems items={highlights} />
          <SkillsTags skills={skills} />
        </CareerDisclosure>
      ) : (
        <div className='space-y-4'>
          <Heading company={company} position={position} period={period} index={index} />
          <CareerHighlights items={highlights} />
          <SkillsTags skills={skills} />
        </div>
      )}
    </article>
  );
};

export default CareerCard;
