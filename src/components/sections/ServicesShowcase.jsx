import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import { services } from '../../data/services';

// Text comes straight from src/data/services.js; tags/labels only restate facts from the same file.
const meta = {
  'power-plant-boiler-works': { tag: 'Boiler & Plant O&M', client: 'Bed Coils · Overhaul · BTG', image: '/images/bed-coil-boiler.jpg' },
  'solar-plant-epc': { tag: 'Solar EPC & O&M', client: 'Ground & Rooftop Utility Plants', image: '/images/generated/renewable_hybrid_plant.jpg' },
  'tower-transmission-switchyard': { tag: 'Towers & Switchyards', client: 'Up to 400 kV · Quad Lines', image: '/images/switchyard-towers.jpg' },
  'instruments-supply-service': { tag: 'C&I Automation', client: 'Instruments · Valves · SCADA', image: '/images/control-room.jpg' },
  'pipeline-fabrication': { tag: 'High-Pressure Piping', client: 'IBR 6G Welders · In-house NDT', image: '/images/generated/boiler_pipeline.jpg' },
  'erection-commissioning': { tag: 'Erection & Commissioning', client: 'Power Plants · CEA & CIEG', image: '/images/generated/transformer_erection.jpg' },
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
          title="Core engineering services. One accountable partner."
          text="From boiler overhaul and bed coil replacement to solar EPC, 400 kV transmission and instrumentation, our teams run plants across India."
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
