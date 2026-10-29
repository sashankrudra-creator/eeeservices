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
      title: 'TOOLS & TACKLES',
      desc: 'Relay testing equipment, generators (5–50 KVA), welding and plasma cutting sets, hydra, winches and hoists.',
      linkText: 'VIEW WORKSHOP ASSETS',
      linkHref: '#resources-blocks',
    },
    {
      type: 'stat',
      value: '600–700',
      label: 'RESOURCES MOBILISED AT ONCE',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'NDT & THERMOGRAPHY',
      desc: 'In-house ultrasonic, MPI, radiography and aerial drone thermography audits.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_resources.jpg"
        eyebrow="RESOURCES"
        title="THE PEOPLE AND EQUIPMENT BEHIND EVERY JOB"
        text="Skilled manpower, tools, workshops and in-house testing, ready to mobilise at short notice."
        ctaText="Request a Quote"
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
