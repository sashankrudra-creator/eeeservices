import Reveal from './Reveal';
import { ArrowDown } from 'lucide-react';

export default function SectionHeading({ eyebrow, tag, title, text, number, align = 'left', light = false, className = '' }) {
  const pillLabel = tag || eyebrow;
  return (
    <Reveal className={`sh sh--${align} ${light ? 'sh--light' : ''} ${className}`}>
      {number && <span className="sh__num" aria-hidden="true">{number}</span>}
      {pillLabel && (
        <div className="sh__pill-wrap">
          <span className={`pill-tag ${light ? 'pill-tag--light' : ''}`}>
            <span className="pill-tag__icon" aria-hidden="true"><ArrowDown size={13} /></span>
            <span className="pill-tag__label">{pillLabel}</span>
          </span>
        </div>
      )}
      <h2 className="sh__title">{title}</h2>
      {text && <p className="sh__text">{text}</p>}
    </Reveal>
  );
}

