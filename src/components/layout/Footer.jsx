import { Link } from 'react-router-dom';
import { ArrowUp, Mail, MapPin, Phone, ShieldCheck, Award } from 'lucide-react';
import Logo from './Logo';
import { company, navLinks } from '../../data/company';
import { services } from '../../data/services';
import { useApp } from '../../context/AppContext';

export default function Footer() {
  const { openIso } = useApp();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-editorial" aria-label="Site Footer">
      <div className="container">
        {/* Giant Editorial Brand Watermark */}
        <div className="footer-editorial__watermark" aria-hidden="true">
          <span>Energy · Execution · Efficiency</span>
        </div>

        {/* Structured Column Navigation */}
        <div className="footer-editorial__grid">
          {/* Column 1: Brand & Credentials */}
          <div className="footer-col footer-col--brand">
            <Logo />
            <p className="footer-col__desc">
              Power plant O&amp;M, electrical EPC and expert manpower for power plants and industry across India.
            </p>
            <div className="footer-col__accreditations">
              <span className="footer-pill-badge">
                <Award size={14} />
                <span>Special Class IBR</span>
              </span>
              <span className="footer-pill-badge">
                <ShieldCheck size={14} />
                <span>Electrical ‘A’ Grade</span>
              </span>
              <button
                type="button"
                className="footer-pill-badge footer-pill-badge--btn"
                onClick={openIso}
                title="Click to view ISO Certificates"
              >
                <ShieldCheck size={14} />
                <span>ISO 9001 · 14001 · 45001</span>
              </button>
            </div>
          </div>

          {/* Grouped Links Row on Mobile: Navigation & Engineering Services Side-by-Side */}
          <div className="footer-editorial__nav-group">
            {/* Column 2: Navigation */}
            <div className="footer-col footer-col--nav">
              <h4 className="footer-col__title">Navigation</h4>
              <ul className="footer-col__list">
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="footer-col__link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Engineering Services */}
            <div className="footer-col footer-col--services">
              <h4 className="footer-col__title">Engineering Services</h4>
              <ul className="footer-col__list">
                {services.slice(0, 6).map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services#${s.slug}`} className="footer-col__link">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Offices & Direct Contacts */}
          <div className="footer-col footer-col--contact">
            <h4 className="footer-col__title">Direct Contacts</h4>
            <div className="footer-col__office">
              <strong>{company.offices[0].title}</strong>
              <p className="footer-col__line">
                <MapPin size={14} aria-hidden="true" />
                <span>{company.offices[0].lines.join(' ')}</span>
              </p>
              <p className="footer-col__line">
                <Phone size={14} aria-hidden="true" />
                <span className="footer-col__phone-numbers">
                  <a href={`tel:${company.offices[0].phones[0]}`}>+91 {company.offices[0].phones[0]}</a>
                  <span className="sep">/</span>
                  <a href={`tel:${company.offices[0].phones[1]}`}>+91 {company.offices[0].phones[1]}</a>
                </span>
              </p>
            </div>

            <div className="footer-col__office">
              <strong>{company.offices[1].title}</strong>
              <p className="footer-col__line">
                <MapPin size={14} aria-hidden="true" />
                <span>{company.offices[1].lines.join(' ')}</span>
              </p>
              <p className="footer-col__line">
                <Phone size={14} aria-hidden="true" />
                <span className="footer-col__phone-numbers">
                  {company.offices[1].phones.map((ph, i) => (
                    <span key={ph} className="footer-col__phone-item">
                      {i > 0 && <span className="sep">/</span>}
                      <a href={`tel:${ph}`}>+91 {ph}</a>
                    </span>
                  ))}
                </span>
              </p>
            </div>

            <div className="footer-col__emails">
              {company.emails.map((m) => (
                <p key={m} className="footer-col__line footer-col__email-item">
                  <Mail size={14} aria-hidden="true" />
                  <a href={`mailto:${m}`}>{m}</a>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-editorial__bottom">
          <div className="footer-editorial__copy">
            <span>&copy; {new Date().getFullYear()} Triple E Services. All rights reserved.</span>
          </div>
          <button
            type="button"
            className="footer-editorial__back-top"
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
          >
            <span>Back to top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
