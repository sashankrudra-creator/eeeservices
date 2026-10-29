import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import { fullTimeExperts, domainExperts } from '../../data/team';
import { initials } from './FounderSpotlight';

function ExpertCard({ p, big }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`card expert ${big ? 'expert--big' : ''}`}>
      <div className="expert__head">
        <span className="expert__avatar" aria-hidden="true">{initials(p.name)}</span>
        <div>
          <h3>{p.name}</h3>
          <p className="muted">{p.role}</p>
        </div>
        <span className="badge badge--green">{p.years}</span>
      </div>
      <p>{p.summary}</p>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p key="d" className="expert__detail" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            {p.detail}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="expert__foot">
        {p.email && (
          <a href={`mailto:${p.email}`} className="expert__email" title={`Email ${p.name}`}>
            <Mail size={13} aria-hidden="true" />
            <span>{p.email}</span>
          </a>
        )}
        <button className="link-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{open ? 'Show less' : 'Read more'}</button>
      </div>
    </div>
  );
}

export default function ExpertsGrid() {
  return (
    <section className="section section--mist" id="experts">
      <div className="container">
        <SectionHeading number="03" eyebrow="Our people" title="Full-time experts" text="Senior engineers with decades of hands-on plant experience, working full time with Triple E Services." />
        <div className="grid grid--2">
          {fullTimeExperts.map((p, i) => (<Reveal key={p.name} delay={i * 0.08}><ExpertCard p={p} big /></Reveal>))}
        </div>
        <div style={{ height: 56 }} />
        <SectionHeading eyebrow="Domain experts" title="Team of domain experts" />
        <div className="grid grid--3">
          {domainExperts.map((p, i) => (<Reveal key={p.name} delay={(i % 3) * 0.08}><ExpertCard p={p} /></Reveal>))}
        </div>
      </div>
    </section>
  );
}
