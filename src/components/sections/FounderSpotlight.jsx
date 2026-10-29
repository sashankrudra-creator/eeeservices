import Reveal from '../ui/Reveal';
import Button from '../ui/Button';
import SectionHeading from '../ui/SectionHeading';
import { founder } from '../../data/team';
import { ArrowRight } from 'lucide-react';

export const initials = (name) => name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export default function FounderSpotlight({ full = false }) {
  return (
    <section className="section" id="founder">
      <div className="container founder">
        <Reveal className="founder__avatar" aria-hidden="true">
          <span>{initials(founder.name)}</span>
          <i />
        </Reveal>
        <div>
          <SectionHeading number={full ? '01' : undefined} eyebrow="Leadership" title={founder.name} text={`${founder.role} · ${founder.credentials}`} />
          <Reveal delay={0.1}>
            <p className="lead">{founder.bio}</p>
            <ul className="chips">
              {founder.expertise.map((e) => (<li key={e} className="chip">{e}</li>))}
            </ul>
            {!full && <Button to="/about#experts" variant="dark" iconRight={<ArrowRight size={16} />}>Meet the full team</Button>}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
