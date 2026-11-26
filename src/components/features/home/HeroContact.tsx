import ContactInfo from '@/components/shared/ContactInfo';

/** Social links; rendered once in the first fold (md+) and once below it on mobile. */
const HeroContact = () => (
  <div className='card-enter mt-8'>
    <ContactInfo size={22} eventPrefix='hero' className='justify-center' />
  </div>
);

export default HeroContact;
