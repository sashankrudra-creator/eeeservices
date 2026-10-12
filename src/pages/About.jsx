import PageHero from '../components/ui/PageHero';
import Licences from '../components/sections/Licences';
import Timeline from '../components/sections/Timeline';
import FounderSpotlight from '../components/sections/FounderSpotlight';
import ExpertsGrid from '../components/sections/ExpertsGrid';
import CTABanner from '../components/sections/CTABanner';
import Reveal from '../components/ui/Reveal';
import { commitment } from '../data/capabilities';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function About() {
  useDocumentTitle('About');

  const aboutCards = [
    {
      type: 'wide',
      thumb: '/images/service-7.jpg',
      title: 'FOUNDED BY ENGINEERS',
      desc: 'Decades of combined power plant leadership, operations and engineering mastery.',
      linkText: 'EXPLORE OUR STORY',
      linkHref: '#timeline-section',
    },
    {
      type: 'stat',
      value: '25+ YRS',
      label: 'FIELD EXPERTISE',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'IBR & SPECIAL CLASS',
      desc: 'Government-endorsed A-grade electrical contractors and certified statutory experts.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_about.jpg"
        eyebrow="ABOUT TRIPLE E SERVICES"
        title="ENGINEERS WHO RUN POWER PLANTS"
        text="Specialised engineering services relating to power plants, substations, and mega-scale industries led by veteran leaders with decades of field stewardship."
        ctaText="Meet Our Team"
        onCtaClick={() => {
          document.getElementById('timeline-section')?.scrollIntoView({ behavior: 'smooth' }) ||
          window.scrollTo({ top: 600, behavior: 'smooth' });
        }}
        cards={aboutCards}
      />
      <div id="timeline-section">
        <Licences />
      </div>
      <Timeline />
      <FounderSpotlight full />
      <ExpertsGrid />
      <section className="section section--dark section--grid">
        <div className="container container--narrow">
          <Reveal className="commitment commitment--dark">
            <span className="eyebrow eyebrow--glow">Our commitment</span>
            <blockquote>&ldquo;{commitment}&rdquo;</blockquote>
          </Reveal>
        </div>
      </section>
      <CTABanner />
    </>
  );
}
