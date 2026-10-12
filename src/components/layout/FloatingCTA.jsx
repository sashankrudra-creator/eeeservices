import { Phone, Zap } from 'lucide-react';
import { company } from '../../data/company';
import { useApp } from '../../context/AppContext';
import useScrollPosition from '../../hooks/useScrollPosition';

// Mobile-only quick actions; appear once the visitor has scrolled past the hero.
export default function FloatingCTA() {
  const { openQuote } = useApp();
  const y = useScrollPosition();
  const show = y > 640;
  return (
    <div className={`floating ${show ? 'is-visible' : ''}`} aria-hidden={!show}>
      <a className="floating__call" href={`tel:${company.offices[0].phones[0]}`} aria-label="Call Triple E Services" tabIndex={show ? 0 : -1}><Phone size={20} /></a>
      <button className="floating__quote" onClick={() => openQuote()} tabIndex={show ? 0 : -1}><Zap size={18} aria-hidden="true" /> Request Quote</button>
    </div>
  );
}
