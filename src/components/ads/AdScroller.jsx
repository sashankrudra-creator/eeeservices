import { BannerCard } from './AdViews';
import useAds, { useNow } from '../../hooks/useAds';
import { liveAds } from '../../utils/adRules';
import './ads.css';

const MIN_PER_GROUP = 6; // enough cards to always fill a wide screen
const SECONDS_PER_CARD = 7;

// Smoothly scrolling row of clickable promotional banners. Reuses the site's own
// marquee animation (pauses on hover). Renders nothing when there are no live
// banners, so pages look exactly as before until an ad is switched on.
export default function AdScroller() {
  const { ads } = useAds();
  const now = useNow();
  const banners = liveAds(ads, 'banner', now);
  if (!banners.length) return null;

  // One banner has nothing to scroll past: show it as a single wide card.
  if (banners.length === 1) {
    return (
      <section className="adscroll" aria-label="Promotions">
        <div className="container"><BannerCard ad={banners[0]} solo /></div>
      </section>
    );
  }

  const repeats = Math.ceil(MIN_PER_GROUP / banners.length);
  const group = Array.from({ length: repeats }, () => banners).flat();
  const speed = group.length * SECONDS_PER_CARD;

  return (
    <section className="adscroll" aria-label="Promotions">
      <div className="marquee">
        <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
          <div className="marquee__group">
            {group.map((ad, i) => (<BannerCard key={`${ad.id}-${i}`} ad={ad} />))}
          </div>
          <div className="marquee__group" aria-hidden="true">
            {group.map((ad, i) => (<BannerCard key={`${ad.id}-${i}`} ad={ad} duplicate />))}
          </div>
        </div>
      </div>
    </section>
  );
}
