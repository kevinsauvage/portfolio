import Reveal from '@/components/shared/Reveal';
import Section, { SECTION_STACK, SectionHeader } from '@/components/ui/Section';
import { sections } from '@/config/content';
import certifications from '@/config/content/certifications';

import CertificationRow from './CertificationRow';

const CertificationsSection: React.FC = () => {
  return (
    <Section id='certifications'>
      <div className={SECTION_STACK}>
        <SectionHeader
          title={sections.certifications.title}
          description={sections.certifications.description}
        />

        <Reveal>
          <ul className='divide-y divide-zinc-800/70 border-y border-zinc-800/70'>
            {certifications.map(certification => (
              <CertificationRow key={certification.id} {...certification} />
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
};

export default CertificationsSection;
