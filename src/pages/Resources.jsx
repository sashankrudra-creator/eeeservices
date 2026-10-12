import PageHero from '../components/ui/PageHero';
import ResourcesBlocks from '../components/sections/ResourcesBlocks';
import TeamRoles from '../components/sections/TeamRoles';
import CTABanner from '../components/sections/CTABanner';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useApp } from '../context/AppContext';

export default function Resources() {
  useDocumentTitle('Resources');
  const { openQuote } = useApp();

  const resourceCards = [
    {
      type: 'wide',
      thumb: '/images/service-4.jpg',
      title: 'TESTING & RIGGING FLEET',
      desc: 'Advanced relay test benches, secondary injection kits, and heavy crane rigs.',
      linkText: 'VIEW WORKSHOP ASSETS',
      linkHref: '#resources-blocks',
    },
    {
      type: 'stat',
      value: '24/7',
      label: 'MOBILISATION READY',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'CALIBRATED TOOLING',
      desc: 'NABL traceable test equipment and certified NDT instruments always in inventory.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_resources.jpg"
        eyebrow="ENGINEERING INFRASTRUCTURE & TOOLS"
        title="THE PEOPLE & ADVANCED EQUIPMENT BEHIND EVERY JOB"
        text="Specialised workshops, high-precision calibration benches, heavy rigging machinery, and rapid mobilization capabilities ready to deploy across 6 states."
        ctaText="Request Equipment & Crew"
        onCtaClick={() => openQuote('Equipment & Crew Mobilisation')}
        cards={resourceCards}
      />
      <div id="resources-blocks">
        <ResourcesBlocks />
      </div>
      <TeamRoles />
      <CTABanner />
    </>
  );
}
