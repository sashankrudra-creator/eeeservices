import { useState } from 'react';
import { ArrowUpRight, Phone, CheckCircle, Mail } from 'lucide-react';
import { company } from '../../data/company';
import { useApp } from '../../context/AppContext';

export default function EditorialCTA() {
  const { openQuote, toast } = useApp();
  const [contactValue, setContactValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // No backend: opens the visitor's email app with a drafted enquiry to the company inbox.
  const handleSubmit = (e) => {
    e.preventDefault();
    const v = contactValue.trim();
    if (!v) {
      openQuote();
      return;
    }
    const body = `Please contact me about your services.\n\nMy email / phone: ${v}`;
    window.location.href = `mailto:${company.emails[0]}?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    toast('Email app opened with your enquiry.');
    setTimeout(() => {
      setSubmitted(false);
      setContactValue('');
    }, 4000);
  };

  return (
    <section className="section section--editorial-cta" aria-label="Consultation Request">
      <div className="container">
        <div className="cta-banner-editorial">
          <div className="cta-banner-editorial__content">
            <span className="cta-banner-editorial__eyebrow">
              CONTACT US
            </span>
            <h2 className="cta-banner-editorial__title">
              Need a reliable O&amp;M partner?
            </h2>
            <p className="cta-banner-editorial__desc">
              Tell us about your plant. Our engineers will respond with a practical plan.
            </p>

            <form className="cta-banner-editorial__form" onSubmit={handleSubmit}>
              <div className="cta-pill-input">
                <input
                  type="text"
                  placeholder="Enter your email or phone number..."
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  aria-label="Email or phone number"
                />
                <button
                  type="submit"
                  className="cta-pill-submit"
                >
                  <span>{submitted ? 'Email drafted' : 'Request a Call Back'}</span>
                  <span className="cta-pill-submit__icon">
                    {submitted ? <CheckCircle size={16} /> : <ArrowUpRight size={16} />}
                  </span>
                </button>
              </div>
            </form>

            <div className="cta-banner-editorial__quick">
              <span className="quick-label">Direct Line:</span>
              <a href={`tel:${company.offices[0].phones[0]}`} className="quick-link">
                <Phone size={14} />
                <span>+91 {company.offices[0].phones[0]}</span>
              </a>
              <span className="quick-dot">&bull;</span>
              <a href={`mailto:${company.emails[0]}`} className="quick-link">
                <Mail size={14} />
                <span>{company.emails[0]}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
