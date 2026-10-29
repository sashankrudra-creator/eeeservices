import { useState } from 'react';
import { Award, ZoomIn, CheckCircle2, ShieldCheck } from 'lucide-react';
import Modal from '../ui/Modal';
import Lightbox from '../ui/Lightbox';
import SmartImage from '../ui/SmartImage';

const isoCertificates = [
  {
    id: 'iso-9001',
    code: 'ISO 9001:2015',
    title: 'Quality Management System',
    scope: 'Quality management in power plant O&M, boiler overhaul, electrical EPC and equipment testing.',
    src: '/images/iso-9001-2015.jpg',
    caption: 'ISO 9001:2015 — Quality Management System (QMS)',
    category: 'ISO Certifications',
  },
  {
    id: 'iso-14001',
    code: 'ISO 14001:2015',
    title: 'Environmental Management System',
    scope: 'Environmental standards compliance, waste management, and sustainable energy services.',
    src: '/images/iso-14001-2015.jpg',
    caption: 'ISO 14001:2015 — Environmental Management System (EMS)',
    category: 'ISO Certifications',
  },
  {
    id: 'iso-45001',
    code: 'ISO 45001:2018',
    title: 'Occupational Health & Safety',
    scope: 'Occupational health, safety protocols, hazard mitigation, and workplace welfare across all plant sites.',
    src: '/images/iso-45001-2018.jpg',
    caption: 'ISO 45001:2018 — Occupational Health & Safety (OHSMS)',
    category: 'ISO Certifications',
  },
];

export default function IsoCertificatesModal({ open, onClose }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  return (
    <>
      <Modal open={open} onClose={onClose} title="ISO Certified Management Systems" size="xl">
        <div className="iso-modal">
          <div className="iso-modal__intro">
            <div className="iso-modal__badge-row">
              <span className="iso-pill"><ShieldCheck size={14} /> Integrated Management System (IMS)</span>
              <span className="iso-pill iso-pill--gold"><Award size={14} /> Accredited &amp; Certified</span>
            </div>
            <p className="iso-modal__desc">
              Triple E Services is certified under globally recognized International Organization for Standardization (ISO) standards, demonstrating our commitment to quality, environmental safety, and occupational health.
            </p>
          </div>

          <div className="iso-modal__grid">
            {isoCertificates.map((cert, index) => (
              <div key={cert.id} className="iso-card">
                <button
                  type="button"
                  className="iso-card__preview"
                  onClick={() => setLightboxIdx(index)}
                  aria-label={`View full certificate for ${cert.code}`}
                >
                  <SmartImage src={cert.src} alt={cert.caption} />
                  <span className="iso-card__overlay">
                    <ZoomIn size={22} />
                    <span>View Full Certificate</span>
                  </span>
                </button>
                <div className="iso-card__body">
                  <span className="iso-card__tag">{cert.code}</span>
                  <h4>{cert.title}</h4>
                  <p>{cert.scope}</p>
                  <button
                    type="button"
                    className="iso-card__action-btn"
                    onClick={() => setLightboxIdx(index)}
                  >
                    <ZoomIn size={14} /> Full Resolution
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="iso-modal__foot">
            <span className="iso-modal__hint">
              <CheckCircle2 size={15} /> All certificates verified &amp; certified. Click any certificate to inspect full resolution.
            </span>
          </div>
        </div>
      </Modal>

      {lightboxIdx !== null && (
        <Lightbox
          items={isoCertificates}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onIndex={setLightboxIdx}
        />
      )}
    </>
  );
}

