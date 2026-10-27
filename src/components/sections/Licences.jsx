import { useState } from 'react';
import { BadgeCheck, ZoomIn } from 'lucide-react';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import SmartImage from '../ui/SmartImage';
import Lightbox from '../ui/Lightbox';
import { company } from '../../data/company';

const extra = [
  { id: 'a1', src: '/images/licence-ap-endorsement-1.jpg', caption: 'AP endorsement of IBR recognition', category: 'Licences' },
  { id: 'a2', src: '/images/licence-ap-endorsement-2.jpg', caption: 'AP endorsement of electrical licence', category: 'Licences' },
];

export default function Licences() {
  const docs = [...company.licences.map((l) => ({ id: l.id, src: l.image, caption: l.title, category: 'Licences' })), ...extra];
  const [idx, setIdx] = useState(null);
  return (
    <section className="section">
      <div className="container">
        <SectionHeading number="01" eyebrow="Licensed & certified" title="Statutory licences & ISO certifications you can rely on" text="We hold Special Class IBR and Electrical 'A' Grade statutory licences endorsed by AP state, alongside ISO certified management systems." />
        <div className="grid grid--3">
          {company.licences.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.1}>
              <div className="card licence">
                <span className="card__icon"><BadgeCheck size={28} aria-hidden="true" /></span>
                <h3>{l.title}</h3>
                <p>{l.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <h3 className="mini-title">Certificates</h3>
        <div className="docs">
          {docs.map((d, i) => (
            <button key={d.id} className="doc" onClick={() => setIdx(i)} aria-label={`View ${d.caption}`}>
              <SmartImage src={d.src} alt={d.caption} />
              <span><ZoomIn size={16} aria-hidden="true" /> {d.caption}</span>
            </button>
          ))}
        </div>
      </div>
      <Lightbox items={docs} index={idx} onClose={() => setIdx(null)} onIndex={setIdx} />
    </section>
  );
}
