import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import CTABanner from '../components/sections/CTABanner';
import { services } from '../data/services';
import { useApp } from '../context/AppContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Services() {
  useDocumentTitle('Services');
  const { openQuote } = useApp();
  const [active, setActive] = useState(services[0].slug);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -55% 0px' }
    );
    services.forEach((s) => { const el = document.getElementById(s.slug); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const go = (slug) => document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const servicesCards = [
    {
      type: 'wide',
      thumb: '/images/bed-coil-boiler.jpg',
      title: 'POWER PLANT & BOILER EXCELLENCE',
      desc: 'Complete power plant stewardship, AFBC bed coil replacements, solar EPC, 400 kV lines and C&I instrumentation.',
      linkText: 'EXPLORE CAPABILITIES',
      linkHref: '#services-content',
    },
    {
      type: 'stat',
      value: `${services.length}`,
      label: 'CORE SERVICES',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'STATUTORY LIAISONING',
      desc: 'IBR, CIEG and PCB approvals, drawing approvals and CEA for electrical and boiler jobs.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_services.jpg"
        eyebrow="SERVICES"
        title="EVERYTHING YOUR PLANT NEEDS, FROM ONE TEAM"
        text="Comprehensive engineering services covering power plants, boilers, solar EPC, 400 kV transmission, C&I instruments and statutory liaison."
        ctaText="Request a Quote"
        onCtaClick={() => openQuote('General Services')}
        cards={servicesCards}
      />
      <section className="section" id="services-content">
        <div className="container services-layout">
          <nav className="subnav" aria-label="Services">
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <button className={active === s.slug ? 'is-active' : ''} aria-current={active === s.slug ? 'true' : undefined} onClick={() => go(s.slug)}>
                    <Icon name={s.icon} size={16} /> {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="svc-list">
            {services.map((s, i) => (
              <Reveal key={s.slug} className="svc" id={s.slug}>
                <div className="svc__content">
                  <div className="svc__head">
                    <span className="card__icon"><Icon name={s.icon} size={28} /></span>
                    <div>
                      <span className="svc__num">{String(i + 1).padStart(2, '0')}</span>
                      <h2>{s.title}</h2>
                    </div>
                  </div>
                  <p className="lead">{s.short}</p>
                  <h3 className="mini-title">What we cover</h3>
                  <ul className="checklist checklist--cols">
                    {s.covers.map((c) => (<li key={c}><Check size={18} aria-hidden="true" /> {c}</li>))}
                  </ul>
                  <Button onClick={() => openQuote(s.title)}>Request this service</Button>
                </div>
                <div className="svc__media-col">
                  {s.gallery && s.gallery.length > 0 ? (
                    <div className="svc__gallery-grid">
                      {s.gallery.map((img, idx) => (
                        <div key={idx} className="svc__gallery-card">
                          <div className="svc__image">
                            <img src={img.src} alt={img.title || s.title} loading="lazy" />
                            {img.badge && <span className="svc__image-badge">{img.badge}</span>}
                          </div>
                          {img.caption && (
                            <div className="svc__gallery-caption">
                              {img.title && <span className="svc__gallery-label">{img.title}</span>}
                              <p>{img.caption}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="svc__image">
                      <img src={s.image} alt={s.title} loading="lazy" />
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTABanner />
    </>
  );
}
