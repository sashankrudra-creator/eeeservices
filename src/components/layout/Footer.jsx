import { Link } from 'react-router-dom';
import { ArrowUp, Mail, MapPin, Phone, ShieldCheck, Award } from 'lucide-react';
import Logo from './Logo';
import { company, navLinks } from '../../data/company';
import { services } from '../../data/services';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-editorial" aria-label="Site Footer">
      <div className="container">
        {/* Giant Editorial Brand Watermark (Direct Reference 3 Inspiration) */}
        <div className="footer-editorial__watermark" aria-hidden="true">
          <span>2026-Triple-E-Services</span>
        </div>

        {/* Structured Column Navigation */}
        <div className="footer-editorial__grid">
          {/* Column 1: Brand & Credentials */}
          <div className="footer-col footer-col--brand">
            <Logo />
            <p className="footer-col__desc">
              Pioneering turnkey electrical EPC, 400 kV extra-high-voltage substations, and comprehensive power plant &amp; boiler O&amp;M across 6 Indian industrial states.
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
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="footer-col">
            <h4 className="footer-col__title">Navigation</h4>
            <ul className="footer-col__list">
              {navLinks.slice(0, 6).map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="footer-col__link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Core Capabilities */}
          <div className="footer-col">
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

          {/* Column 4: Offices & Direct Contacts */}
          <div className="footer-col footer-col--contact">
            <h4 className="footer-col__title">Direct Contacts</h4>
            <div className="footer-col__office">
              <strong>{company.offices[0].title}</strong>
              <p>
                <MapPin size={14} />
                <span>{company.offices[0].lines.join(' ')}</span>
              </p>
              <p>
                <Phone size={14} />
                <a href={`tel:${company.offices[0].phones[0]}`}>
                  +91 {company.offices[0].phones[0]}
                </a>
                <span> / </span>
                <a href={`tel:${company.offices[0].phones[1]}`}>
                  +91 {company.offices[0].phones[1]}
                </a>
              </p>
            </div>

            <div className="footer-col__office">
              <strong>{company.offices[1].title}</strong>
              <p>
                <MapPin size={14} />
                <span>{company.offices[1].lines.join(' ')}</span>
              </p>
            </div>

            <div className="footer-col__email">
              <Mail size={14} />
              <a href={`mailto:${company.emails[0]}`}>{company.emails[0]}</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-editorial__bottom">
          <div className="footer-editorial__copy">
            &copy; 2026 Triple E Services (Energy &bull; Execution &bull; Efficiency). All rights reserved.
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
