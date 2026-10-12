import PageHero from '../components/ui/PageHero';
import ContactSection from '../components/sections/ContactSection';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Contact() {
  useDocumentTitle('Contact');

  const contactCards = [
    {
      type: 'wide',
      thumb: '/images/service-8.jpg',
      title: 'HEADQUARTERS & HUBS',
      desc: 'Offices in Visakhapatnam & regional project centers active across India.',
      linkText: 'FIND LOCATION',
      linkHref: '#contact-details',
    },
    {
      type: 'stat',
      value: '< 24H',
      label: 'RESPONSE TIME',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'DIRECT CONSULTATION',
      desc: 'Talk directly to senior chief engineers and technical operations leads.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_contact.jpg"
        eyebrow="GET IN TOUCH"
        title="LET'S TALK ABOUT YOUR POWER PLANT & FACILITY"
        text="Visit either of our offices, connect directly with our chief engineers, or submit a request for an on-site feasibility inspection."
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
