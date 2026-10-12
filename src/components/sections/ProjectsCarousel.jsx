import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const projects = [
  {
    id: 1,
    title: '1x135 MW Power Plant O&M',
    client: 'VSLP',
    sector: 'Thermal Power Utility',
    location: 'Rajasthan',
    period: 'Since Oct 2018',
    image: '/images/generated/hero_industrial_plant.jpg',
    description: 'Comprehensive BTG, BOP, CHP & ash handling plant operations with 99%+ availability.',
  },
  {
    id: 2,
    title: '400 kV Transmission Line O&M',
    client: 'JSW-MPCL / KMPCL',
    sector: 'Extra-High Voltage Grid',
    location: 'Chhattisgarh',
    period: '27 km Double Circuit',
    image: '/images/generated/transmission_grid.jpg',
    description: 'Round-the-clock maintenance of 400 kV double circuit transmission line and gantry towers.',
  },
  {
    id: 3,
    title: '38.5 MW PF Boiler Plant E&I',
    client: 'Bokaro Power Supply Co.',
    sector: 'Central Govt Power Facility',
    location: 'Jharkhand',
    period: 'Since Jan 2021',
    image: '/images/generated/control_room_scada.jpg',
    description: 'Comprehensive electrical and instrumentation operations, SCADA telemetry, and maintenance.',
  },
  {
    id: 4,
    title: '220 kV Substation & 36 MVA Furnace',
    client: 'Sarda Metals & Alloys',
    sector: 'Industrial Metallurgy',
    location: 'Andhra Pradesh',
    period: 'Turnkey Erection',
    image: '/images/generated/transformer_erection.jpg',
    description: 'High-voltage substation transformer bay installation, testing, and CEA/CIEG approvals.',
  },
  {
    id: 5,
    title: 'High-Pressure Steam Pipeline Overhaul',
    client: 'Thermax Partnered Units',
    sector: 'Special Class IBR',
    location: 'Odisha & Telangana',
    period: '2025 – 2026',
    image: '/images/generated/boiler_pipeline.jpg',
    description: 'Alloy steel welding, precision pre-heating, and in-house NDT radiography compliance.',
  },
  {
    id: 6,
    title: 'Utility-Scale Solar Plant O&M',
    client: 'Visakha Dairy',
    sector: 'Renewable Power',
    location: 'Vizianagaram, AP',
    period: 'Since Jan 2021',
    image: '/images/generated/renewable_hybrid_plant.jpg',
    description: 'Grid-tied solar array maintenance, inverter station upkeep, and telemetry monitoring.',
  },
];

export default function ProjectsCarousel() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector('.project-card')?.clientWidth || 360;
    const scrollAmount = (cardWidth + 24) * (direction === 'left' ? -1 : 1);
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="section section--projects" id="projects-section">
      <div className="container">
        <SectionHeading
          tag="Projects &amp; Case Studies"
          title="Explore our in-depth engineering case studies. Discover how our solutions enhance reliability and efficiency."
          className="sh--editorial"
        />

        {/* Horizontal Carousel Viewport */}
        <div
          className="project-carousel__viewport"
          ref={scrollRef}
          onScroll={checkScroll}
        >
          <div className="project-carousel__track">
            {projects.map((p, idx) => (
              <motion.div
                key={p.id}
                className="project-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <div className="project-card__bg">
                  <img src={p.image} alt={p.title} loading="lazy" />
                  <div className="project-card__gradient" />
                </div>

                <div className="project-card__top">
                  <span className="project-card__pill">{p.sector}</span>
                </div>

                <div className="project-card__bottom">
                  <div className="project-card__info">
                    <span className="project-card__client">{p.client} &bull; {p.location}</span>
                    <h3 className="project-card__title">{p.title}</h3>
                    <p className="project-card__desc">{p.description}</p>
                  </div>

                  <Link
                    to="/projects"
                    className="project-card__action-btn"
                    aria-label={`View details for ${p.title}`}
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Carousel External Navigation Arrows (Reference 5) */}
        <div className="project-carousel__nav">
          <button
            type="button"
            className="carousel-nav-btn"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous projects"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            className="carousel-nav-btn carousel-nav-btn--active"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Next projects"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
