import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import { services } from '../../data/services';

// Text comes straight from src/data/services.js; tags/labels only restate facts from the same file.
const meta = {
  'power-plant-om': { tag: 'Thermal · Solar · DG · Windmill', client: 'Comprehensive or package basis', image: '/images/generated/power_plant_turbine.jpg' },
  'substation-transmission-om': { tag: 'Up to 400 kV', client: 'Substations · Switchyards · Lines', image: '/images/generated/substation_400kv.jpg' },
  'pipeline-fabrication': { tag: 'Oil · Steam · Water', client: 'IBR-certified 6G welders · In-house NDT', image: '/images/generated/boiler_pipeline.jpg' },
  'erection-commissioning': { tag: 'Testing · CEA & CIEG', client: 'Power plants & electrical systems', image: '/images/generated/transformer_erection.jpg' },
  'turnkey-projects': { tag: 'Solar plants · Substations', client: 'Single point of responsibility', image: '/images/generated/renewable_hybrid_plant.jpg' },
  'manpower-troubleshooting': { tag: 'BOE-certified team', client: 'Engineers · Supervisors · Technicians', image: '/images/generated/control_room_scada.jpg' },
};
const showcaseServices = services
  .filter((s) => meta[s.slug])
  .map((s) => ({ slug: s.slug, title: s.title, desc: s.short, ...meta[s.slug] }));

export default function ServicesShowcase() {
  return (
    <section className="section section--services" id="services-section">
      <div className="container">
        <SectionHeading
          tag="What we do"
          title="Eight services. One accountable partner."
          text="From daily plant operations to turnkey electrical projects, our integrated teams cover the full life of your power and utility assets."
          className="sh--editorial"
        />

        <div className="ref-cards-grid ref-cards-grid--3">
          {showcaseServices.map((service, index) => (
            <Reveal
              key={service.slug}
              delay={index * 0.08}
              className="ref-card"
            >
              <div className="ref-card__bg">
                <img src={service.image} alt={service.title} loading="lazy" />
                <div className="ref-card__gradient" />
              </div>

              <div className="ref-card__top">
                <span className="ref-card__pill">{service.tag}</span>
              </div>

              <div className="ref-card__bottom">
                <div className="ref-card__info">
                  <span className="ref-card__client">{service.client}</span>
                  <h3 className="ref-card__title">{service.title}</h3>
                  <p className="ref-card__desc">{service.desc}</p>
                </div>

                <Link
                  to={`/services#${service.slug}`}
                  className="ref-card__action-btn"
                  aria-label={`View details for ${service.title}`}
                >
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="section-more">
          <Link to="/services" className="section-more__link">
            View all {services.length} services <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
