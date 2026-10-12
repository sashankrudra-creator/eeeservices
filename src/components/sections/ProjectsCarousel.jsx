import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

// Taken from src/data/contracts.js and src/data/electricalProjects.js.
const projects = [
  {
    id: 1,
    title: 'O&M of 1x135 MW Power Plant',
    client: 'VSLP',
    sector: 'Power Plant O&M',
    location: 'Rajasthan',
    period: 'Since Oct 2018',
    image: '/images/generated/hero_industrial_plant.jpg',
    description: 'Operation and maintenance of a 1x135 MW power plant, continuing since October 2018.',
  },
  {
    id: 2,
    title: 'O&M of 400 kV Transmission Line, 27 km',
    client: 'JSW-MPCL',
    sector: 'Transmission',
    location: 'Chhattisgarh',
    period: 'Since Jun 2018',
    image: '/images/generated/transmission_grid.jpg',
    description: 'O&M of a 27 km 400 kV line since June 2018, plus AMC for 400 kV double circuit quad line maintenance (JSW-KMPCL) since 2019.',
  },
  {
    id: 3,
    title: 'Electrical & C&I O&M, 38.5 MW PF Boiler Power Plant',
    client: 'Bokaro Power Supply Co. (Central Govt)',
    sector: 'Power Plant E&I',
    location: 'Jharkhand',
    period: 'Since Jan 2021',
    image: '/images/generated/control_room_scada.jpg',
    description: 'Electrical and C&I operation and maintenance of a 38.5 MW PF boiler power plant, continuing since January 2021.',
  },
  {
    id: 4,
    title: '220 kV Substation Works',
    client: 'Sarda Metals & Alloys',
    sector: 'Substation',
    location: 'Andhra Pradesh',
    period: 'Feb 2022',
    image: '/images/generated/transformer_erection.jpg',
    description: 'Supply, erection and commissioning of 220 kV substation works, followed by 36 MVA submerged furnace works in August 2022.',
  },
  {
    id: 5,
    title: 'Power & Distillery O&M under Thermax',
    client: 'Coastal Bio · Vivek Bio · Tatsavi Manikanta',
    sector: 'Power & Distillery',
    location: 'Odisha · Telangana · Tamil Nadu',
    period: 'Apr 2025 – 2026',
    image: '/images/generated/boiler_pipeline.jpg',
    description: 'O&M of power and distillery plants under Thermax at three sites across Odisha, Telangana and Tamil Nadu.',
  },
  {
    id: 6,
    title: 'O&M of 1.65 MWp Solar Power Plant',
    client: 'Visakha Dairy',
    sector: 'Solar',
    location: 'Andhra Pradesh',
    period: 'Since 2021',
    image: '/images/generated/renewable_hybrid_plant.jpg',
    description: 'Solar O&M activities for the 1.65 MWp solar power plant at Visakha Dairy, continuing since 2021.',
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
          tag="Track record"
          title="Featured projects."
          text="A few of the plants, lines and substations we keep running every day."
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
                    <span className="project-card__client">{p.client} &bull; {p.location} &bull; {p.period}</span>
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
