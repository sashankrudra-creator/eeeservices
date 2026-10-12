import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { company, oneStop } from '../../data/company';
import { manpowerTotals } from '../../data/manpower';

const ease = [0.22, 1, 0.36, 1];
const words = company.tagline.split('|').map((w) => w.trim());

export default function Hero() {
  const { openQuote } = useApp();
  const reduce = useReducedMotion();
  const rise = (delay) => (reduce ? {} : { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease } });

  return (
    <section className="hero-reference hero-reference--home" aria-label="Triple E Services">
      <div className="hero-reference__bg" aria-hidden="true">
        <img
          src="/images/generated/hero_windmills_exact.jpg"
          alt=""
          className="hero-reference__img"
        />
        <div className="hero-reference__overlay" />
      </div>

      <div className="container hero-reference__container">
        <div className="hero-reference__center">
          {/* Brand lockup: original logo + company tagline */}
          <motion.div className="hero-brand" {...rise(0)}>
            <span className="hero-brand__plate">
              <img src="/images/Triple E Energy Services Logo.png?v=5" alt="Triple E Services" />
            </span>
            <span className="hero-brand__tagline" aria-label={words.join(', ')}>
              {words.map((w, i) => (
                <span key={w}>{i > 0 && <i aria-hidden="true" />}{w}</span>
              ))}
            </span>
          </motion.div>

          <motion.h1 className="hero-reference__title" {...rise(0.1)}>
            Powering Plants.<br />
            <span className="hero-reference__title-accent">Delivering Performance.</span>
          </motion.h1>

          <motion.p className="hero-reference__subtitle" {...rise(0.2)}>
            Comprehensive O&amp;M, electrical EPC and expert manpower for power plants and industry across India.
          </motion.p>

          <motion.div className="hero-reference__cta-wrap" {...rise(0.3)}>
            <button
              type="button"
              className="hero-reference__get-started-btn"
              onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>Explore Services</span>
              <span className="hero-reference__btn-arrow" aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </button>
            <button type="button" className="hero-reference__ghost-btn" onClick={() => openQuote()}>
              Get a Quote
            </button>
          </motion.div>
        </div>

        {/* Floating information cards (same images, real company data) */}
        <div className="hero-reference__cards">
          <motion.div className="hero-ref-card hero-ref-card--wide" {...rise(0.35)}>
            <div className="hero-ref-card__thumb">
              <img src="/images/generated/grid_sustainability_thumb.jpg" alt="Solar and power plant infrastructure" loading="eager" />
            </div>
            <div className="hero-ref-card__info">
              <h3 className="hero-ref-card__title">
                One-stop shop for<br />power &amp; boiler needs
              </h3>
              <p className="hero-ref-card__desc">
                {oneStop.verticals[0].title} and {oneStop.verticals[1].title}: a single specialised agency in all aspects.
              </p>
              <a
                href="#services-section"
                className="hero-ref-card__link"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Discover our services
              </a>
            </div>
          </motion.div>

          <motion.div className="hero-ref-card hero-ref-card--stat" {...rise(0.45)}>
            <div className="hero-ref-card__avatars" aria-hidden="true">
              <span className="ref-avatar ref-avatar--1">
                <img src="/images/Triple E Energy Services Logo.png?v=5" alt="" />
              </span>
              <span className="ref-avatar ref-avatar--2"><Users size={18} /></span>
              <span className="ref-avatar ref-avatar--3"><span>6</span></span>
            </div>
            <div className="hero-ref-card__number">{manpowerTotals.total.toLocaleString('en-IN')}</div>
            <div className="hero-ref-card__label">Total manpower · 6 states</div>
          </motion.div>

          <motion.div className="hero-ref-card hero-ref-card--feature" {...rise(0.55)}>
            <div className="hero-ref-card__tree-icon" aria-hidden="true">
              <img src="/images/generated/tree_icon.jpg" alt="" />
            </div>
            <h3 className="hero-ref-card__title">
              <BadgeCheck size={18} aria-hidden="true" /> Licensed &amp; certified
            </h3>
            <p className="hero-ref-card__desc">
              Special Class IBR and Electrical &lsquo;A&rsquo; Grade licences, issued by Rajasthan and endorsed by AP state.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
