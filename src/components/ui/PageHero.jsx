import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PageHero({
  title,
  text,
  eyebrow,
  image,
  ctaText = 'Get Started',
  onCtaClick,
  cards = [],
  children,
}) {
  const { openQuote } = useApp();

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      openQuote(title || 'General Enquiry');
    }
  };

  return (
    <section className="hero-reference hero-reference--module" aria-label={title || 'Hero Section'}>
      {/* Background Image: High resolution generated scenic visual */}
      <div className="hero-reference__bg" aria-hidden="true">
        {image && (
          <img
            src={image}
            alt={title || 'Triple E Services'}
            className="hero-reference__img"
            loading="eager"
          />
        )}
        <div className="hero-reference__overlay" />
      </div>

      <div className="container hero-reference__container">
        {/* Navigation Breadcrumb */}
        <div className="hero-module__breadcrumb-wrap">
          <nav className="crumbs crumbs--module" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">{eyebrow || title}</span>
          </nav>
        </div>

        {/* Main Center Typography & CTA matching Home reference */}
        <div className="hero-reference__center">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {eyebrow && (
              <span className="hero-module__eyebrow-badge">
                {eyebrow}
              </span>
            )}
            <h1 className="hero-reference__title hero-reference__title--module">
              {title}
            </h1>
            {text && (
              <p className="hero-reference__subtitle hero-reference__subtitle--module">
                {text}
              </p>
            )}

            <div className="hero-reference__cta-wrap">
              <button
                type="button"
                className="hero-reference__get-started-btn"
                onClick={handleCta}
              >
                <span>{ctaText}</span>
                <span className="hero-reference__btn-arrow" aria-hidden="true">
                  <ArrowRight size={17} />
                </span>
              </button>
            </div>

            {children}
          </motion.div>
        </div>

        {/* Floating Glassmorphic Cards at Bottom (Dynamic per module) */}
        {cards && cards.length > 0 && (
          <div className="hero-reference__cards hero-reference__cards--module">
            {cards.map((card, idx) => {
              const delay = 0.2 + idx * 0.1;
              if (card.type === 'wide') {
                return (
                  <motion.div
                    key={idx}
                    className="hero-ref-card hero-ref-card--wide"
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay, duration: 0.55 }}
                  >
                    {card.thumb && (
                      <div className="hero-ref-card__thumb">
                        <img src={card.thumb} alt={card.title} loading="eager" />
                      </div>
                    )}
                    <div className="hero-ref-card__info">
                      <h3 className="hero-ref-card__title">{card.title}</h3>
                      <p className="hero-ref-card__desc">{card.desc}</p>
                      {card.linkText && card.linkHref && (
                        <a
                          href={card.linkHref}
                          className="hero-ref-card__link"
                          onClick={(e) => {
                            if (card.linkHref.startsWith('#')) {
                              e.preventDefault();
                              document.querySelector(card.linkHref)?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          {card.linkText}
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              }

              if (card.type === 'stat') {
                return (
                  <motion.div
                    key={idx}
                    className="hero-ref-card hero-ref-card--stat"
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay, duration: 0.55 }}
                  >
                    {card.badgeIcon && (
                      <div className="hero-ref-card__avatars" aria-hidden="true">
                        <span className="ref-avatar ref-avatar--1">
                          <img src="/images/Triple E Energy Services Logo.png?v=5" alt="" />
                        </span>
                        <span className="ref-avatar ref-avatar--2">
                          <span>⚡</span>
                        </span>
                        <span className="ref-avatar ref-avatar--3">
                          <span>★</span>
                        </span>
                      </div>
                    )}
                    <div className="hero-ref-card__number">{card.value}</div>
                    <div className="hero-ref-card__label">{card.label}</div>
                  </motion.div>
                );
              }

              // default / feature card
              return (
                <motion.div
                  key={idx}
                  className="hero-ref-card hero-ref-card--feature"
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, duration: 0.55 }}
                >
                  {card.iconImg ? (
                    <div className="hero-ref-card__tree-icon" aria-hidden="true">
                      <img src={card.iconImg} alt="" />
                    </div>
                  ) : card.icon ? (
                    <div className="hero-module-card__icon" aria-hidden="true">
                      {card.icon}
                    </div>
                  ) : (
                    <div className="hero-ref-card__tree-icon" aria-hidden="true">
                      <img src="/images/generated/tree_icon.jpg" alt="" />
                    </div>
                  )}
                  <h3 className="hero-ref-card__title">{card.title}</h3>
                  <p className="hero-ref-card__desc">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
