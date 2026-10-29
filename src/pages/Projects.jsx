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
      title: 'SOLAR ERECTION & COMMISSIONING',
      desc: 'Ground-mount & rooftop solar EPC, 33 kV evacuation bays, MMS installation & complete commissioning.',
      linkText: 'EXPLORE SOLAR PROJECTS',
      linkHref: '#projects-explorer',
    },
    {
      type: 'stat',
      value: '30+',
      label: 'ACTIVE & RECENT CONTRACTS',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'SOLAR & POWER EPC',
      desc: 'Turnkey solar erection, 400 kV transmission lines, 220 kV substations and power plant projects.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_projects.jpg"
        eyebrow="PROJECTS"
        title="RECENT CONTRACTS AND PROJECT EXPERIENCE"
        text="Solar erection & commissioning, utility power plants, boilers, and high-voltage electrical projects across India."
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
