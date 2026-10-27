import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Mail, Menu, Phone, X, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import TopClientTicker from './TopClientTicker';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import useScrollPosition from '../../hooks/useScrollPosition';
import { company, navLinks } from '../../data/company';
import { services } from '../../data/services';
import { useApp } from '../../context/AppContext';

export default function Navbar() {
  const y = useScrollPosition();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [drawerServicesOpen, setDrawerServicesOpen] = useState(false);
  const { pathname } = useLocation();
  const { openQuote } = useApp();
  const scrolled = y > 40;

  useEffect(() => {
    setOpen(false);
    setMega(false);
    setDrawerServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setMega(false); setOpen(false); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className={`topbar ${scrolled ? 'is-hidden' : ''}`}>
        <div className="container topbar__in">
          <div className="topbar__contact">
            <a href={`tel:${company.offices[0].phones[0]}`}><Phone size={14} aria-hidden="true" /> {company.offices[0].phones[0]} / {company.offices[0].phones[1]}</a>
            <a href={`mailto:${company.emails[0]}`}><Mail size={14} aria-hidden="true" /> {company.emails[0]}</a>
          </div>
          <div className="topbar__badges">
            <span>Special Class IBR</span>
            <span>Electrical &lsquo;A&rsquo; Grade</span>
            <span>ISO Certified</span>
          </div>
        </div>
      </div>
      <div className="container nav">
        <Logo />
        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((l) =>
            l.mega ? (
              <div key={l.to} className="nav__item" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)} onFocus={() => setMega(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setMega(false); }}>
                <NavLink to={l.to} className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
                  {l.label} <ChevronDown size={14} aria-hidden="true" />
                </NavLink>
                <AnimatePresence>
                  {mega && (
                    <motion.div className="mega" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.18 }}>
                      <div className="mega__grid">
                        {services.map((s) => (
                          <NavLink key={s.slug} to={`/services#${s.slug}`} className="mega__link">
                            <Icon name={s.icon} size={20} />
                            <span>{s.title}</span>
                          </NavLink>
                        ))}
                        <NavLink to="/operations-maintenance#capabilities" className="mega__link mega__link--hl">
                          <Icon name="Settings" size={20} />
                          <span>O&amp;M Capabilities <ArrowRight size={14} aria-hidden="true" /></span>
                        </NavLink>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
                {l.label}
              </NavLink>
            )
          )}
        </nav>
        <div className="nav__cta">
          <a className="nav__phone" href={`tel:${company.offices[0].phones[0]}`}>
            <span className="nav__phone-ic"><Phone size={16} aria-hidden="true" /></span>
            <span><small>Call us</small>+91 {company.offices[0].phones[0]}</span>
          </a>
          <Button size="sm" onClick={() => openQuote()} iconRight={<ArrowRight size={15} />}>Contact Us</Button>
        </div>
        <button className="nav__burger" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><Menu size={26} /></button>
      </div>
      <TopClientTicker />
    </header>

      <AnimatePresence>
        {open && (
          <motion.div className="drawer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Menu">
            <div className="drawer__top">
              <Logo />
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu"><X size={24} /></button>
            </div>
            <nav className="drawer__links" aria-label="Mobile">
              {navLinks.map((l, i) => (
                <motion.div key={l.to} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
                  {l.mega ? (
                    <div className="drawer__mega-group">
                      <div className="drawer__link-row">
                        <NavLink to={l.to} className={({ isActive }) => `drawer__link ${isActive ? 'is-active' : ''}`} onClick={() => setOpen(false)}>
                          {l.label}
                        </NavLink>
                        <button
                          type="button"
                          className="drawer__sub-toggle"
                          onClick={() => setDrawerServicesOpen(!drawerServicesOpen)}
                          aria-label="Toggle services list"
                          aria-expanded={drawerServicesOpen}
                        >
                          <ChevronDown size={18} className={drawerServicesOpen ? 'is-open' : ''} />
                        </button>
                      </div>
                      <AnimatePresence>
                        {drawerServicesOpen && (
                          <motion.div
                            className="drawer__sublinks"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {services.map((s) => (
                              <NavLink key={s.slug} to={`/services#${s.slug}`} className="drawer__sublink" onClick={() => setOpen(false)}>
                                <Icon name={s.icon} size={16} />
                                <span>{s.title}</span>
                              </NavLink>
                            ))}
                            <NavLink to="/operations-maintenance#capabilities" className="drawer__sublink drawer__sublink--hl" onClick={() => setOpen(false)}>
                              <Icon name="Settings" size={16} />
                              <span>O&amp;M Capabilities <ArrowRight size={13} aria-hidden="true" /></span>
                            </NavLink>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => `drawer__link ${isActive ? 'is-active' : ''}`} onClick={() => setOpen(false)}>
                      {l.label} <ArrowRight size={18} aria-hidden="true" />
                    </NavLink>
                  )}
                </motion.div>
              ))}
            </nav>
            <div className="drawer__foot">
              <Button onClick={() => { setOpen(false); openQuote(); }}>Get a Quote</Button>
              <Button variant="ghost" href={`tel:${company.offices[0].phones[0]}`} icon={<Phone size={16} />}>Call Now</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
