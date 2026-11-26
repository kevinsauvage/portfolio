import Reveal from '@/components/shared/Reveal';
import Section, { SECTION_STACK, SectionHeader } from '@/components/ui/Section';
import { jobs, sections } from '@/config/content';

import CareerCard from './CareerCard';

/** Only the current role starts open; the others fold but stay in the DOM. */
const COLLAPSED_FROM = 1;

const CareerSection = () => {
  return (
    <Section id='career'>
      <div className={SECTION_STACK}>
        <SectionHeader title={sections.career.title} description={sections.career.description} />

        <ol className="relative space-y-12 before:absolute before:bottom-2 before:left-[6px] before:top-2 before:w-px before:bg-zinc-800 before:content-['']">
          {jobs.map((job, index) => (
            <Reveal
              key={job.id}
              as='li'
              id={job.id}
              delay={index * 60}
              className='scroll-mt-28 list-none'
            >
              <CareerCard {...job} index={index} collapsed={index >= COLLAPSED_FROM} />
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
};

export default CareerSection;
