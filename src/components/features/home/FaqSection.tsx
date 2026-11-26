import JsonLd from '@/components/shared/JsonLd';
import Section, { SECTION_STACK, SectionHeader } from '@/components/ui/Section';
import { sections } from '@/config/content';
import faqs from '@/config/content/faq';
import { faqSchema } from '@/lib/seo/schemas';

import FaqItem from './FaqItem';

const FaqSection: React.FC = () => {
  return (
    <Section id='faq'>
      <JsonLd data={[faqSchema]} />
      <div className={SECTION_STACK}>
        <SectionHeader title={sections.faq.title} description={sections.faq.description} />

        <div className='mx-auto w-full max-w-3xl divide-y divide-zinc-800/70 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/70'>
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.id}
              id={faq.id}
              index={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default FaqSection;
