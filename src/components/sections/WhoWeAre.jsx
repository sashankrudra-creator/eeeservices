import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const whoCards = [
  {
    tag: 'Our business',
    title: 'Solar Plants & Power Plants',
    client: '1x135 MW power plant O&M · Since 2018',
    desc: 'EPC and O&M for solar plants and power plants, from erection and commissioning to long-term operations.',
    image: '/images/generated/power_plant_turbine.jpg',
    link: '/services#power-plant-om',
  },
  {
    tag: "Electrical 'A' Grade",
    title: 'Substations & Transmission Lines',
    client: 'Up to 400 kV · 220 kV substation works',
    desc: 'Operation and maintenance of substations, switchyards and transmission lines up to 400 kV, plus erection and commissioning.',
    image: '/images/generated/substation_400kv.jpg',
    link: '/services#substation-transmission-om',
  },
  {
    tag: 'Special Class IBR',
    title: 'Boiler O&M',
    client: 'CFBC · AFBC · PF boilers · In-house NDT',
    desc: 'Operation and maintenance of CFBC / AFBC / PF boilers, auxiliaries, pressure parts and shutdown activities.',
    image: '/images/generated/boiler_pipeline.jpg',
    link: '/services#pipeline-fabrication',
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
