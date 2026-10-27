import { useEffect, useState } from 'react';
import { BannerCard } from './AdViews';
import useAds, { useNow } from '../../hooks/useAds';
import { liveAds } from '../../utils/adRules';
import { watchLiveBlogs } from '../../services/blogsService';
import './ads.css';

const MIN_PER_GROUP = 6; // enough cards to always fill a wide screen
const SECONDS_PER_CARD = 7;

// Smoothly scrolling row of clickable promotional banners and engineering blogs.
// Combines commercial ads with technical article spotlights.
export default function AdScroller() {
  const { ads } = useAds();
  const now = useNow();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const unsub = watchLiveBlogs(
      (items) => setBlogs(items || []),
      () => {}
    );
    return () => unsub();
  }, []);

  const standardBanners = liveAds(ads, 'banner', now);
  const blogBanners = blogs.map((b) => ({
    id: `blog-ad-${b.id}`,
    type: 'banner',
    title: b.title,
    description: `${b.category} · ${b.readTime}`,
    imageUrl: b.imageUrl || b.coverImage || '/images/ai/boiler-overhaul.jpg',
    linkUrl: `/blog/${b.slug}`,
    linkText: 'Read Article',
    isBlog: true,
  }));

  const banners = [...standardBanners, ...blogBanners];
  if (!banners.length) return null;

  // One banner has nothing to scroll past: show it as a single wide card.
  if (banners.length === 1) {
    return (
      <section className="adscroll" aria-label="Promotions and Insights">
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
