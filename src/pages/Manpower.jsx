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
      title: 'CERTIFIED TASKFORCES',
      desc: 'BOE certified engineers, 6G alloy welders, turbine mechanics and safety stewards.',
      linkText: 'SEE CADRE BREAKDOWN',
      linkHref: '#manpower-chart',
    },
    {
      type: 'stat',
      value: '1,343+',
      label: 'PERSONNEL STRENGTH',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: '6 STATES COVERAGE',
      desc: '1,003 permanent rolls and verified reserve talent pools ready on short notice.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_manpower.jpg"
        eyebrow="NATIONWIDE SKILLED WORKFORCE"
        title="1,343 POWER PROFESSIONALS READY ACROSS SIX STATES"
        text="Specialised operations crews, qualified electrical supervisors, precision mechanics, and seasoned plant technicians ready to staff shutdowns and ongoing plant cycles."
        ctaText="Mobilise Manpower"
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
