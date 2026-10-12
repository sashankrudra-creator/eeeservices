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
      title: 'PHOTOS FROM OUR SITES',
      desc: 'Quad line maintenance, bed coil replacement, substation works and panel erection.',
      linkText: 'VIEW FIELD ALBUM',
      linkHref: '#gallery-grid',
    },
    {
      type: 'stat',
      value: '4',
      label: 'PHOTO CATEGORIES',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'SAFE EXECUTION',
      desc: 'PTW systems, LOTO procedures and toolbox talks on every job.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_gallery.jpg"
        eyebrow="PHOTOS"
        title="FROM THE FIELD"
        text="Operation & maintenance, overhaul and revamp, erection and shutdown, fabrication and pipeline works."
        ctaText="Get a Quote"
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
