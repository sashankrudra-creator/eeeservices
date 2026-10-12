import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Hero() {
  const { openQuote } = useApp();

  return (
    <section className="hero-reference" aria-label="Hero Section">
      {/* Background Image: Generated Windmills on Green Rolling Hills */}
      <div className="hero-reference__bg" aria-hidden="true">
        <img
          src="/images/generated/hero_windmills_exact.jpg"
          alt="Wind turbines on lush green rolling hills"
          className="hero-reference__img"
        />
        {/* Soft, natural gradient overlay: NO harsh dark tones, pure bright daylight atmosphere */}
        <div className="hero-reference__overlay" />
      </div>

      <div className="container hero-reference__container">
        {/* Main Center Typography & CTA */}
        <div className="hero-reference__center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="hero-reference__title">
              POWER TOMORROW TODAY<br />
              WITH TRIPLE E SERVICES
            </h1>
            <p className="hero-reference__subtitle">
              From cutting-edge green designs to recycling programs we&rsquo;re dedicated to<br className="hero-reference__br" />
              transforming the world with every eco-friendly product
            </p>

            <div className="hero-reference__cta-wrap">
              <button
                type="button"
                className="hero-reference__get-started-btn"
                onClick={() => {
                  const el = document.getElementById('who-we-are') || document.getElementById('services-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Get Started</span>
                <span className="hero-reference__btn-arrow" aria-hidden="true">
                  <ArrowRight size={17} />
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Glassmorphic Cards at Bottom */}
        <div className="hero-reference__cards">
          {/* Card 1: Sustainability Meets Style */}
          <motion.div
            className="hero-ref-card hero-ref-card--wide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="hero-ref-card__thumb">
              <img
                src="/images/generated/grid_sustainability_thumb.jpg"
                alt="Sustainability and green energy designs"
                loading="eager"
              />
            </div>
            <div className="hero-ref-card__info">
              <h3 className="hero-ref-card__title">
                WHERE SUSTAINABILITY<br />
                MEETS STYLE.
              </h3>
              <p className="hero-ref-card__desc">
                With green designs and recycling we&rsquo;re making the world eco-friendly.
              </p>
              <a
                href="#services-section"
                className="hero-ref-card__link"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                DISCOVER OUR SERVICES
              </a>
            </div>
          </motion.div>

          {/* Card 2: 10M+ Customers with Avatar Stack */}
          <motion.div
            className="hero-ref-card hero-ref-card--stat"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="hero-ref-card__avatars" aria-hidden="true">
              <span className="ref-avatar ref-avatar--1">
                <img src="/images/Triple E Energy Services Logo.png?v=5" alt="" />
              </span>
              <span className="ref-avatar ref-avatar--2">
                <span>E</span>
              </span>
              <span className="ref-avatar ref-avatar--3">
                <span>⚡</span>
              </span>
            </div>
            <div className="hero-ref-card__number">10M+</div>
            <div className="hero-ref-card__label">CUSTOMERS</div>
          </motion.div>

          {/* Card 3: Efficient Solar Panels with Tree Icon */}
          <motion.div
            className="hero-ref-card hero-ref-card--feature"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="hero-ref-card__tree-icon" aria-hidden="true">
              <img
                src="/images/generated/tree_icon.jpg"
                alt="Green tree icon"
              />
            </div>
            <h3 className="hero-ref-card__title">
              EFFICIENT SOLAR PANELS
            </h3>
            <p className="hero-ref-card__desc">
              Our solar panels deliver maximum efficiency ensuring you get the most out of every ray.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
