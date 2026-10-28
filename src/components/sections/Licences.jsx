import { useState, useMemo } from 'react';
import { BadgeCheck, ZoomIn, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import SmartImage from '../ui/SmartImage';
import Lightbox from '../ui/Lightbox';
import FilterChips from '../ui/FilterChips';
import { company, certificates } from '../../data/company';

const filterOptions = ['Statutory Licences', 'ISO Certifications'];

export default function Licences() {
  const [filter, setFilter] = useState('All');
  const [idx, setIdx] = useState(null);

  const visibleDocs = useMemo(() => {
    if (filter === 'All') return certificates;
    return certificates.filter((d) => d.category === filter);
  }, [filter]);

  return (
    <section className="section" id="licences">
      <div className="container">
        <SectionHeading
          number="01"
          eyebrow="Licensed & certified"
          title="Statutory licences & ISO certifications you can rely on"
          text="We hold Special Class IBR and Electrical 'A' Grade statutory licences endorsed by AP state, alongside ISO certified management systems for Quality, Environment, and Health & Safety."
        />

        <div className="grid grid--3">
          {company.licences.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.1}>
              <div className="card licence">
                <span className="card__icon">
                  {l.id === 'iso' ? (
                    <Award size={28} aria-hidden="true" />
                  ) : (
                    <BadgeCheck size={28} aria-hidden="true" />
                  )}
                </span>
                <h3>{l.title}</h3>
                <p>{l.text}</p>
                {l.badges && (
                  <div className="licence__badges">
                    {l.badges.map((b) => (
                      <span key={b} className="licence__badge">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="licences__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '48px', marginBottom: '24px' }}>
          <div>
            <h3 className="mini-title" style={{ margin: 0 }}>Official Certificates ({visibleDocs.length})</h3>
            <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--ink-2)' }}>
              Click any certificate to expand in full-resolution viewer
            </p>
          </div>
          <FilterChips
            options={filterOptions}
            value={filter}
            onChange={setFilter}
            allLabel="All Certificates"
            label="Filter certificates"
          />
        </div>

        <motion.div layout className="docs">
          <AnimatePresence>
            {visibleDocs.map((d, i) => (
              <motion.button
                layout
                key={d.id}
                className="doc"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIdx(i)}
                aria-label={`View ${d.caption}`}
              >
                <SmartImage src={d.src} alt={d.caption} />
                <div className="doc__body">
                  <ZoomIn size={16} aria-hidden="true" />
                  <div className="doc__meta">
                    <span className="doc__caption">{d.caption}</span>
                    <span className="doc__category">{d.category}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Lightbox
        items={visibleDocs}
        index={idx}
        onClose={() => setIdx(null)}
        onIndex={setIdx}
      />
    </section>
  );
}
