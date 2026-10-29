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
      desc: 'Led by VP Chandra Sekhar, B.E. (Electrical), \'A\' Grade Electrical Licence holder for all voltages.',
      linkText: 'EXPLORE OUR STORY',
      linkHref: '#founder-section',
    },
    {
      type: 'stat',
      value: '20+ YRS',
      label: 'FOUNDER EXPERIENCE',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'LICENSED & ISO CERTIFIED',
      desc: 'Special Class IBR, Electrical \'A\' Grade licences and ISO 9001, 14001 & 45001 certified management systems.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_about.jpg"
        eyebrow="ABOUT US"
        title="ENGINEERS WHO RUN POWER PLANTS"
        text="Triple E Services is primarily engaged in providing services relating to power plants and industry, led by engineers with decades of field experience."
        ctaText="Meet Our Team"
        onCtaClick={() => {
          document.getElementById('founder-section')?.scrollIntoView({ behavior: 'smooth' }) ||
          window.scrollTo({ top: 600, behavior: 'smooth' });
        }}
        cards={aboutCards}
      />
      <div id="founder-section">
        <FounderSpotlight full />
      </div>
      <div id="licences-section">
        <Licences />
      </div>
      <div id="experts-section">
        <ExpertsGrid />
      </div>
      <div id="timeline-section">
        <Timeline />
      </div>
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
