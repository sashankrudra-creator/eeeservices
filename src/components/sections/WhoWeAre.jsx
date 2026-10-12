import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const whoCards = [
  {
    tag: 'Thermal & Captive Power',
    title: 'Integrated Power Plant O&M',
    client: '135 MW Unit Proven · BOE Certified',
    desc: 'Comprehensive BTG, BOP, CHP, and ash handling plant operations ensuring 99%+ uptime across India.',
    image: '/images/generated/power_plant_turbine.jpg',
    link: '/services#power-plant-om',
  },
  {
    tag: 'High Voltage Transmission',
    title: '400 kV Substation & Switchyards',
    client: 'Extra-High Voltage Grid · Double Circuit',
    desc: 'Erection, protection testing, switchyard maintenance, and round-the-clock 400 kV corridor line patrolling.',
    image: '/images/generated/substation_400kv.jpg',
    link: '/services#substation-transmission-om',
  },
  {
    tag: 'Special Class IBR',
    title: 'High-Pressure Boiler & Piping',
    client: '6G Welders · In-house NDT Testing',
    desc: 'High-pressure steam piping fabrication, AFBC / CFBC boiler overhauls, radiography, UT, and MPI compliance.',
    image: '/images/generated/boiler_pipeline.jpg',
    link: '/services#pipeline-fabrication',
  },
];

export default function WhoWeAre() {
  return (
    <section className="section section--who" id="who-we-are">
      <div className="container">
        <SectionHeading
          tag="Who We Are ?"
          title="Reliable Power. Smarter Execution."
          text="At Triple E Services (Energy · Execution · Efficiency), we build, commission, and sustain the vital power infrastructure of the nation operating across 6 industrial states."
          className="sh--editorial"
        />

        <div className="ref-cards-grid ref-cards-grid--3">
          {whoCards.map((card, idx) => (
            <Reveal key={card.title} delay={idx * 0.1} className="ref-card">
              <div className="ref-card__bg">
                <img src={card.image} alt={card.title} loading="lazy" />
                <div className="ref-card__gradient" />
              </div>

              <div className="ref-card__top">
                <span className="ref-card__pill">{card.tag}</span>
              </div>

              <div className="ref-card__bottom">
                <div className="ref-card__info">
                  <span className="ref-card__client">{card.client}</span>
                  <h3 className="ref-card__title">{card.title}</h3>
                  <p className="ref-card__desc">{card.desc}</p>
                </div>

                <Link
                  to={card.link}
                  className="ref-card__action-btn"
                  aria-label={`Learn more about ${card.title}`}
                >
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
