import PageHero from '../components/ui/PageHero';
import ClientsWall from '../components/sections/ClientsWall';
import ClientsMarquee from '../components/sections/ClientsMarquee';
import CTABanner from '../components/sections/CTABanner';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useApp } from '../context/AppContext';

export default function Clients() {
  useDocumentTitle('Clients');
  const { openQuote } = useApp();

  const clientCards = [
    {
      type: 'wide',
      thumb: '/images/service-6.jpg',
      title: 'ENTERPRISE PARTNERSHIPS',
      desc: 'Decade-long relationships with blue-chip power, pharma, port, and cement leaders.',
      linkText: 'SEE TESTIMONIALS',
      linkHref: '#clients-wall',
    },
    {
      type: 'stat',
      value: '40+',
      label: 'INDUSTRIAL GIANTS',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'HIGH RETENTION',
      desc: '95%+ repeat business rate founded on engineering integrity and SLA perfection.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_clients.jpg"
        eyebrow="STRATEGIC INDUSTRY PARTNERS"
        title="TRUSTED BY POWER PLANTS & CONGLOMERATES ACROSS INDIA"
        text="Partnering with industry pioneers in power generation, pharmaceuticals, metals, cement, green bio-fuels, and deep-water ports."
        ctaText="Become a Partner"
        onCtaClick={() => openQuote('Enterprise Partnership')}
        cards={clientCards}
      />
      <ClientsMarquee heading={false} />
      <div id="clients-wall">
        <ClientsWall />
      </div>
      <CTABanner />
    </>
  );
}
