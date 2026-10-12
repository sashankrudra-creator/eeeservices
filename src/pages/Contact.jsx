import PageHero from '../components/ui/PageHero';
import ContactSection from '../components/sections/ContactSection';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Contact() {
  useDocumentTitle('Contact');

  const contactCards = [
    {
      type: 'wide',
      thumb: '/images/service-8.jpg',
      title: 'TWO OFFICES IN ANDHRA PRADESH',
      desc: 'Registered Office in Ranastalam, Srikakulam and Administrative Office in Thotapalem, Vizianagaram.',
      linkText: 'FIND LOCATION',
      linkHref: '#contact-details',
    },
    {
      type: 'stat',
      value: '2',
      label: 'OFFICES',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'CALL OR EMAIL',
      desc: '9494694787 · info@eeeservices.in',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_contact.jpg"
        eyebrow="CONTACT"
        title="LET'S TALK ABOUT YOUR PLANT"
        text="Visit either of our offices, call us, or send an enquiry below."
        ctaText="Send Message"
        onCtaClick={() => {
          document.getElementById('contact-details')?.scrollIntoView({ behavior: 'smooth' }) ||
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }}
        cards={contactCards}
      />
      <div id="contact-details">
        <ContactSection />
      </div>
    </>
  );
}
