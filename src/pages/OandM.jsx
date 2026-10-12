import PageHero from '../components/ui/PageHero';
import Reveal from '../components/ui/Reveal';
import Icon from '../components/ui/Icon';
import SectionHeading from '../components/ui/SectionHeading';
import CapabilitiesTabs from '../components/sections/CapabilitiesTabs';
import MaintenanceStepper from '../components/sections/MaintenanceStepper';
import SafetyGrid from '../components/sections/SafetyGrid';
import PerformanceBand from '../components/sections/PerformanceBand';
import CTABanner from '../components/sections/CTABanner';
import { pillars } from '../data/capabilities';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useApp } from '../context/AppContext';

export default function OandM() {
  useDocumentTitle('Operations & Maintenance');
  const { openQuote } = useApp();

  const omCards = [
    {
      type: 'wide',
      thumb: '/images/control-room.jpg',
      title: 'ROUND-THE-CLOCK SCADA',
      desc: 'Predictive health monitoring, thermal heat rate optimization and rapid response.',
      linkText: 'SEE O&M PROTOCOLS',
      linkHref: '#om-philosophy',
    },
    {
      type: 'stat',
      value: '99.2%',
      label: 'PLANT AVAILABILITY',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'ZERO HARM SAFETY',
      desc: 'ISO safety standards, regular mock drills, and 100% statutory adherence guaranteed.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_oandm.jpg"
        eyebrow="POWER PLANT OPERATIONS & MAINTENANCE"
        title="RELIABLE OPERATIONS. EFFICIENT PERFORMANCE. SAFE EXECUTION."
        text="Comprehensive turnkey O&M solutions for thermal, captive cogen, solar, and industrial power plants delivered by certified BOE engineers, supervisors and expert technicians."
        ctaText="Contract O&M Services"
        onCtaClick={() => openQuote('Power Plant O&M')}
        cards={omCards}
      />
      <section className="section" id="om-philosophy">
        <div className="container">
          <SectionHeading number="01" eyebrow="Our O&M philosophy" title="Safety, Reliability, Efficiency and Continuous Improvement" text="Triple E Services delivers safe, reliable and efficient plant operations with a strong focus on equipment availability, performance optimization and cost-effective maintenance. Industry-standard O&M practices emphasise preventive and predictive maintenance, performance monitoring, reliability improvement and systematic shutdown management." />
          <div className="grid grid--4">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.07}>
                <div className="card card--pillar">
                  <span className="card__icon"><Icon name={p.icon} size={26} /></span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CapabilitiesTabs />
      <MaintenanceStepper />
      <SafetyGrid />
      <PerformanceBand />
      <CTABanner />
    </>
  );
}
