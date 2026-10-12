import PageHero from '../components/ui/PageHero';
import ManpowerChart from '../components/sections/ManpowerChart';
import CTABanner from '../components/sections/CTABanner';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useApp } from '../context/AppContext';

export default function Manpower() {
  useDocumentTitle('Manpower');
  const { openQuote } = useApp();

  const manpowerCards = [
    {
      type: 'wide',
      thumb: '/images/overhaul-crew.jpg',
      title: 'SPECIALISED DEDICATED TEAM',
      desc: 'Engineers, supervisors, a BOE certified team, 6G welders, riggers and skilled technicians.',
      linkText: 'SEE CADRE BREAKDOWN',
      linkHref: '#manpower-chart',
    },
    {
      type: 'stat',
      value: '1,343',
      label: 'TOTAL MANPOWER',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: '6 STATES',
      desc: 'Andhra Pradesh, Telangana, Jharkhand, Rajasthan, Tamil Nadu and Chhattisgarh.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_manpower.jpg"
        eyebrow="MANPOWER ACROSS THE COUNTRY"
        title="1,343 PEOPLE ACROSS SIX STATES"
        text="1,003 on permanent rolls and a further call pool tied up within each state to meet customer requirements within the shortest time."
        ctaText="Request Manpower"
        onCtaClick={() => openQuote('Manpower Deployment')}
        cards={manpowerCards}
      />
      <div id="manpower-chart">
        <ManpowerChart />
      </div>
      <CTABanner />
    </>
  );
}
