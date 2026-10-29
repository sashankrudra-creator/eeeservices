import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import { timeline } from '../../data/company';

export default function Timeline() {
  return (
    <section className="section section--dark section--grid">
      <div className="container">
        <SectionHeading light number="04" eyebrow="Our journey" title="Years of execution on live plants" />
        <ol className="timeline">
          {timeline.map((t, i) => (
            <Reveal as="li" key={t.year} delay={(i % 3) * 0.06} className="timeline__item">
              <span className="timeline__year">{t.year}</span>
              <p>{t.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
