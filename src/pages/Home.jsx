import Hero from '../components/sections/Hero';
import WhoWeAre from '../components/sections/WhoWeAre';
import ServicesShowcase from '../components/sections/ServicesShowcase';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import ProjectsCarousel from '../components/sections/ProjectsCarousel';
import ClientsMarquee from '../components/sections/ClientsMarquee';
import EditorialCTA from '../components/sections/EditorialCTA';
import Marquee from '../components/ui/Marquee';
import AdScroller from '../components/ads/AdScroller';
import useDocumentTitle from '../hooks/useDocumentTitle';

const chips = [
  'Special Class IBR',
  "'A' Grade Electrical",
  'BOE Certified Team',
  'Transmission Lines up to 400 kV',
  'In-house NDT',
  'IBR 6G Welders',
  '1x135 MW Power Plant O&M',
  'CEA & CIEG Liaison',
];

export default function Home() {
  useDocumentTitle('');

  return (
    <div className="page-home-redesign">
      {/* 1. Hero with Floating Cards (Reference 1 & 2) */}
      <Hero />

      {/* Trust Credential Strip */}
      <div className="strip" aria-label="Company accreditations">
        <Marquee speed={32}>
          {chips.map((c) => (
            <span key={c} className="strip__chip">
              {c}
            </span>
          ))}
        </Marquee>
      </div>

      <AdScroller />

      {/* 2. Who We Are (Reference 4) */}
      <WhoWeAre />

      {/* 3. Services Showcase (Image-led editorial cards) */}
      <ServicesShowcase />

      {/* 4. Why Choose Us (Dark contrast section + 6-phase protocol) */}
      <WhyChooseUs />

      {/* 5. Projects & Case Studies (Reference 5 horizontal carousel) */}
      <ProjectsCarousel />

      {/* 6. Clients & Industrial Partners */}
      <ClientsMarquee />

      {/* 7. Editorial CTA Banner (Reference 3) */}
      <EditorialCTA />
    </div>
  );
}
