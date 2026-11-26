import Reveal from '@/components/shared/Reveal';
import Section, { SECTION_STACK, SectionHeader } from '@/components/ui/Section';
import { sections } from '@/config/content';
import projects from '@/config/content/projects';

import ProjectCard from './ProjectCard';

const PortfolioSection: React.FC = () => {
  return (
    <Section id='portfolio'>
      <div className={SECTION_STACK}>
        <SectionHeader
          title={sections.portfolio.title}
          description={sections.portfolio.description}
        />

        <div className='space-y-12'>
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 60} className='h-full'>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default PortfolioSection;
