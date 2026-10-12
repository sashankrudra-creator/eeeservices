import PageHero from '../components/ui/PageHero';
import ProjectsExplorer from '../components/sections/ProjectsExplorer';
import CTABanner from '../components/sections/CTABanner';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useApp } from '../context/AppContext';

export default function Projects() {
  useDocumentTitle('Projects');
  const { openQuote } = useApp();

  const projectCards = [
    {
      type: 'wide',
      thumb: '/images/board-solar.jpg',
      title: 'MEGA-WATT EPC SCALE',
      desc: 'Executed complex 135 MW units, 400 kV substations, and utility revamps across India.',
      linkText: 'EXPLORE CASE STUDIES',
      linkHref: '#projects-explorer',
    },
    {
      type: 'stat',
      value: '100+',
      label: 'PROJECTS COMPLETED',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'ON-TIME COMMISSIONING',
      desc: 'Fast mobilization, certified fabrication facilities, and zero-compromise handover.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_projects.jpg"
        eyebrow="PROVEN EPC TRACK RECORD"
        title="RECENT CONTRACTS & MEGA PROJECT EXPERIENCE"
        text="Cogeneration plants, solar solar PV installations, boilers, high-voltage switchyards, and industrial infrastructure executed for India's leading conglomerates."
        ctaText="Discuss Your Project"
        onCtaClick={() => openQuote('Project Consultation')}
        cards={projectCards}
      />
      <div id="projects-explorer">
        <ProjectsExplorer />
      </div>
      <CTABanner />
    </>
  );
}
