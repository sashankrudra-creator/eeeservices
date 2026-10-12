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
      title: 'POWER, LINES & SUBSTATIONS',
      desc: '1x135 MW power plant O&M, 400 kV transmission line O&M and 220 kV substation works.',
      linkText: 'EXPLORE CASE STUDIES',
      linkHref: '#projects-explorer',
    },
    {
      type: 'stat',
      value: '24+',
      label: 'ACTIVE / RECENT O&M CONTRACTS',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'SINCE 2010',
      desc: 'E&I project works at Sarda Metals & Alloys, ongoing since 2010.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_projects.jpg"
        eyebrow="PROJECTS"
        title="RECENT CONTRACTS AND PROJECT EXPERIENCE"
        text="Power (cogen and solar), boilers and utility plants, plus electrical projects across India."
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
