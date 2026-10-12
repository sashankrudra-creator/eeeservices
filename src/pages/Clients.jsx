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
      title: 'LONG-RUNNING CONTRACTS',
      desc: 'Substation O&M at Trimex Sands since 2012 and utility O&M at SMS Pharma since 2015.',
      linkText: 'SEE ALL CLIENTS',
      linkHref: '#clients-wall',
    },
    {
      type: 'stat',
      value: '27',
      label: 'CLIENTS & PARTNERS',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: '8 INDUSTRIES',
      desc: 'Power, pharma, metals & alloys, cement, bio / distillery, ports, dairy & food and mining.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_clients.jpg"
        eyebrow="OUR CLIENTS"
        title="TRUSTED BY PLANTS ACROSS INDUSTRIES"
        text="Power, pharma, metals and alloys, cement, bio-fuels, ports and more."
        ctaText="Get a Quote"
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
