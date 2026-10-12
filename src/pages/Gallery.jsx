import PageHero from '../components/ui/PageHero';
import GalleryGrid from '../components/sections/GalleryGrid';
import CTABanner from '../components/sections/CTABanner';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useApp } from '../context/AppContext';

export default function Gallery() {
  useDocumentTitle('Gallery');
  const { openQuote } = useApp();

  const galleryCards = [
    {
      type: 'wide',
      thumb: '/images/service-2.jpg',
      title: 'PRECISION IN ACTION',
      desc: 'On-site snapshots of turbine overhauls, 400kV substation lines, and boiler revamps.',
      linkText: 'VIEW FIELD ALBUM',
      linkHref: '#gallery-grid',
    },
    {
      type: 'stat',
      value: '500+',
      label: 'SITE EXECUTIONS',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'SAFETY PROTOCOLS',
      desc: 'Strict PPE compliance, certified staging, and zero-accident execution in the field.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_gallery.jpg"
        eyebrow="FIELD VISUALS & SITES"
        title="FROM THE FIELD: ENGINEERING AT WORK"
        text="High-voltage switchyards, thermal boiler retrofits, emergency overhaul operations, and precision alloy pipeline fabrication across client plants."
        ctaText="Request Site Visit"
        onCtaClick={() => openQuote('Site Visit Enquiry')}
        cards={galleryCards}
      />
      <div id="gallery-grid">
        <GalleryGrid />
      </div>
      <CTABanner />
    </>
  );
}
