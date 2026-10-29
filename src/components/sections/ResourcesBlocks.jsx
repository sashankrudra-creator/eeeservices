import { Check } from 'lucide-react';
import Icon from '../ui/Icon';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import { resourceBlocks, equipment, ndt, rampUp, droneThermography } from '../../data/resources';

export default function ResourcesBlocks() {
  return (
    <>
      <section className="section">
        <div className="container">
          <SectionHeading number="01" eyebrow="Resources" title="People, tools and workshops ready to mobilise" />
          <div className="grid grid--2">
            {resourceBlocks.map((b, i) => (
              <Reveal key={b.title} delay={(i % 2) * 0.08}>
                <div className="card card--resource">
                  <span className="card__icon"><Icon name={b.icon} size={26} /></span>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                  <ul className="checklist">
                    {b.highlights.map((h) => (<li key={h}><Check size={16} aria-hidden="true" /> {h}</li>))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container">
          <SectionHeading number="02" eyebrow="Equipment & Diagnostics" title="Tools, tackles and advanced testing" />
          <ul className="chips chips--lg">
            {equipment.map((e) => (<li key={e} className="chip">{e}</li>))}
          </ul>
          <h3 className="mini-title">Non-destructive testing (in-house, qualified)</h3>
          <div className="ndt">
            {ndt.map((n, i) => (
              <Reveal key={n.label} delay={i * 0.06} className="ndt__item">
                <Icon name={n.icon} size={26} />
                <span>{n.label}</span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="drone-showcase">
              <div className="drone-showcase__content">
                <span className="eyebrow eyebrow--glow" style={{ color: 'var(--olive-d, #495e35)', background: 'var(--sage-soft, rgba(168, 181, 162, 0.2))', padding: '4px 10px', borderRadius: '999px', display: 'inline-block', marginBottom: '8px' }}>
                  {droneThermography.badge}
                </span>
                <h3>{droneThermography.title}</h3>
                <p>{droneThermography.description}</p>
                <ul className="checklist">
                  {droneThermography.items.map((it) => (
                    <li key={it}><Check size={16} aria-hidden="true" /> {it}</li>
                  ))}
                </ul>
              </div>
              <div className="drone-showcase__visuals">
                <div className="drone-showcase__img-card">
                  <img src={droneThermography.droneImage} alt="Aerial thermography using latest drone technology" />
                  <span className="drone-showcase__caption">Aerial Drone Tower Inspection</span>
                </div>
                <div className="drone-showcase__img-card">
                  <img src={droneThermography.thermalImage} alt="Radiometric infrared thermal scan on transmission grid" />
                  <span className="drone-showcase__caption">Radiometric Thermography Scan</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--dark section--grid">
        <div className="container">
          <Reveal className="ramp">
            <span className="eyebrow eyebrow--glow">Ramp-up capability</span>
            <h2>{rampUp.headline}</h2>
            <p>{rampUp.text}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
