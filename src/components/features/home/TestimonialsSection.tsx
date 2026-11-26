import Section, { SECTION_STACK, SectionHeader } from '@/components/ui/Section';
import { sections } from '@/config/content';
import testimonials from '@/config/content/testimonials';

import TestimonialsCarousel from './TestimonialsCarousel';

const TestimonialsSection: React.FC = () => {
  return (
    <Section id='testimonials'>
      <div className={SECTION_STACK}>
        <SectionHeader
          title={sections.testimonials.title}
          description={sections.testimonials.description}
        />

        <TestimonialsCarousel testimonials={testimonials} />
      </div>
    </Section>
  );
};

export default TestimonialsSection;
