import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const whoCards = [
  {
    tag: 'Core Focus',
    title: 'Power Plant & Boiler Works',
    client: '1x135 MW Power Plant O&M · Bed Coils · Overhauls',
    desc: 'Comprehensive O&M, AFBC bed coil replacements, boiler revamp and long-term utility plant stewardship.',
    image: '/images/bed-coil-boiler.jpg',
    link: '/services#power-plant-boiler-works',
  },
  {
    tag: 'Clean Energy',
    title: 'Solar Plant O&M & EPC Contracts',
    client: 'Turnkey Ground-mount & Industrial Rooftop',
    desc: 'Turnkey EPC execution and long-term O&M for utility and industrial solar power plants with generation guarantees.',
    image: '/images/board-solar.jpg',
    link: '/services#solar-plant-epc',
  },
  {
    tag: "Electrical 'A' Grade",
    title: 'Tower Works, Transmission Lines & Switchyard',
    client: 'Up to 400 kV · Double Circuit Quad Lines',
    desc: 'Erection, stringing, testing and O&M of transmission towers, switchyards and transmission lines up to 400 kV.',
    image: '/images/switchyard-towers.jpg',
    link: '/services#tower-transmission-switchyard',
  },
];

export default function WhoWeAre() {
  return (
    <section className="section section--who" id="who-we-are">
      <div className="container">
        <SectionHeading
          tag="Who we are"
          title="Engineers who run power plants."
          text="Triple E Services is primarily engaged in providing services relating to power plants and industry, led by engineers with decades of field experience, with manpower and active sites across six states."
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
