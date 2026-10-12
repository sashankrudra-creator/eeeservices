import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const showcaseServices = [
  {
    slug: 'power-plant-om',
    title: 'Integrated Power Plant O&M',
    tag: 'BTG · BOP · CHP · Ash Handling',
    desc: 'Round-the-clock operation and predictive maintenance for thermal, captive co-gen, and renewable plants with proven 135 MW single-unit capability.',
    image: '/images/generated/power_plant_turbine.jpg',
    client: '135 MW Proven · Thermal Utility',
  },
  {
    slug: 'substation-transmission-om',
    title: 'Substation & Transmission up to 400 kV',
    tag: 'Extra High Voltage Corridors',
    desc: 'Erection, protection testing, switchyard maintenance, and round-the-clock line patrolling for double-circuit lines up to 400 kV.',
    image: '/images/generated/substation_400kv.jpg',
    client: 'Up to 400 kV · Switchyard AMC',
  },
  {
    slug: 'pipeline-fabrication',
    title: 'Special Class IBR Boiler & Piping',
    tag: 'Certified 6G Welding & NDT',
    desc: 'High-pressure steam piping fabrication, AFBC / CFBC boiler overhauls, in-house radiography, UT, and MPI non-destructive testing.',
    image: '/images/generated/boiler_pipeline.jpg',
    client: 'Special Class IBR · In-house NDT',
  },
  {
    slug: 'erection-commissioning',
    title: 'Heavy Erection & Turnkey Commissioning',
    tag: 'Transformers · Turbines · Switchgear',
    desc: 'Heavy lift rigging, mechanical alignment, transformer bay erection, and complete statutory CEA & CIEG liaisoning with zero compliance delays.',
    image: '/images/generated/transformer_erection.jpg',
    client: 'CEA & CIEG Approved · Heavy Rigging',
  },
  {
    slug: 'turnkey-projects',
    title: 'Solar & Hybrid Renewable Infrastructure',
    tag: 'Utility Scale Clean Energy',
    desc: 'End-to-end solar EPC, HT switchyard integration, SCADA automated monitoring, and inverter station upkeep ensuring peak generation yield.',
    image: '/images/generated/renewable_hybrid_plant.jpg',
    client: 'Turnkey EPC · Solar & Hybrid',
  },
  {
    slug: 'manpower-troubleshooting',
    title: 'Specialist Manpower & Root Cause Analysis',
    tag: 'BOE Engineers · Qualified Crews',
    desc: 'Deployment of 1,300+ vetted engineers, condition monitoring specialists, and licensed operators backed by senior troubleshooting directors.',
    image: '/images/generated/control_room_scada.jpg',
    client: '1,300+ Experts · 6 States',
  },
];

export default function ServicesShowcase() {
  return (
    <section className="section section--services" id="services-section">
      <div className="container">
        <SectionHeading
          tag="Engineering Capabilities"
          title="Engineered for Critical Uptime &amp; High-Voltage Safety."
          text="Explore our core service lines delivering end-to-end engineering excellence across power generation, high-voltage transmission, and industrial utility systems."
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
      </div>
    </section>
  );
}
